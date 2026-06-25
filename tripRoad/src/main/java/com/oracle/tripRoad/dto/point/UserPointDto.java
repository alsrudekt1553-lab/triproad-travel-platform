package com.oracle.tripRoad.dto.point;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserPointDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Balance {
        private Long          userId;
        private int           pointBalance;
        private LocalDateTime updatedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class History {
        private Long          historyId;
        private Long          userId;
        private Long          bookingId;
        private Long          ledgerId;       
        private int           pointAmount;
        private int           pointBalanceAfter;
        private int           historyType;     
        private String        relatedType;     
        private Long          relatedId;       
        private Long          scheduleId;     
        private LocalDateTime createdAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UseRequest {
        private Long userId;
        private int  amount;
        private Long bookingId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RefundRequest {
        private Long userId;
        private int  amount;
        private Long bookingId;
    }
}