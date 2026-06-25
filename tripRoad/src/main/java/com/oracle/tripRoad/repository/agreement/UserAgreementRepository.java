package com.oracle.tripRoad.repository.agreement;

import com.oracle.tripRoad.domain.agreement.UserAgreement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAgreementRepository extends JpaRepository<UserAgreement, Long> {

    List<UserAgreement> findByBookingId(Long bookingId);

    List<UserAgreement> findByBookingIdAndWithdrawnAtIsNull(Long bookingId);

    long countByBookingId(Long bookingId);

    boolean existsByBookingIdAndAgreementId(Long bookingId, Long agreementId);
}