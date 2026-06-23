package com.oracle.tripRoad.service.review;

import java.util.List;

import com.oracle.tripRoad.dto.review.ReviewImageDto;

public interface ReviewImageService {

    List<ReviewImageDto> listByReview(Long reviewId);
    
    Long register(ReviewImageDto reviewImageDto);
    
    void remove(Long reviewImageId);
    
    ReviewImageDto get(Long reviewImageId);
}