package com.oracle.tripRoad.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.domain.booking.Booking;
import com.oracle.tripRoad.domain.product.ProductSchedule;
import com.oracle.tripRoad.dto.booking.BookingDto;
import com.oracle.tripRoad.dto.booking.MyPageBookingScheduleDto;
import com.oracle.tripRoad.repository.booking.BookingRepository;
import com.oracle.tripRoad.repository.product.ProductImageRepository;
import com.oracle.tripRoad.repository.product.ProductScheduleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage/booking")
public class MyPageBookingController {

    private final BookingRepository bookingRepository;
    private final ProductScheduleRepository productScheduleRepository;
    private final ProductImageRepository productImageRepository;

    @GetMapping("/user/{userId}")
    public List<BookingDto.InfoResponse> getBookingsByUser(
            @PathVariable("userId") Long userId
    ) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(booking -> BookingDto.InfoResponse.builder()
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
                        .build())
                .toList();
    }

    @GetMapping("/schedule/{scheduleId}")
    public MyPageBookingScheduleDto getScheduleForBooking(
            @PathVariable("scheduleId") Long scheduleId
    ) {
        ProductSchedule schedule = productScheduleRepository
                .findByIdFetchProduct(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 일정입니다."));

        int usedHeadcount = bookingRepository
                .sumHeadcountByScheduleIdAndStatusIn(
                        scheduleId,
                        List.of(
                                Booking.STATUS_HOLD,
                                Booking.STATUS_CONFIRMED
                        )
                );

        int maxHeadcount =
                schedule.getMaxHeadcount() != null
                        ? schedule.getMaxHeadcount()
                        : 0;

        int remainingCount = maxHeadcount - usedHeadcount;

        Long productId = schedule.getProduct().getProductId();

        String imageName = productImageRepository
                .findByProduct_ProductIdAndImgOrder(productId, 1)
                .map(image -> image.getImageName())
                .orElse(null);

        return MyPageBookingScheduleDto.builder()
                .scheduleId(schedule.getScheduleId())
                .productId(productId)
                .productName(schedule.getProduct().getProductName())
                .unitPrice(schedule.getProduct().getPrice())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .maxHeadcount(maxHeadcount)
                .remainingCount(remainingCount)
                .imageName(imageName)
                .build();
    }
}