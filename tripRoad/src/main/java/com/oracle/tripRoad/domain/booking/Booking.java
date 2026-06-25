package com.oracle.tripRoad.domain.booking;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOOKING")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    public static final int STATUS_HOLD       = 100;  
    public static final int STATUS_CONFIRMED  = 500;  
    public static final int STATUS_CANCELLED  = 900; 

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_seq")
    @SequenceGenerator(name = "booking_seq", sequenceName = "BOOKING_SEQ", allocationSize = 1)
    @Column(name = "BOOKING_ID" , precision = 19)
    private Long bookingId;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "HEADCOUNT")
    private Integer headcount;

    @Column(name = "TOTAL_PRICE")
    private Long totalPrice;

    @Column(name = "DISCOUNT_AMOUNT")
    private Long discountAmount;

    @Column(name = "FINAL_PRICE")
    private Long finalPrice;

    @Column(name = "RESERVER_NAME", length = 50)
    private String reserverName;

    @Column(name = "RESERVER_PHONE", length = 20)
    private String reserverPhone;

    @Column(name = "RESERVER_EMAIL", length = 100)
    private String reserverEmail;

    @Column(name = "POINT_USED")
    private Integer pointUsed;

    @Column(name = "STATUS")
    private Integer status;

    @Column(name = "HOLD_AT")
    private LocalDateTime holdAt;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public void confirm() {
        this.status = STATUS_CONFIRMED;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = STATUS_CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        this.status = STATUS_HOLD;
        this.holdAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.pointUsed == null) {
            this.pointUsed = 0;
        }
    }
}