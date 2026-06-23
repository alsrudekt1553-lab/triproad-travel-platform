package com.oracle.tripRoad.dto.productImage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageDto {
	
	private Long   imageId;
	private Long   productId;
	private String imageName;
	private Long   imgOrder;
}
