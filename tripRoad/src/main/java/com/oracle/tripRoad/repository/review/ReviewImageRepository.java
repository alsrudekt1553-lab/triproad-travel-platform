package com.oracle.tripRoad.repository.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.review.ReviewImage;

public interface ReviewImageRepository
        extends JpaRepository<ReviewImage, Long> {

    List<ReviewImage> findByReviewIdOrderByImageOrderAsc(Long reviewId);
    
    void deleteByReviewId(Long reviewId);

}