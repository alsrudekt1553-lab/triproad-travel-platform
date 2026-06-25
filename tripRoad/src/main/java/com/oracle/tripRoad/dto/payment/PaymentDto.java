package com.oracle.tripRoad.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ReadyRequest {
        private Long bookingId;
        private Long userId;
        private Long scheduleId;
        private String itemName;
        private Long amount;
        private String approvalUrl;
        private String cancelUrl;
        private String failUrl;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ReadyResponse {
        private String tid;
        private String nextRedirectPcUrl;
        private String nextRedirectMobileUrl;
        private Long partnerOrderId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ApproveRequest {
        private String tid;
        private String pgToken;
        private Long partnerOrderId;
        private Long userId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ApproveResponse {
        private Long paymentId;
        private Long bookingId;
        private String tid;
        private Long amount;
        private int payStatus;
        private LocalDateTime approvedAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Detail {
        private Long paymentId;
        private Long bookingId;
        private String tid;
        private Long amount;
        private int payStatus;
        private LocalDateTime approvedAt;
    }
}

