package com.oracle.tripRoad.domain.wishlist;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "WISHLIST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {
	
	@Id
	@GeneratedValue(
	        strategy = GenerationType.SEQUENCE,
	        generator = "wishlist_seq_generator"
	)
	@SequenceGenerator(
	        name = "wishlist_seq_generator",
	        sequenceName = "WISHLIST_SEQ",
	        allocationSize = 1
	)
	@Column(name = "WISHLIST_ID")
	private Long wishlistId;

    @Column(name = "USER_ID", nullable = false)
    private Long memberId;

    @Column(name = "PRODUCT_ID", nullable = false)
    private Long packageId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

}
