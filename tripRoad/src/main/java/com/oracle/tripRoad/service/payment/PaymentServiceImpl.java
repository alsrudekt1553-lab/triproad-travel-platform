package com.oracle.tripRoad.service.payment;

import com.oracle.tripRoad.config.KakaoPayConfig;
import com.oracle.tripRoad.domain.booking.Booking;
import com.oracle.tripRoad.domain.payment.Payment;
import com.oracle.tripRoad.dto.payment.PaymentDto;
import com.oracle.tripRoad.repository.booking.BookingRepository;
import com.oracle.tripRoad.repository.payment.PaymentRepository;
import com.oracle.tripRoad.service.point.UserPointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate;
    private final KakaoPayConfig kakaoPayConfig;
    private final UserPointService userPointService;

    @Override
    @Transactional
    public PaymentDto.ReadyResponse readyPayment(PaymentDto.ReadyRequest request) {

        Long partnerOrderId = request.getBookingId();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "SECRET_KEY " + kakaoPayConfig.getSecretKey());

        Map<String, Object> body = new HashMap<>();
        body.put("cid", KakaoPayConfig.CID);
        body.put("partner_order_id", String.valueOf(partnerOrderId));
        body.put("partner_user_id", String.valueOf(request.getUserId()));
        body.put("item_name", request.getItemName());
        body.put("quantity", 1);
        body.put("total_amount", request.getAmount());
        body.put("tax_free_amount", 0);
        body.put("approval_url", request.getApprovalUrl());
        body.put("cancel_url", request.getCancelUrl());
        body.put("fail_url", request.getFailUrl());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        Map<String, Object> response = restTemplate.postForObject(KakaoPayConfig.READY_URL, entity, Map.class);

        if (response == null) {
            throw new RuntimeException("카카오페이 결제 준비 실패: 응답 없음");
        }

        String tid = (String) response.get("tid");
        String nextRedirectPcUrl = (String) response.get("next_redirect_pc_url");
        String nextRedirectMobileUrl = (String) response.get("next_redirect_mobile_url");

        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .userId(request.getUserId())
                .scheduleId(request.getScheduleId())
                .tid(tid)
                .partnerOrderId(partnerOrderId)
                .amount(request.getAmount())
                .paymentMethodType(100)
                .payStatus(Payment.PAY_STATUS_READY)
                .build();

        paymentRepository.save(payment);

        return PaymentDto.ReadyResponse.builder()
                .tid(tid)
                .nextRedirectPcUrl(nextRedirectPcUrl)
                .nextRedirectMobileUrl(nextRedirectMobileUrl)
                .partnerOrderId(partnerOrderId)
                .build();
    }

    @Override
    @Transactional
    public PaymentDto.ApproveResponse approvePayment(PaymentDto.ApproveRequest request) {

        Payment payment = paymentRepository.findByTid(request.getTid())
                .orElseThrow(() -> new RuntimeException("결제 정보 없음: tid=" + request.getTid()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "SECRET_KEY " + kakaoPayConfig.getSecretKey());

        Map<String, Object> body = new HashMap<>();
        body.put("cid", KakaoPayConfig.CID);
        body.put("tid", request.getTid());
        body.put("partner_order_id", String.valueOf(payment.getPartnerOrderId()));
        body.put("partner_user_id", String.valueOf(payment.getUserId()));
        body.put("pg_token", request.getPgToken());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        Map<String, Object> response;
        try {
            response = restTemplate.postForObject(KakaoPayConfig.APPROVE_URL, entity, Map.class);
        } catch (Exception e) {
            log.error("카카오페이 승인 실패: {}", e.getMessage());
            throw new RuntimeException("카카오페이 승인 실패: " + e.getMessage());
        }

        if (response == null) {
            throw new RuntimeException("카카오페이 승인 응답 없음");
        }

        payment.approve(LocalDateTime.now());
        paymentRepository.save(payment);

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("예약 정보 없음: id=" + payment.getBookingId()));
        booking.confirm();
        bookingRepository.save(booking);

        log.info("결제 승인 완료 - bookingId={}, tid={}", booking.getBookingId(), request.getTid());

        return PaymentDto.ApproveResponse.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(booking.getBookingId())
                .tid(request.getTid())
                .amount(payment.getAmount())
                .payStatus(payment.getPayStatus())
                .approvedAt(payment.getApprovedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto.Detail getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("결제 정보 없음: bookingId=" + bookingId));

        return PaymentDto.Detail.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBookingId())
                .tid(payment.getTid())
                .amount(payment.getAmount())
                .payStatus(payment.getPayStatus())
                .approvedAt(payment.getApprovedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto.Detail> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserIdOrderByApprovedAtDesc(userId).stream()
                .map(payment -> PaymentDto.Detail.builder()
                        .paymentId(payment.getPaymentId())
                        .bookingId(payment.getBookingId())
                        .tid(payment.getTid())
                        .amount(payment.getAmount())
                        .payStatus(payment.getPayStatus())
                        .approvedAt(payment.getApprovedAt())
                        .build())
                .toList();
    }

    // ============================================================
    // 결제 취소 — 카카오 cancelUrl 콜백 시 호출
    //
    // 흐름 (전부 소프트 삭제):
    //   1. PAYMENT 처리 — READY(100) 상태만 payStatus=CANCELLED(900)
    //                    APPROVED(500)은 건드리지 않음 (별도 환불 프로세스 필요)
    //   2. 적립금 환원 — booking 변경 전 pointUsed 조회 후 환원
    //                  (멱등성: UserPointService 내부에서 보장)
    //   3. BOOKING 처리 — HOLD(100)만 status=CANCELLED(900)로 변경
    //                    CONFIRMED(500)는 건드리지 않음
    //
    // 멱등 보장:
    //   - 이미 취소된 건은 status 체크로 통과
    //   - 동일 booking 중복 cancel 호출도 환원 history가 막아줌
    //   → 스케줄러 + 사용자 cancel 동시 호출 안전
    // ============================================================
    @Override
    @Transactional
    public void cancelPayment(Long bookingId) {

        // 1. PAYMENT 소프트 삭제
        paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
            if (payment.getPayStatus() == Payment.PAY_STATUS_READY) {
                payment.cancel();
                log.info("결제 취소 - PAYMENT 소프트 삭제 완료: paymentId={}, bookingId={}",
                        payment.getPaymentId(), bookingId);
            } else if (payment.getPayStatus() == Payment.PAY_STATUS_CANCELLED) {
                log.info("이미 취소된 결제 - silent pass: bookingId={}", bookingId);
            } else {
                // APPROVED 상태는 별도 환불 프로세스 필요
                log.warn("이미 승인된 결제는 cancel API로 처리 불가: bookingId={}, payStatus={}",
                        bookingId, payment.getPayStatus());
            }
        });

        // 2. + 3. BOOKING 처리 — 환원 먼저, 상태 변경 나중
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            if (booking.getStatus() == Booking.STATUS_HOLD) {

                // 적립금 환원
                int pointToRefund = booking.getPointUsed() != null ? booking.getPointUsed() : 0;
                if (pointToRefund > 0) {
                    userPointService.refundPoint(
                            booking.getUserId(),
                            pointToRefund,
                            bookingId
                    );
                }

                // 소프트 삭제 — row 보존
                booking.cancel();
                log.info("결제 취소 - BOOKING 소프트 삭제 완료: bookingId={}, refundPoint={}",
                        bookingId, pointToRefund);
            } else if (booking.getStatus() == Booking.STATUS_CANCELLED) {
                log.info("이미 취소된 예약 - silent pass: bookingId={}", bookingId);
            } else {
                log.warn("이미 확정된 예약은 cancel API로 처리 불가: bookingId={}, status={}",
                        bookingId, booking.getStatus());
            }
        });
    }
}