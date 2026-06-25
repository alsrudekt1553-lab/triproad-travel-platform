package com.oracle.tripRoad.domain.point;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "REVIEW_REWARD_POLICY")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "policyId")
public class ReviewRewardPolicy {

    public static final String CONDITION_TEXT_BASIC     = "TEXT_BASIC";
    public static final String CONDITION_PHOTO_ATTACHED = "PHOTO_ATTACHED";
    public static final String CONDITION_VIDEO_ATTACHED = "VIDEO_ATTACHED";
    public static final String CONDITION_FIRST_REVIEW   = "FIRST_REVIEW";
    public static final String CONDITION_LENGTH_OVER    = "LENGTH_OVER";
    public static final String CONDITION_BEST_REVIEW    = "BEST_REVIEW";

    public static final int STATUS_ACTIVE   = 100; 
    public static final int STATUS_INACTIVE = 900; 

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "REVIEW_REWARD_POLICY_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "REVIEW_REWARD_POLICY_SEQ_GENERATOR",
            sequenceName = "REVIEW_REWARD_POLICY_SEQ",
            allocationSize = 1
    )
    @Column(name = "POLICY_ID")
    private Long policyId;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "CONDITION_TYPE", nullable = false, length = 30)
    private String conditionType;

    @Column(name = "CONDITION_VALUE")
    private Integer conditionValue;

    @Column(name = "REWARD_AMOUNT", nullable = false)
    private Integer rewardAmount;

    @Column(name = "EFFECTIVE_FROM", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "EFFECTIVE_TO")
    private LocalDate effectiveTo;

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


    public boolean isAutoJudgment() {
        return !CONDITION_BEST_REVIEW.equals(this.conditionType);
    }

    public boolean meetsThreshold(int actualValue) {
        if (this.conditionValue == null) return true;
        return actualValue >= this.conditionValue;
    }
}