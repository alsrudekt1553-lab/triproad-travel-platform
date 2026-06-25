package com.oracle.tripRoad.controller;

import com.oracle.tripRoad.dto.point.UserPointDto;
import com.oracle.tripRoad.service.point.UserPointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/point")
@RequiredArgsConstructor
public class PointController {

    private final UserPointService userPointService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getBalance(@PathVariable("userId") Long userId) {
        try {
            UserPointDto.Balance balance = userPointService.getBalance(userId);
            return ResponseEntity.ok(balance);
        } catch (IllegalArgumentException e) {
            log.warn("적립금 잔액 조회 실패 - userId={}, msg={}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<?> getHistory(@PathVariable("userId") Long userId) {
        try {
            List<UserPointDto.History> history = userPointService.getHistory(userId);
            return ResponseEntity.ok(history);
        } catch (IllegalArgumentException e) {
            log.warn("적립금 이력 조회 실패 - userId={}, msg={}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


