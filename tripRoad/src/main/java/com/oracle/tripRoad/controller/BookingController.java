package com.oracle.tripRoad.controller;

import com.oracle.tripRoad.dto.booking.BookingDto;
import com.oracle.tripRoad.dto.booking.BookingScheduleViewDto;
import com.oracle.tripRoad.service.booking.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hold")
    public ResponseEntity<?> holdBooking(@RequestBody BookingDto.HoldRequest request,
                                         HttpServletRequest httpRequest) {
        try {
            String ipAddress = extractClientIp(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            BookingDto.HoldResponse response = bookingService.holdBooking(request, ipAddress, userAgent);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            log.warn("선점 실패 - 인원 부족: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("선점 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<?> confirmBooking(@PathVariable("bookingId") Long bookingId) {
        try {
            BookingDto.ConfirmResponse response = bookingService.confirmBooking(bookingId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.warn("예약 확정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/release/{bookingId}")
    public ResponseEntity<?> releaseBooking(@PathVariable("bookingId") Long bookingId) {
        try {
            bookingService.releaseBooking(bookingId);
            return ResponseEntity.ok("선점 해제 완료");
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.warn("선점 해제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable("userId") Long userId) {
        try {
            return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
        } catch (Exception e) {
            log.warn("회원별 예약 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body("예약 내역 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetail(@PathVariable("bookingId") Long bookingId) {
        try {
            BookingDto.InfoResponse response = bookingService.getBookingDetail(bookingId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("예약 상세 조회 실패 - bookingId={}, msg={}", bookingId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<?> getScheduleForBooking(@PathVariable("scheduleId") Long scheduleId) {
        try {
            BookingScheduleViewDto response = bookingService.getScheduleForBooking(scheduleId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("일정 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractClientIp(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}