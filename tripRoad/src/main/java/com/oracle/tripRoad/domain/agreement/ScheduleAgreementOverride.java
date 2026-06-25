package com.oracle.tripRoad.domain.agreement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "SCHEDULE_AGREEMENT_OVERRIDE")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "overrideId")
public class ScheduleAgreementOverride {

    public static final String OVERRIDE_ADD    = "ADD";
    public static final String OVERRIDE_REMOVE = "REMOVE";

    public static final int REQUIRED_YES = 1;
    public static final int REQUIRED_NO  = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SCHEDULE_AGREEMENT_OVERRIDE_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "SCHEDULE_AGREEMENT_OVERRIDE_SEQ_GENERATOR",
            sequenceName = "SAO_SEQ",
            allocationSize = 1
    )
    @Column(name = "OVERRIDE_ID", precision = 19)
    private Long overrideId;

    @Column(name = "SCHEDULE_ID", nullable = false)
    private Long scheduleId;

    @Column(name = "AGREEMENT_ID", nullable = false, precision = 19)
    private Long agreementId;

    @Column(name = "OVERRIDE_TYPE", nullable = false, length = 10)
    private String overrideType;

    @Column(name = "IS_REQUIRED", nullable = false)
    private Integer isRequired;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isRequired == null) {
            this.isRequired = REQUIRED_NO;
        }
    }

    public boolean isAdd() {
        return OVERRIDE_ADD.equals(this.overrideType);
    }

    public boolean isRemove() {
        return OVERRIDE_REMOVE.equals(this.overrideType);
    }

    public boolean isRequired() {
        return this.isRequired != null && this.isRequired == REQUIRED_YES;
    }
}