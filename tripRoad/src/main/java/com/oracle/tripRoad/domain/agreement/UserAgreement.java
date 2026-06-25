package com.oracle.tripRoad.domain.agreement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_AGREEMENT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "userAgreementId")
public class UserAgreement {

    public static final int AGREED_YES = 1;
    public static final int AGREED_NO  = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_AGREEMENT_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "USER_AGREEMENT_SEQ_GENERATOR",
            sequenceName = "USER_AGREEMENT_SEQ",
            allocationSize = 1
    )
    @Column(name = "USER_AGREEMENT_ID", precision = 19)
    private Long userAgreementId;

    @Column(name = "BOOKING_ID", nullable = false, precision = 19)
    private Long bookingId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "SCHEDULE_ID")
    private Long scheduleId;

    @Column(name = "AGREEMENT_ID", nullable = false, precision = 19)
    private Long agreementId;

    @Column(name = "IS_AGREED", nullable = false)
    private Integer isAgreed;

    @Column(name = "AGREED_AT", updatable = false)
    private LocalDateTime agreedAt;

    @Column(name = "WITHDRAWN_AT")
    private LocalDateTime withdrawnAt;

    @Column(name = "IP_ADDRESS", length = 45)
    private String ipAddress;

    @Column(name = "USER_AGENT", length = 500)
    private String userAgent;

    @PrePersist
    public void prePersist() {
        if (this.agreedAt == null) {
            this.agreedAt = LocalDateTime.now();
        }
        if (this.isAgreed == null) {
            this.isAgreed = AGREED_YES;
        }
    }

    public boolean isAgreed() {
        return this.isAgreed != null && this.isAgreed == AGREED_YES;
    }

    public boolean isWithdrawn() {
        return this.withdrawnAt != null;
    }

    public void withdraw() {
        if (this.withdrawnAt == null) {
            this.withdrawnAt = LocalDateTime.now();
        }
    }
}