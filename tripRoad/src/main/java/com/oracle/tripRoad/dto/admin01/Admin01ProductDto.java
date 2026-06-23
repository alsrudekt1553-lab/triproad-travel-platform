package com.oracle.tripRoad.dto.admin01;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Admin01ProductDto {
	private Long productId;
	private Long regionId;
	private Long themeCode;
	private String productName;
	private String description;
	private Long price;
	private String imageName;
}