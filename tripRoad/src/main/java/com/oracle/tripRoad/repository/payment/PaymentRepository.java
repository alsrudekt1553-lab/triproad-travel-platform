package com.oracle.tripRoad.repository.payment;

import com.oracle.tripRoad.domain.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTid(String tid);
    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByUserIdOrderByApprovedAtDesc(Long userId);
    
    
}