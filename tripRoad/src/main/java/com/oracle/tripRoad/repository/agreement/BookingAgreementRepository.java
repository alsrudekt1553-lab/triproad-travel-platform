package com.oracle.tripRoad.repository.agreement;

import com.oracle.tripRoad.domain.agreement.BookingAgreement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingAgreementRepository extends JpaRepository<BookingAgreement, Long> {

    List<BookingAgreement> findByBookingId(Long bookingId);

    long countByBookingId(Long bookingId);

    boolean existsByBookingIdAndAgreementId(Long bookingId, Long agreementId);
}