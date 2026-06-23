package com.oracle.tripRoad.dto.review;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDto {
	
	private Long   reviewId;
	private Long   userId;
	private Long   bookingId;
	private Long   scheduleId;
	private Long   rating;
	private String content;
	private Date   createdAt;
	private Date   updatedAt;
	private Long   reviewStatus;
}
