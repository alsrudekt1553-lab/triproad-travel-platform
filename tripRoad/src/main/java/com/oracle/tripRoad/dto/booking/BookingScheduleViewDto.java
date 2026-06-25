package com.oracle.tripRoad.dto.booking;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingScheduleViewDto {

    private Long      scheduleId;
    private Long      productId;		
    private String    productName;
    private Long      unitPrice;
    private LocalDate startDate;
    private LocalDate endDate;
    private int       maxHeadcount;
    private int       remainingCount;
}

