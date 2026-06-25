package com.oracle.tripRoad.service.point;

import com.oracle.tripRoad.domain.point.UserPoint;
import com.oracle.tripRoad.domain.point.UserPointHistory;
import com.oracle.tripRoad.domain.point.UserPointLedger;
import com.oracle.tripRoad.dto.point.UserPointDto;
import com.oracle.tripRoad.exception.InsufficientPointException;
import com.oracle.tripRoad.repository.point.UserPointHistoryRepository;
import com.oracle.tripRoad.repository.point.UserPointLedgerRepository;
import com.oracle.tripRoad.repository.point.UserPointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserPointServiceImpl implements UserPointService {

    private final UserPointRepository userPointRepository;
    private final UserPointHistoryRepository userPointHistoryRepository;
    private final UserPointLedgerRepository userPointLedgerRepository;

    @Override
    @Transactional
    public void deductPoint(Long userId, int amount, Long bookingId) {

        if (amount == 0) {
            return;
        }
        if (amount < 0) {
            throw new IllegalArgumentException("차감 금액은 0 이상이어야 합니다. amount=" + amount);
        }

        UserPoint userPoint = userPointRepository.findByUserIdWithLock(userId)
                .orElseThrow(() -> new InsufficientPointException(
                        "적립금이 부족합니다. 잔액=0, 요청=" + amount));

        if (userPoint.getPointBalance() < amount) {
            throw new InsufficientPointException(
                    "적립금이 부족합니다. 잔액=" + userPoint.getPointBalance() + ", 요청=" + amount);
        }

        List<UserPointLedger> ledgers =
                userPointLedgerRepository.findActiveByUserIdOrderByExpiresAtAscWithLock(userId);

        int remaining = amount;
        for (UserPointLedger ledger : ledgers) {
            if (remaining == 0) break;

            int actual = ledger.deduct(remaining);
            if (actual == 0) continue;
            int balanceAfter = userPoint.getPointBalance() - (amount - remaining) - actual;

            UserPointHistory history = UserPointHistory.builder()
                    .userId(userId)
                    .bookingId(bookingId)
                    .ledgerId(ledger.getLedgerId())
                    .pointAmount(actual)
                    .pointBalanceAfter(balanceAfter)
                    .historyType(UserPointHistory.TYPE_DEDUCT)
                    .relatedType(UserPointHistory.RELATED_BOOKING)
                    .relatedId(bookingId)
                    .build();
            userPointHistoryRepository.save(history);

            remaining -= actual;
        }

        if (remaining > 0) {
            log.error("LEDGER 잔여액 부족 - 정합성 점검 필요. userId={}, 미차감액={}, ledgerCount={}",
                    userId, remaining, ledgers.size());
            throw new IllegalStateException("적립금 사용 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }

        userPoint.deduct(amount);

        log.info("적립금 차감 완료 - userId={}, amount={}, bookingId={}, balanceAfter={}, 사용ledger수={}",
                userId, amount, bookingId, userPoint.getPointBalance(),
                ledgers.stream().filter(l -> l.getRemainingAmount() < l.getPointAmount()).count());
    }

    @Override
    @Transactional
    public void refundPoint(Long userId, int amount, Long bookingId) {

        if (amount == 0) {
            return;
        }
        if (amount < 0) {
            throw new IllegalArgumentException("환원 금액은 0 이상이어야 합니다. amount=" + amount);
        }

        if (userPointHistoryRepository.existsByBookingIdAndHistoryType(
                bookingId, UserPointHistory.TYPE_REFUND)) {
            log.info("이미 환원된 예약 - silent return. bookingId={}", bookingId);
            return;
        }

        List<UserPointHistory> deductHistories =
                userPointHistoryRepository.findByBookingIdAndHistoryType(
                        bookingId, UserPointHistory.TYPE_DEDUCT);

        if (deductHistories.isEmpty()) {
            log.error("환원 실패 - 차감 이력 없음. bookingId={}, userId={}, amount={}",
                    bookingId, userId, amount);
            return;
        }

        UserPoint userPoint = userPointRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> userPointRepository.save(
                        UserPoint.builder()
                                .userId(userId)
                                .pointBalance(0)
                                .build()
                ));
        int totalRefunded = 0;
        int totalSkippedExpired = 0;

        for (UserPointHistory deductHistory : deductHistories) {
            Long ledgerId = deductHistory.getLedgerId();
            int refundAmount = deductHistory.getPointAmount();

            if (ledgerId == null) {
                log.error("환원 실패 - history.ledgerId null. historyId={}, bookingId={}",
                        deductHistory.getHistoryId(), bookingId);
                continue;
            }

            UserPointLedger ledger = userPointLedgerRepository.findById(ledgerId)
                    .orElse(null);
            if (ledger == null) {
                log.error("환원 실패 - ledger 조회 불가. ledgerId={}, bookingId={}",
                        ledgerId, bookingId);
                continue;
            }

            if (ledger.getStatus() == UserPointLedger.STATUS_EXPIRED) {
                totalSkippedExpired += refundAmount;
                log.warn("만료된 ledger - 환원 스킵, 운영자 수동 보상 필요. " +
                                "ledgerId={}, bookingId={}, userId={}, skipAmount={}, expiresAt={}",
                        ledgerId, bookingId, userId, refundAmount, ledger.getExpiresAt());
                continue;
            }

            ledger.restore(refundAmount);
            totalRefunded += refundAmount;

            UserPointHistory refundHistory = UserPointHistory.builder()
                    .userId(userId)
                    .bookingId(bookingId)
                    .ledgerId(ledgerId)
                    .pointAmount(refundAmount)
                    .pointBalanceAfter(userPoint.getPointBalance() + totalRefunded)
                    .historyType(UserPointHistory.TYPE_REFUND)
                    .relatedType(UserPointHistory.RELATED_BOOKING)
                    .relatedId(bookingId)
                    .build();
            userPointHistoryRepository.save(refundHistory);
        }

        if (totalRefunded > 0) {
            userPoint.refund(totalRefunded);
        }

        if (totalSkippedExpired > 0) {
            log.warn("환원 완료 - 만료 ledger 스킵 금액 발생. " +
                            "bookingId={}, userId={}, 정상환원={}, 만료스킵={}, 운영자 보상 검토 필요",
                    bookingId, userId, totalRefunded, totalSkippedExpired);
        }

        log.info("적립금 환원 완료 - userId={}, totalRefunded={}, totalSkippedExpired={}, bookingId={}, balanceAfter={}",
                userId, totalRefunded, totalSkippedExpired, bookingId, userPoint.getPointBalance());
    }

    @Override
    @Transactional(readOnly = true)
    public UserPointDto.Balance getBalance(Long userId) {
        return userPointRepository.findByUserId(userId)
                .map(up -> UserPointDto.Balance.builder()
                        .userId(up.getUserId())
                        .pointBalance(up.getPointBalance())
                        .updatedAt(up.getUpdatedAt())
                        .build())
                .orElseGet(() -> UserPointDto.Balance.builder()
                        .userId(userId)
                        .pointBalance(0)
                        .updatedAt(null)
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserPointDto.History> getHistory(Long userId) {
        return userPointHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(h -> UserPointDto.History.builder()
                        .historyId(h.getHistoryId())
                        .userId(h.getUserId())
                        .bookingId(h.getBookingId())
                        .ledgerId(h.getLedgerId())
                        .pointAmount(h.getPointAmount())
                        .pointBalanceAfter(h.getPointBalanceAfter())
                        .historyType(h.getHistoryType())
                        .relatedType(h.getRelatedType())
                        .relatedId(h.getRelatedId())
                        .scheduleId(h.getScheduleId())
                        .createdAt(h.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void expirePoints() {

        LocalDateTime now = LocalDateTime.now();
        List<UserPointLedger> expired = userPointLedgerRepository.findExpiredActiveLedgers(now);

        if (expired.isEmpty()) {
            log.debug("만료 처리 대상 없음");
            return;
        }

        Map<Long, Integer> expiredAmountByUser = new HashMap<>();

        for (UserPointLedger ledger : expired) {
            int remainingBefore = ledger.getRemainingAmount();

            ledger.expire();

            if (remainingBefore > 0) {
                Long userId = ledger.getUserId();
                int currentBalance = userPointRepository.findByUserId(userId)
                        .map(UserPoint::getPointBalance)
                        .orElse(0);

                UserPointHistory expireHistory = UserPointHistory.builder()
                        .userId(userId)
                        .ledgerId(ledger.getLedgerId())
                        .pointAmount(remainingBefore)
                        .pointBalanceAfter(currentBalance - remainingBefore)
                        .historyType(UserPointHistory.TYPE_EXPIRE)
                        .relatedType(UserPointHistory.RELATED_SYSTEM)
                        .build();
                userPointHistoryRepository.save(expireHistory);

                expiredAmountByUser.merge(userId, remainingBefore, Integer::sum);
            }
        }

        for (Map.Entry<Long, Integer> entry : expiredAmountByUser.entrySet()) {
            Long userId = entry.getKey();
            int totalExpired = entry.getValue();

            userPointRepository.findByUserIdWithLock(userId).ifPresent(up -> {
                int current = up.getPointBalance();
                if (current >= totalExpired && totalExpired > 0) {
                    up.deduct(totalExpired);
                }
            });
        }

        log.info("만료 처리 완료 - 만료ledger수={}, 영향유저수={}",
                expired.size(), expiredAmountByUser.size());
    }

}