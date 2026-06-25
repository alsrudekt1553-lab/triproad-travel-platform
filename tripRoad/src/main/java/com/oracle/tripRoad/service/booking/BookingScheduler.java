package com.oracle.tripRoad.service.booking;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingService bookingService;

    @Scheduled(fixedRate = 60000)
    public void cleanUpExpiredHolds() {
        try {
            log.debug("HOLD 만료 스케줄러 실행");
            bookingService.releaseExpiredHolds();
        } catch (Exception e) {
            log.error("HOLD 만료 처리 실패: {}", e.getMessage(), e);
        }
    }
}

