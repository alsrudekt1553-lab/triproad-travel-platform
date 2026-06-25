package com.oracle.tripRoad.controller;

import com.oracle.tripRoad.dto.agreement.AgreementDto;
import com.oracle.tripRoad.exception.ForbiddenException;
import com.oracle.tripRoad.service.agreement.AgreementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/agreement")
@RequiredArgsConstructor
public class AgreementController {

    private final AgreementService agreementService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentAgreements(
            @RequestParam(value = "productId",  required = false) Long productId,
            @RequestParam(value = "scheduleId", required = false) Long scheduleId) {
        try {
            List<AgreementDto.Info> response =
                    agreementService.getCurrentAgreements(productId, scheduleId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("현재 유효 약관 조회 실패 - productId={}, scheduleId={}, msg={}",
                    productId, scheduleId, e.getMessage());
            return ResponseEntity.badRequest().body("약관 조회 실패: " + e.getMessage());
        }
    }


    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getAgreementsByBookingId(@PathVariable("bookingId") Long bookingId) {
        try {
            List<AgreementDto.ConsentResponse> response =
                    agreementService.getAgreementsByBookingId(bookingId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("예약별 약관 동의 이력 조회 실패 - bookingId={}, msg={}", bookingId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("예약별 약관 동의 이력 조회 실패 - bookingId={}, msg={}", bookingId, e.getMessage());
            return ResponseEntity.badRequest().body("약관 동의 이력 조회 실패: " + e.getMessage());
        }
    }

    @PatchMapping("/withdraw/{userAgreementId}")
    public ResponseEntity<?> withdrawAgreement(
            @PathVariable("userAgreementId") Long userAgreementId,
            @RequestParam("userId") Long userId) {
        try {
            agreementService.withdrawAgreement(userAgreementId, userId);
            return ResponseEntity.ok("약관 동의 철회 완료");
        } catch (ForbiddenException e) {

            log.warn("약관 철회 권한 없음 - userAgreementId={}, userId={}, msg={}",
                    userAgreementId, userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("약관 철회 실패 - userAgreementId={}, userId={}, msg={}",
                    userAgreementId, userId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("약관 철회 실패 - userAgreementId={}, userId={}, msg={}",
                    userAgreementId, userId, e.getMessage());
            return ResponseEntity.badRequest().body("약관 철회 실패: " + e.getMessage());
        }
    }
}