package com.oracle.tripRoad.domain.point;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "POINT_EARN_POLICY")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "policyId")
public class PointEarnPolicy {

    public static final String TARGET_THEME      = "THEME";
    public static final String TARGET_PRODUCT    = "PRODUCT";
    public static final String TARGET_CATEGORY   = "CATEGORY";
    public static final String TARGET_USER_GRADE = "USER_GRADE";
    public static final String TARGET_ALL        = "ALL";

    public static final int PRIORITY_BASE      = 100; 
    public static final int PRIORITY_PROMOTION = 200; 

    public static final int STATUS_ACTIVE   = 100; 
    public static final int STATUS_INACTIVE = 900;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "POINT_EARN_POLICY_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "POINT_EARN_POLICY_SEQ_GENERATOR",
            sequenceName = "POINT_EARN_POLICY_SEQ",
            allocationSize = 1
    )
    @Column(name = "POLICY_ID")
    private Long policyId;

    @Column(name = "POLICY_NAME", nullable = false, length = 100)
    private String policyName;

    @Column(name = "TARGET_TYPE", nullable = false, length = 20)
    private String targetType;

    @Column(name = "TARGET_ID")
    private Long targetId;

    @Column(name = "EARN_RATE", nullable = false, precision = 5, scale = 2)
    private BigDecimal earnRate;

    @Column(name = "EFFECTIVE_FROM", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "EFFECTIVE_TO")
    private LocalDate effectiveTo;

    @Column(name = "PRIORITY", nullable = false)
    private Integer priority;

    @Column(name = "STATUS", nullable = false)
    private Integer status;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = STATUS_ACTIVE;
        }
        if (this.priority == null) {
            this.priority = PRIORITY_BASE;
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

    public boolean isApplicableToTheme(Integer themeCode) {
        if (TARGET_ALL.equals(this.targetType)) return true;
        if (TARGET_THEME.equals(this.targetType) && this.targetId != null) {
            return this.targetId.longValue() == themeCode.longValue();
        }
        return false;
    }

    public int calculateEarnAmount(long paymentAmount) {
        return BigDecimal.valueOf(paymentAmount)
                .multiply(this.earnRate)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.FLOOR)
                .intValue();
    }
}