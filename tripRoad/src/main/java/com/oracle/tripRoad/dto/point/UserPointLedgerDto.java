package com.oracle.tripRoad.dto.point;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


public class UserPointLedgerDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Detail {
        private Long          ledgerId;
        private Long          userId;
        private int           pointAmount;     
        private int           remainingAmount; 
        private int           sourceType;       
                                                
        private Long          sourceId;        
        private LocalDateTime earnedAt;         
        private LocalDateTime expiresAt;        
        private int           status;           
    }


    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SourceSummary {
        private int sourceType;          
        private int totalRemaining;     
        private int ledgerCount;         
    }


    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExpiringSoon {
        private Long          ledgerId;
        private Long          userId;
        private int           remainingAmount;
        private LocalDateTime expiresAt;
        private long          daysUntilExpire; 
    }
}