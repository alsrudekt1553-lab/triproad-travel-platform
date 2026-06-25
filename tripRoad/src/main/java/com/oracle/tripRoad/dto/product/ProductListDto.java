package com.oracle.tripRoad.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListDto {

    private Long productId;      // 상품 ID
    private String productName;  // 상품명
    private Long price;          // 가격
    private String themeName;    // 테마명
    private Integer regionId;    // 지역코드
    private String imageName;    // 대표 이미지 파일명
    private String regionName;   // 지역명
    private Double averageRating;
}