package com.oracle.tripRoad.service.booking;

import com.oracle.tripRoad.domain.booking.Booking;
import com.oracle.tripRoad.domain.payment.Payment;
import com.oracle.tripRoad.domain.product.ProductSchedule;
import com.oracle.tripRoad.dto.booking.BookingDto;
import com.oracle.tripRoad.dto.booking.BookingScheduleViewDto;
import com.oracle.tripRoad.repository.booking.BookingRepository;
import com.oracle.tripRoad.repository.payment.PaymentRepository;
import com.oracle.tripRoad.repository.product.ProductScheduleRepository;
import com.oracle.tripRoad.service.agreement.AgreementService;
import com.oracle.tripRoad.service.point.UserPointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ProductScheduleRepository productScheduleRepository;
    private final UserPointService userPointService;
    private final AgreementService agreementService;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public BookingDto.HoldResponse holdBooking(BookingDto.HoldRequest req,
                                               String ipAddress,
                                               String userAgent) {

        ProductSchedule schedule = productScheduleRepository
                .findByIdWithLock(req.getScheduleId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 일정입니다."));

        int usedHeadcount = bookingRepository
                .sumHeadcountByScheduleIdAndStatusIn(
                        req.getScheduleId(),
                        List.of(Booking.STATUS_HOLD, Booking.STATUS_CONFIRMED)
                );

        int remaining = schedule.getMaxHeadcount() - usedHeadcount;

        if (remaining < req.getHeadcount()) {
            throw new IllegalStateException("잔여 인원이 부족합니다. (잔여: " + remaining + "명)");
        }

        long totalPrice     = schedule.getProduct().getPrice() * req.getHeadcount();
        long discountAmount = 0L;
        int  pointUsed      = Math.max(req.getPointUsed(), 0);
        long finalPrice     = totalPrice - discountAmount - pointUsed;

        if (finalPrice < 0) {
            throw new IllegalArgumentException(
                    "적립금이 결제 금액을 초과합니다. totalPrice=" + totalPrice + ", pointUsed=" + pointUsed);
        }

        Booking booking = Booking.builder()
                .userId(req.getUserId())
                .scheduleId(req.getScheduleId())
                .headcount(req.getHeadcount())
                .totalPrice(totalPrice)
                .discountAmount(discountAmount)
                .finalPrice(finalPrice)
                .reserverName(req.getReserverName())
                .reserverPhone(req.getReserverPhone())
                .reserverEmail(req.getReserverEmail())
                .pointUsed(pointUsed)
                .build();

        Booking saved = bookingRepository.save(booking);

        userPointService.deductPoint(req.getUserId(), pointUsed, saved.getBookingId());

        agreementService.saveAgreements(
                saved.getBookingId(),
                saved.getUserId(),
                schedule.getProduct().getProductId(),
                saved.getScheduleId(),
                req.getAgreementIds(),
                ipAddress,
                userAgent
        );

        log.info("예약 선점 완료 - bookingId={}, userId={}, scheduleId={}, finalPrice={}, pointUsed={}",
                saved.getBookingId(), req.getUserId(), req.getScheduleId(), finalPrice, pointUsed);

        return BookingDto.HoldResponse.builder()
                .bookingId(saved.getBookingId())
                .userId(saved.getUserId())
                .scheduleId(saved.getScheduleId())
                .headcount(saved.getHeadcount())
                .totalPrice(saved.getTotalPrice())
                .discountAmount(saved.getDiscountAmount())
                .finalPrice(saved.getFinalPrice())
                .status(saved.getStatus())
                .holdAt(saved.getHoldAt())
                .createdAt(saved.getCreatedAt())
                .reserverName(saved.getReserverName())
                .reserverPhone(saved.getReserverPhone())
                .reserverEmail(saved.getReserverEmail())
                .pointUsed(saved.getPointUsed() != null ? saved.getPointUsed() : 0)
                .build();
    }

    @Override
    @Transactional
    public BookingDto.ConfirmResponse confirmBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        if (booking.getStatus() != Booking.STATUS_HOLD) {
            throw new IllegalStateException("선점 상태가 아닌 예약은 확정할 수 없습니다.");
        }

        booking.confirm();

        return BookingDto.ConfirmResponse.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void releaseBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        if (booking.getStatus() != Booking.STATUS_HOLD) {
            throw new IllegalStateException("선점 상태가 아닌 예약은 해제할 수 없습니다.");
        }

        int pointToRefund = booking.getPointUsed() != null ? booking.getPointUsed() : 0;
        if (pointToRefund > 0) {
            userPointService.refundPoint(booking.getUserId(), pointToRefund, bookingId);
        }

        booking.cancel();

        log.info("예약 선점 해제 완료 (소프트 삭제) - bookingId={}, refundPoint={}",
                bookingId, pointToRefund);
    }

    @Override
    @Transactional
    public void releaseExpiredHolds() {

        LocalDateTime expiredBefore = LocalDateTime.now().minusMinutes(10);

        List<Booking> expired = bookingRepository
                .findAllByStatusAndHoldAtBefore(Booking.STATUS_HOLD, expiredBefore);

        if (expired.isEmpty()) {
            return;
        }

        for (Booking booking : expired) {
            try {
                int pointToRefund = booking.getPointUsed() != null ? booking.getPointUsed() : 0;
                if (pointToRefund > 0) {
                    userPointService.refundPoint(
                            booking.getUserId(),
                            pointToRefund,
                            booking.getBookingId()
                    );
                }
                booking.cancel();
            } catch (Exception e) {
                log.error("HOLD 만료 처리 실패 - bookingId={}, msg={}",
                        booking.getBookingId(), e.getMessage());
            }
        }

        log.info("HOLD 만료 처리 완료 (소프트 삭제) - count={}", expired.size());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDto.InfoResponse> getBookingsByUserId(Long userId) {

        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);

        if (bookings.isEmpty()) {
            return List.of();
        }

        List<Long> scheduleIds = bookings.stream()
                .map(Booking::getScheduleId)
                .distinct()
                .toList();

        List<Long> bookingIds = bookings.stream()
                .map(Booking::getBookingId)
                .toList();

        Map<Long, ProductSchedule> scheduleMap = productScheduleRepository
                .findAllByScheduleIdInFetchProduct(scheduleIds)
                .stream()
                .collect(Collectors.toMap(ProductSchedule::getScheduleId, Function.identity()));

        Map<Long, Payment> paymentMap = paymentRepository
                .findAllByBookingIdIn(bookingIds)
                .stream()
                .collect(Collectors.toMap(Payment::getBookingId, Function.identity()));

        return bookings.stream()
                .map(booking -> {
                    ProductSchedule schedule = scheduleMap.get(booking.getScheduleId());

                    String    productName = schedule != null ? schedule.getProduct().getProductName() : "(상품 정보 없음)";
                    LocalDate startDate   = schedule != null ? schedule.getStartDate()                : null;
                    LocalDate endDate     = schedule != null ? schedule.getEndDate()                  : null;

                    Payment payment = paymentMap.get(booking.getBookingId());
                    int           payStatus     = payment != null ? payment.getPayStatus()         : 0;
                    LocalDateTime approvedAt    = payment != null ? payment.getApprovedAt()        : null;
                    int           paymentMethod = payment != null ? payment.getPaymentMethodType() : 0;

                    return BookingDto.InfoResponse.builder()
                            .bookingId(booking.getBookingId())
                            .userId(booking.getUserId())
                            .scheduleId(booking.getScheduleId())
                            .headcount(booking.getHeadcount())
                            .totalPrice(booking.getTotalPrice())
                            .discountAmount(booking.getDiscountAmount())
                            .finalPrice(booking.getFinalPrice())
                            .status(booking.getStatus())
                            .holdAt(booking.getHoldAt())
                            .createdAt(booking.getCreatedAt())
                            .updatedAt(booking.getUpdatedAt())
                            .reserverName(booking.getReserverName())
                            .reserverPhone(booking.getReserverPhone())
                            .reserverEmail(booking.getReserverEmail())
                            .pointUsed(booking.getPointUsed() != null ? booking.getPointUsed() : 0)
                            .productName(productName)
                            .startDate(startDate)
                            .endDate(endDate)
                            .payStatus(payStatus)
                            .approvedAt(approvedAt)
                            .paymentMethod(paymentMethod)
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto.InfoResponse getBookingDetail(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        ProductSchedule schedule = productScheduleRepository
                .findByIdFetchProduct(booking.getScheduleId())
                .orElse(null);

        String    productName = schedule != null ? schedule.getProduct().getProductName() : "(상품 정보 없음)";
        LocalDate startDate   = schedule != null ? schedule.getStartDate()                : null;
        LocalDate endDate     = schedule != null ? schedule.getEndDate()                  : null;

        Optional<Payment> paymentOpt = paymentRepository.findByBookingId(bookingId);
        int           payStatus     = paymentOpt.map(Payment::getPayStatus).orElse(0);
        LocalDateTime approvedAt    = paymentOpt.map(Payment::getApprovedAt).orElse(null);
        int           paymentMethod = paymentOpt.map(Payment::getPaymentMethodType).orElse(0);

        return BookingDto.InfoResponse.builder()
                .bookingId(booking.getBookingId())
                .userId(booking.getUserId())
                .scheduleId(booking.getScheduleId())
                .headcount(booking.getHeadcount())
                .totalPrice(booking.getTotalPrice())
                .discountAmount(booking.getDiscountAmount())
                .finalPrice(booking.getFinalPrice())
                .status(booking.getStatus())
                .holdAt(booking.getHoldAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .reserverName(booking.getReserverName())
                .reserverPhone(booking.getReserverPhone())
                .reserverEmail(booking.getReserverEmail())
                .pointUsed(booking.getPointUsed() != null ? booking.getPointUsed() : 0)
                .productName(productName)
                .startDate(startDate)
                .endDate(endDate)
                .payStatus(payStatus)
                .approvedAt(approvedAt)
                .paymentMethod(paymentMethod)
                .build();
    }


    @Override
    @Transactional(readOnly = true)
    public BookingScheduleViewDto getScheduleForBooking(Long scheduleId) {

        ProductSchedule schedule = productScheduleRepository
                .findByIdFetchProduct(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 일정입니다."));

        int usedHeadcount = bookingRepository
                .sumHeadcountByScheduleIdAndStatusIn(
                        scheduleId,
                        List.of(Booking.STATUS_HOLD, Booking.STATUS_CONFIRMED)
                );

        int maxHeadcount   = schedule.getMaxHeadcount() != null ? schedule.getMaxHeadcount() : 0;
        int remainingCount = maxHeadcount - usedHeadcount;

        return BookingScheduleViewDto.builder()
                .scheduleId(schedule.getScheduleId())
                .productId(schedule.getProduct().getProductId())
                .productName(schedule.getProduct().getProductName())
                .unitPrice(schedule.getProduct().getPrice())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .maxHeadcount(maxHeadcount)
                .remainingCount(remainingCount)
                .build();
    }
}