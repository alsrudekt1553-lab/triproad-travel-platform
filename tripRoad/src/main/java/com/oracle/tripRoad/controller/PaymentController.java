package com.oracle.tripRoad.controller;

import com.oracle.tripRoad.dto.payment.PaymentDto;
import com.oracle.tripRoad.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

	@PostMapping("/ready")
	public ResponseEntity<?> readyPayment(@RequestBody PaymentDto.ReadyRequest request) {
		try {
			PaymentDto.ReadyResponse response = paymentService.readyPayment(request);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("결제 준비 실패: {}", e.getMessage());
			return ResponseEntity.badRequest().body("결제 준비 실패: " + e.getMessage());
		}
	}

	@PostMapping("/approve")
	public ResponseEntity<?> approvePayment(@RequestBody PaymentDto.ApproveRequest request) {
		try {
			PaymentDto.ApproveResponse response = paymentService.approvePayment(request);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("결제 승인 실패: {}", e.getMessage());
			return ResponseEntity.badRequest().body("결제 승인 실패: " + e.getMessage());
		}
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<?> getPayment(@PathVariable("bookingId") Long bookingId) {
		try {
			PaymentDto.Detail response = paymentService.getPaymentByBookingId(bookingId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.warn("결제 조회 실패: {}", e.getMessage());
			return ResponseEntity.badRequest().body("결제 정보 없음: " + e.getMessage());
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> getPaymentsByUserId(@PathVariable("userId") Long userId) {
		try {
			return ResponseEntity.ok(paymentService.getPaymentsByUserId(userId));
		} catch (Exception e) {
			log.warn("회원별 결제 조회 실패: {}", e.getMessage());
			return ResponseEntity.badRequest().body("결제 내역 조회 실패: " + e.getMessage());
		}
	}

	@DeleteMapping("/cancel/{bookingId}")
	public ResponseEntity<?> cancelPayment(@PathVariable("bookingId") Long bookingId) {
		try {
			paymentService.cancelPayment(bookingId);
			return ResponseEntity.ok("결제 취소 처리 완료");
		} catch (Exception e) {
			log.error("결제 취소 실패: {}", e.getMessage());
			return ResponseEntity.badRequest().body("결제 취소 실패: " + e.getMessage());
		}
	}

}