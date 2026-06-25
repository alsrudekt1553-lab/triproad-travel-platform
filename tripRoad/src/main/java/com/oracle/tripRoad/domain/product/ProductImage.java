package com.oracle.tripRoad.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_image")
@Getter
@NoArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue(
    		strategy = GenerationType.SEQUENCE,
    		generator = "product_image_seq_generator"
    	)
    @SequenceGenerator(
    		name = "product_image_seq_generator",
    		sequenceName = "product_image_seq",
    		allocationSize = 1
    	)
    @Column(name = "image_id")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private TravelProduct product;

    @Column(name = "image_name", length = 300, nullable = false)
    private String imageName;

    @Column(name = "img_order")
    private Integer imgOrder;
}