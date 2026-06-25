package com.oracle.tripRoad.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BookingDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HoldRequest {
        private Long userId;
        private Long scheduleId;
        private int  headcount;

        private String     reserverName;
        private String     reserverPhone;
        private String     reserverEmail;
        private int        pointUsed;     
        private List<Long> agreementIds;   
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HoldResponse {
        private Long          bookingId;
        private Long          userId;
        private Long          scheduleId;
        private int           headcount;
        private Long          totalPrice;
        private Long          discountAmount;
        private Long          finalPrice;
        private int           status;
        private LocalDateTime holdAt;
        private LocalDateTime createdAt;

        private String reserverName;
        private String reserverPhone;
        private String reserverEmail;
        private int    pointUsed;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConfirmResponse {
        private Long          bookingId;
        private int           status;
        private LocalDateTime updatedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InfoResponse {
        private Long          bookingId;
        private Long          userId;
        private Long          scheduleId;
        private int           headcount;
        private Long          totalPrice;
        private Long          discountAmount;
        private Long          finalPrice;
        private int           status;
        private LocalDateTime holdAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private String reserverName;
        private String reserverPhone;
        private String reserverEmail;
        private int    pointUsed;

        private String    productName;
        private LocalDate startDate;
        private LocalDate endDate;

        private int           payStatus;      
        private LocalDateTime approvedAt;     
        private int           paymentMethod;  
    }
}