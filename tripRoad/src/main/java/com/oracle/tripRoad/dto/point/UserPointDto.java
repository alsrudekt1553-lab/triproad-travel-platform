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
        private Long          userPointHistoryId;
        private Long          userId;
        private Long          bookingId;
        private int           pointAmount;
        private int           pointBalanceAfter;
        private int           historyType;
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