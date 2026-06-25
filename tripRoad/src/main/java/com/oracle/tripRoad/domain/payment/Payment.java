package com.oracle.tripRoad.domain.payment;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    public static final int PAY_STATUS_READY     = 100; 
    public static final int PAY_STATUS_APPROVED  = 500; 
    public static final int PAY_STATUS_CANCELLED = 900;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(name = "payment_seq", sequenceName = "PAYMENT_SEQ", allocationSize = 1)
    @Column(name = "PAYMENT_ID", precision = 19)
    private Long paymentId;

    @Column(name = "BOOKING_ID", precision = 19)
    private Long bookingId;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "TID", length = 30)
    private String tid;

    @Column(name = "PARTNER_ORDER_ID")
    private Long partnerOrderId;

    @Column(name = "AMOUNT")
    private Long amount;

    @Column(name = "PAYMENT_METHOD_TYPE")
    private Integer paymentMethodType;

    @Column(name = "PAY_STATUS")
    private Integer payStatus;

    @Column(name = "APPROVED_AT")
    private LocalDateTime approvedAt;

    public void approve(LocalDateTime approvedAt) {
        this.payStatus = PAY_STATUS_APPROVED;
        this.approvedAt = approvedAt;
    }

    public void cancel() {
        this.payStatus = PAY_STATUS_CANCELLED;
    }
}
