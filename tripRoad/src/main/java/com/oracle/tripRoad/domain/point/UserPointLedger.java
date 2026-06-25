package com.oracle.tripRoad.domain.point;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_POINT_LEDGER")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "ledgerId")
public class UserPointLedger {

    public static final int STATUS_ACTIVE  = 100;
    public static final int STATUS_USED    = 500;
    public static final int STATUS_EXPIRED = 900;

    public static final int SOURCE_BOOKING_EARN  = 100;
    public static final int SOURCE_EVENT         = 200;
    public static final int SOURCE_REVIEW_REWARD = 300;
    public static final int SOURCE_CMS_AGREE     = 400;
    public static final int SOURCE_ADMIN_GRANT   = 500;
    public static final int SOURCE_SIGNUP_BONUS  = 600;
    public static final int SOURCE_PROMOTION     = 700;
    public static final int SOURCE_COUPON        = 800;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_POINT_LEDGER_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "USER_POINT_LEDGER_SEQ_GENERATOR",
            sequenceName = "USER_POINT_LEDGER_SEQ",
            allocationSize = 1
    )
    @Column(name = "LEDGER_ID", precision = 19)
    private Long ledgerId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "POINT_AMOUNT", nullable = false)
    private Integer pointAmount;

    @Column(name = "REMAINING_AMOUNT", nullable = false)
    private Integer remainingAmount;

    @Column(name = "SOURCE_TYPE", nullable = false)
    private Integer sourceType;

    @Column(name = "SOURCE_ID")
    private Long sourceId;

    @Column(name = "EARNED_AT", nullable = false)
    private LocalDateTime earnedAt;

    @Column(name = "EXPIRES_AT", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "STATUS", nullable = false)
    private Integer status;

    @PrePersist
    public void prePersist() {
        if (this.earnedAt == null) {
            this.earnedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = STATUS_ACTIVE;
        }
    }

    public int deduct(int amount) {
        if (amount <= 0) return 0;
        if (this.status != STATUS_ACTIVE) return 0;

        int actual = Math.min(amount, this.remainingAmount);
        this.remainingAmount -= actual;
        if (this.remainingAmount == 0) {
            this.status = STATUS_USED;
        }
        return actual;
    }

    public void restore(int amount) {
        if (amount <= 0) return;
        if (this.remainingAmount + amount > this.pointAmount) {
            throw new IllegalStateException(
                    "환원 금액이 원본 적립액을 초과합니다. " +
                    "ledgerId=" + this.ledgerId +
                    ", remaining=" + this.remainingAmount +
                    ", restore=" + amount +
                    ", original=" + this.pointAmount);
        }
        this.remainingAmount += amount;

        if (this.status == STATUS_USED && this.remainingAmount > 0) {
            this.status = STATUS_ACTIVE;
        }
    }

    public void expire() {
        if (this.status == STATUS_ACTIVE) {
            this.status = STATUS_EXPIRED;
        }
    }
}