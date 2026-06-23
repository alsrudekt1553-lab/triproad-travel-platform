package com.oracle.tripRoad.service.point;

import com.oracle.tripRoad.domain.point.UserPoint;
import com.oracle.tripRoad.domain.point.UserPointHistory;
import com.oracle.tripRoad.dto.point.UserPointDto;
import com.oracle.tripRoad.exception.InsufficientPointException;
import com.oracle.tripRoad.repository.point.UserPointHistoryRepository;
import com.oracle.tripRoad.repository.point.UserPointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserPointServiceImpl implements UserPointService {

    private final UserPointRepository userPointRepository;
    private final UserPointHistoryRepository userPointHistoryRepository;


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

        userPoint.deduct(amount);

        UserPointHistory history = UserPointHistory.builder()
                .userId(userId)
                .bookingId(bookingId)
                .pointAmount(amount)
                .pointBalanceAfter(userPoint.getPointBalance())
                .historyType(UserPointHistory.TYPE_DEDUCT)
                .build();
        userPointHistoryRepository.save(history);

        log.info("적립금 차감 완료 - userId={}, amount={}, bookingId={}, balanceAfter={}",
                userId, amount, bookingId, userPoint.getPointBalance());
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


        UserPoint userPoint = userPointRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> userPointRepository.save(
                        UserPoint.builder()
                                .userId(userId)
                                .pointBalance(0)
                                .build()
                ));

        userPoint.refund(amount);

        UserPointHistory history = UserPointHistory.builder()
                .userId(userId)
                .bookingId(bookingId)
                .pointAmount(amount)
                .pointBalanceAfter(userPoint.getPointBalance())
                .historyType(UserPointHistory.TYPE_REFUND)
                .build();
        userPointHistoryRepository.save(history);

        log.info("적립금 환원 완료 - userId={}, amount={}, bookingId={}, balanceAfter={}",
                userId, amount, bookingId, userPoint.getPointBalance());
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
                        .userPointHistoryId(h.getUserPointHistoryId())
                        .userId(h.getUserId())
                        .bookingId(h.getBookingId())
                        .pointAmount(h.getPointAmount())
                        .pointBalanceAfter(h.getPointBalanceAfter())
                        .historyType(h.getHistoryType())
                        .createdAt(h.getCreatedAt())
                        .build())
                .toList();
    }
}