package com.oracle.tripRoad.service.point;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PointExpireScheduler {

    private final UserPointService userPointService;

    @Scheduled(cron = "0 0 3 * * *")
    public void expireLedgers() {
        try {
            log.info("적립금 만료 스케줄러 실행 시작");
            userPointService.expirePoints();
            log.info("적립금 만료 스케줄러 실행 완료");
        } catch (Exception e) {
            log.error("적립금 만료 처리 실패: {}", e.getMessage(), e);
        }
    }
}