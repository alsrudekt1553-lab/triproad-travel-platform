package com.oracle.tripRoad.dto.wishlist;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDto {
	
	private Long   wishlistId;
	private Long   userId;
	private Long   productId;
	private Date   createdAt;
	private String productName;
	private Long price;
	
	private String imageName;
}
