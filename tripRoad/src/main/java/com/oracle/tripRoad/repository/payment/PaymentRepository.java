package com.oracle.tripRoad.repository.payment;

import com.oracle.tripRoad.domain.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTid(String tid);
    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByUserIdOrderByApprovedAtDesc(Long userId);
    
    @Query("SELECT p FROM Payment p WHERE p.bookingId IN :bookingIds")
    List<Payment> findAllByBookingIdIn(@Param("bookingIds") List<Long> bookingIds);
    
    
}