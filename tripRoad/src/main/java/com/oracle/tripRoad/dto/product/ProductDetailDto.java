package com.oracle.tripRoad.dto.product;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailDto {

    private Long 			  productId;   // 상품 ID
    private String 			  productName; // 상품명
    private String 			  description; // 상품 설명
    private Long 			  price;       // 가격
    private String 		 	  themeName;   // 테마명
    private Integer 		  regionId;    // 지역코드
    private String 			  regionName;  // 지역명
    private LocalDate 		  regDate;     // 등록일
    private List<String> 	  imageNames;  // 이미지 파일명 목록
    private List<ScheduleDto> schedules;   // 일정 목록
}