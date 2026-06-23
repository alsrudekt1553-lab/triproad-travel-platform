package com.oracle.tripRoad.dto.travelProduct;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TravelProductDto {
	
	private Long   productId;
	private Long   regionId;
	private Long   themeCode;
	private String productName;
	private String description;
	private Long   price;
	private Date   regDate;
	private Date   modDate;
}
