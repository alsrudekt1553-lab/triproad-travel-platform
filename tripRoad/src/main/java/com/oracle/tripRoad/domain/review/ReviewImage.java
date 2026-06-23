package com.oracle.tripRoad.domain.review;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "REVIEW_IMAGE")
@Getter
@NoArgsConstructor
@ToString
@SequenceGenerator(
        name = "review_image_seq_generator",
        sequenceName = "REVIEW_IMAGE_SEQ",
        allocationSize = 1
)
public class ReviewImage {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "review_image_seq_generator"
    )
    @Column(name = "review_image_id")
    private Long reviewImageId;

    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    @Column(name = "image_name", length = 300)
    private String imageName;

    @Column(name = "image_order")
    private Long imageOrder;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    public ReviewImage(Long reviewId, String imageName, Long imageOrder) {
        this.reviewId = reviewId;
        this.imageName = imageName;
        this.imageOrder = imageOrder;
    }
}