package com.oracle.tripRoad.controller;

import com.oracle.tripRoad.dto.agreement.AgreementDto;
import com.oracle.tripRoad.service.agreement.AgreementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/agreement")
@RequiredArgsConstructor
public class AgreementController {

    private final AgreementService agreementService;


    @GetMapping("/current")
    public ResponseEntity<?> getCurrentAgreements() {
        try {
            List<AgreementDto.Info> response = agreementService.getCurrentAgreements();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("현재 유효 약관 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body("약관 조회 실패: " + e.getMessage());
        }
    }
}