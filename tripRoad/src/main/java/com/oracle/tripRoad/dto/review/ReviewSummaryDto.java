package com.oracle.tripRoad.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewSummaryDto {

    private Long scheduleId;
    private Double avgRating;
    private Long reviewCount;
}