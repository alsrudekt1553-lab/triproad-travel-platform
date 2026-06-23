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
@EqualsAndHashCode(of = "userPointHistoryId")
public class UserPointHistory {


    public static final int TYPE_DEDUCT = 230;   
    public static final int TYPE_REFUND = 240;   

    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_POINT_HISTORY_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "USER_POINT_HISTORY_SEQ_GENERATOR",
            sequenceName = "USER_POINT_HISTORY_SEQ",
            allocationSize = 1
    )
    @Column(name = "USER_POINT_HISTORY_ID")
    private Long userPointHistoryId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;


    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "POINT_AMOUNT", nullable = false)
    private int pointAmount;

    @Column(name = "POINT_BALANCE_AFTER", nullable = false)
    private int pointBalanceAfter;


    @Column(name = "HISTORY_TYPE", nullable = false)
    private int historyType;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}