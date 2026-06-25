package com.oracle.tripRoad.repository.agreement;

import com.oracle.tripRoad.domain.agreement.ScheduleAgreementOverride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleAgreementOverrideRepository
        extends JpaRepository<ScheduleAgreementOverride, Long> {

    List<ScheduleAgreementOverride> findByScheduleId(Long scheduleId);

    boolean existsByScheduleIdAndAgreementId(Long scheduleId, Long agreementId);

    List<ScheduleAgreementOverride> findByScheduleIdAndOverrideType(Long scheduleId, String overrideType);
}
