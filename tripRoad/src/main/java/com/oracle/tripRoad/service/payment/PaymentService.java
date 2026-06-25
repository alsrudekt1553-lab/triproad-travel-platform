package com.oracle.tripRoad.service.payment;

import com.oracle.tripRoad.dto.payment.PaymentDto;

import java.util.List;


public interface PaymentService {

    PaymentDto.ReadyResponse readyPayment(PaymentDto.ReadyRequest request);

    PaymentDto.ApproveResponse approvePayment(PaymentDto.ApproveRequest request);

    PaymentDto.Detail getPaymentByBookingId(Long bookingId);

    List<PaymentDto.Detail> getPaymentsByUserId(Long userId);

    void cancelPayment(Long bookingId);

}