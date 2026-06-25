package com.oracle.tripRoad.dto.main;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MainProductDto {

    private Long productId;
    private String productName;
    private Long price;

    private Integer regionId;
    private String regionName;
    private String themeName;
    private String imageName;

    private Double averageRating;
}