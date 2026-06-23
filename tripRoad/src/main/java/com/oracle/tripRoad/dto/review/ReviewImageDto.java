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
public class ReviewImageDto {
	
	private Long   reviewImageId;
	private Long   reviewId;
	private String imageName;
	private Long   imageOrder;
	private Date   createdAt;
}
