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
import org.springframework.core.ParameterizedTypeReference;
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

        Map<String, Object> response;
        try {
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    KakaoPayConfig.READY_URL,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            response = responseEntity.getBody();
        } catch (Exception e) {
            log.error("[KakaoPay] ready 실패 - bookingId={}, amount={}",
                    request.getBookingId(), request.getAmount(), e);
            throw new IllegalArgumentException(
                    "결제 처리 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
        }

        if (response == null) {
            log.error("[KakaoPay] ready 응답 없음 - bookingId={}", request.getBookingId());
            throw new IllegalArgumentException(
                    "결제 처리 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
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
                .orElseThrow(() -> new IllegalArgumentException(
                        "결제 정보를 찾을 수 없습니다."));

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
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    KakaoPayConfig.APPROVE_URL,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            response = responseEntity.getBody();
        } catch (Exception e) {
            log.error("[KakaoPay] approve 실패 - tid={}, bookingId={}",
                    request.getTid(), payment.getBookingId(), e);
            throw new IllegalArgumentException(
                    "결제 승인 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요."
            );
        }

        if (response == null) {
            log.error("[KakaoPay] approve 응답 없음 - tid={}", request.getTid());
            throw new IllegalArgumentException(
                    "결제 승인 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요."
            );
        }

        payment.approve(LocalDateTime.now());
        paymentRepository.save(payment);

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "예약 정보를 찾을 수 없습니다."));
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
                .orElseThrow(() -> new IllegalArgumentException(
                        "결제 정보를 찾을 수 없습니다."));

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

    @Override
    @Transactional
    public void cancelPayment(Long bookingId) {

        paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
            if (payment.getPayStatus() == Payment.PAY_STATUS_READY) {
                payment.cancel();
                log.info("결제 취소 - PAYMENT 소프트 삭제 완료: paymentId={}, bookingId={}",
                        payment.getPaymentId(), bookingId);
            } else if (payment.getPayStatus() == Payment.PAY_STATUS_CANCELLED) {
                log.info("이미 취소된 결제 - silent pass: bookingId={}", bookingId);
            } else {
                log.warn("APPROVED 결제는 cancel API로 처리 불가 — refundApprovedPayment 사용: " +
                        "bookingId={}, payStatus={}", bookingId, payment.getPayStatus());
            }
        });

        bookingRepository.findById(bookingId).ifPresent(booking -> {
            if (booking.getStatus() == Booking.STATUS_HOLD) {

                int pointToRefund = booking.getPointUsed() != null ? booking.getPointUsed() : 0;
                if (pointToRefund > 0) {
                    userPointService.refundPoint(
                            booking.getUserId(),
                            pointToRefund,
                            bookingId
                    );
                }

                booking.cancel();
                log.info("결제 취소 - BOOKING 소프트 삭제 완료: bookingId={}, refundPoint={}",
                        bookingId, pointToRefund);
            } else if (booking.getStatus() == Booking.STATUS_CANCELLED) {
                log.info("이미 취소된 예약 - silent pass: bookingId={}", bookingId);
            } else {
                log.warn("CONFIRMED 예약은 cancel API로 처리 불가 — refundApprovedPayment 사용: " +
                        "bookingId={}, status={}", bookingId, booking.getStatus());
            }
        });
    }

}
