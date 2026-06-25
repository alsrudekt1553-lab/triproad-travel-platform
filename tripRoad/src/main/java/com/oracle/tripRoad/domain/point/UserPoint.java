package com.oracle.tripRoad.domain.point;

import com.oracle.tripRoad.exception.InsufficientPointException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_POINT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "userPointId")
public class UserPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_POINT_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "USER_POINT_SEQ_GENERATOR",
            sequenceName = "USER_POINT_SEQ",
            allocationSize = 1
    )
    @Column(name = "USER_POINT_ID", precision = 19)
    private Long userPointId;

    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @Column(name = "POINT_BALANCE", nullable = false)
    private int pointBalance;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.pointBalance < 0) {
            this.pointBalance = 0;
        }
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void deduct(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("차감 금액은 0보다 커야 합니다. amount=" + amount);
        }
        if (this.pointBalance < amount) {
            throw new InsufficientPointException(
                "적립금이 부족합니다. 잔액=" + this.pointBalance + ", 요청=" + amount
            );
        }
        this.pointBalance -= amount;
    }


    public void refund(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("환원 금액은 0보다 커야 합니다. amount=" + amount);
        }
        this.pointBalance += amount;
    }


    public void add(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("적립 금액은 0보다 커야 합니다. amount=" + amount);
        }
        this.pointBalance += amount;
    }
}


