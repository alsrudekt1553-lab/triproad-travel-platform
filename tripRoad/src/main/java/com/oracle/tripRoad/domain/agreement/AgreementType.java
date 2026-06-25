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

    public static final int TYPE_SIGNUP    = 100;
    public static final int TYPE_PAYMENT   = 200;
    public static final int TYPE_PRODUCT   = 300;
    public static final int TYPE_OPERATION = 400;

    public static final String SCOPE_COMMON  = "COMMON";
    public static final String SCOPE_PRODUCT = "PRODUCT";

    public static final int STATUS_ACTIVE   = 100;  
    public static final int STATUS_INACTIVE = 900;  

    public static final int REQUIRED_YES = 1;
    public static final int REQUIRED_NO  = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "AGREEMENT_TYPE_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "AGREEMENT_TYPE_SEQ_GENERATOR",
            sequenceName = "AGREEMENT_TYPE_SEQ",
            allocationSize = 1
    )
    @Column(name = "AGREEMENT_ID", precision = 19)
    private Long agreementId;


    @Column(name = "TYPE_CODE", nullable = false)
    private Integer typeCode;


    @Column(name = "SCOPE", nullable = false, length = 20)
    private String scope;


    @Column(name = "VERSION", nullable = false, length = 10)
    private String version;

    @Column(name = "TITLE", nullable = false, length = 100)
    private String title;

    @Lob
    @Column(name = "CONTENT")
    private String content;


    @Column(name = "IS_REQUIRED", nullable = false)
    private Integer isRequired;


    @Column(name = "EFFECTIVE_FROM", nullable = false)
    private LocalDate effectiveFrom;


    @Column(name = "EFFECTIVE_TO")
    private LocalDate effectiveTo;


    @Column(name = "STATUS", nullable = false)
    private Integer status;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = STATUS_ACTIVE;
        }
    }


    public boolean isEffectiveAt(LocalDate date) {
        if (effectiveFrom.isAfter(date)) {
            return false;
        }
        return effectiveTo == null || !effectiveTo.isBefore(date);
    }


    public boolean isApplicable(LocalDate date) {
        return this.status != null
                && this.status == STATUS_ACTIVE
                && isEffectiveAt(date);
    }


    public boolean isRequired() {
        return this.isRequired != null && this.isRequired == REQUIRED_YES;
    }


    public boolean isCommonScope() {
        return SCOPE_COMMON.equals(this.scope);
    }


    public boolean isProductScope() {
        return SCOPE_PRODUCT.equals(this.scope);
    }
}