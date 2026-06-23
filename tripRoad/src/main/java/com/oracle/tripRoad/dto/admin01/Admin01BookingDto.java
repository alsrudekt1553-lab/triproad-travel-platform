package com.oracle.tripRoad.dto.admin01;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Admin01BookingDto {
    private Long bookingId;
    private String userName;
    private String productName;
    private Date bookingDate;
    private String statusName;
    private Long status;
}