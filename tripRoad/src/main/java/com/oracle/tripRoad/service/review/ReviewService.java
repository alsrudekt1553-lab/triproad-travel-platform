package com.oracle.tripRoad.service.review;

import java.util.List;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.review.ReviewDto;
import com.oracle.tripRoad.dto.review.ReviewSummaryDto;

public interface ReviewService {

    Long register(ReviewDto reviewDto);

    ReviewDto get(Long reviewId);

    PageResponseDTO<ReviewDto> list(PageRequestDTO pageRequestDTO);

    void modify(ReviewDto reviewDto);

    void remove(Long reviewId, Long userId, Long role);
    
    ReviewSummaryDto summary(Long scheduleId);
    
    List<ReviewDto> listBySchedule(Long scheduleId, String sort);
    
    List<ReviewDto> listByUser(Long userId);

}