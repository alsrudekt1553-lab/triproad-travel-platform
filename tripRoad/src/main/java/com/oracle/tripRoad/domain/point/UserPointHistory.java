package com.oracle.tripRoad.domain.point;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_POINT_HISTORY")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "historyId")
public class UserPointHistory {

    public static final int TYPE_EARN   = 100;
    public static final int TYPE_DEDUCT = 200;
    public static final int TYPE_REFUND = 300;
    public static final int TYPE_EXPIRE = 400;

    public static final String RELATED_BOOKING = "BOOKING";
    public static final String RELATED_REVIEW  = "REVIEW";
    public static final String RELATED_COUPON  = "COUPON";
    public static final String RELATED_ADMIN   = "ADMIN";
    public static final String RELATED_SYSTEM  = "SYSTEM";
    public static final String RELATED_SIGNUP  = "SIGNUP";

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_POINT_HISTORY_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "USER_POINT_HISTORY_SEQ_GENERATOR",
            sequenceName = "USER_POINT_HISTORY_SEQ",
            allocationSize = 1
    )
    @Column(name = "HISTORY_ID")
    private Long historyId;

    @Column(name = "USER_ID", nullable = false, precision = 10)
    private Long userId;

    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "LEDGER_ID", precision = 19)
    private Long ledgerId;

    @Column(name = "POINT_AMOUNT", nullable = false)
    private int pointAmount;

    @Column(name = "POINT_BALANCE_AFTER", nullable = false)
    private int pointBalanceAfter;

    @Column(name = "HISTORY_TYPE", nullable = false)
    private int historyType;

    @Column(name = "RELATED_TYPE", length = 20)
    private String relatedType;

    @Column(name = "RELATED_ID")
    private Long relatedId;

    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}