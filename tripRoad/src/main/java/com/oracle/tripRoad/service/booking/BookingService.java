package com.oracle.tripRoad.service.booking;

import java.util.List;

import com.oracle.tripRoad.dto.booking.BookingDto;
import com.oracle.tripRoad.dto.booking.BookingScheduleViewDto;

public interface BookingService {

    BookingDto.HoldResponse holdBooking(BookingDto.HoldRequest req, String ipAddress, String userAgent);

    BookingDto.ConfirmResponse confirmBooking(Long bookingId);

    void releaseBooking(Long bookingId);

    void releaseExpiredHolds();

    List<BookingDto.InfoResponse> getBookingsByUserId(Long userId);

    BookingDto.InfoResponse getBookingDetail(Long bookingId);

    BookingScheduleViewDto getScheduleForBooking(Long scheduleId);

}