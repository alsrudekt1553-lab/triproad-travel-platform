package com.oracle.tripRoad.domain.agreement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "AGREEMENT_TYPE")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "agreementId")
public class AgreementType {


    public static final int TYPE_PRIVACY       = 100;   // 개인정보 수집·이용
    public static final int TYPE_THIRD_PARTY   = 200;   // 제3자 정보 제공
    public static final int TYPE_PAYMENT_AGENT = 300;   // 결제대행 서비스
    public static final int TYPE_MARKETING     = 400;   // 마케팅 정보 수신 (선택, v2)

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "AGREEMENT_TYPE_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "AGREEMENT_TYPE_SEQ_GENERATOR",
            sequenceName = "AGREEMENT_TYPE_SEQ",
            allocationSize = 1
    )
    @Column(name = "AGREEMENT_ID")
    private Long agreementId;


    @Column(name = "TYPE_CODE", nullable = false)
    private int typeCode;

 
    @Column(name = "VERSION", nullable = false, length = 10)
    private String version;

    @Column(name = "TITLE", nullable = false, length = 100)
    private String title;

    @Lob
    @Column(name = "CONTENT")
    private String content;

 
    @Column(name = "IS_REQUIRED")
    private Integer isRequired;

 
    @Column(name = "EFFECTIVE_FROM", nullable = false)
    private LocalDate effectiveFrom;

  
    @Column(name = "EFFECTIVE_TO")
    private LocalDate effectiveTo;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

 
    public boolean isEffectiveAt(LocalDate date) {
        if (effectiveFrom.isAfter(date)) {
            return false;
        }
        return effectiveTo == null || !effectiveTo.isBefore(date);
    }

 
    public boolean isRequired() {
        return this.isRequired != null && this.isRequired == 1;
    }
}