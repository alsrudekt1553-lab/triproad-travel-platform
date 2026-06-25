package com.oracle.tripRoad.domain.agreement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "BOOKING_AGREEMENT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "bookingAgreementId")
public class BookingAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOOKING_AGREEMENT_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "BOOKING_AGREEMENT_SEQ_GENERATOR",
            sequenceName = "BOOKING_AGREEMENT_SEQ",
            allocationSize = 1
    )
    @Column(name = "BOOKING_AGREEMENT_ID")
    private Long bookingAgreementId;

    @Column(name = "BOOKING_ID", nullable = false)
    private Long bookingId;

    @Column(name = "AGREEMENT_ID", nullable = false)
    private Long agreementId;

    @Column(name = "AGREED_AT", updatable = false)
    private LocalDateTime agreedAt;

    @Column(name = "IP_ADDRESS", length = 45)
    private String ipAddress;

    @Column(name = "USER_AGENT", length = 500)
    private String userAgent;

    @PrePersist
    public void prePersist() {
        if (this.agreedAt == null) {
            this.agreedAt = LocalDateTime.now();
        }
    }
}