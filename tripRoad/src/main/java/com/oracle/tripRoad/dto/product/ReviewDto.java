package com.oracle.tripRoad.dto.product;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {

    private Long 		reviewId;       // 후기 ID
    private Long 		userId;         // 작성자 ID
    private Long 		bookingId;      // 예약 ID
    private Long 		productId;      // 상품 ID
    private Double 		rating;       	// 별점
    private String 		content;      	// 후기 내용
    private String 		reviewImage;  	// 후기 이미지
    private LocalDate 	createdAt; 		// 작성일
    private LocalDate 	updatedAt; 		// 수정일
    private Integer 	reviewStatus; 	// 후기 상태
}