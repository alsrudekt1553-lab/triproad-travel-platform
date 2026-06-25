package com.oracle.tripRoad.dto.agreement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AgreementDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Info {
        private Long          agreementId;
        private int           typeCode;        
        private String        version;         
        private String        title;
        private String        content;         
        private Integer       isRequired;      
        private LocalDate     effectiveFrom;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConsentRequest {
        private Long agreementId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConsentResponse {
        private Long          userAgreementId;
        private Long          bookingId;
        private Long          agreementId;
        private int           typeCode;       
        private String        title;
        private String        version;         
        private LocalDateTime agreedAt;
        private String        content;       
        private Integer       isRequired;      
    }
}