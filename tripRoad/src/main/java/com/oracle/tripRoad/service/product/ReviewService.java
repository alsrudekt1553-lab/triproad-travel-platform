package com.oracle.tripRoad.service.product;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dto.product.ReviewDto;
import com.oracle.tripRoad.repository.review.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<ReviewDto> getReviewsByProductId(Long productId) {
        return reviewRepository.findVisibleReviewsByProductId(productId)
                .stream()
                .map(review -> ReviewDto.builder()
                        .reviewId(review.getReviewId())
                        .userId(review.getUserId())
                        .bookingId(review.getBookingId())
                        .productId(productId)
                        .rating(review.getRating() == null ? null : review.getRating().doubleValue())
                        .content(review.getContent())
                        .createdAt(toLocalDate(review.getCreatedAt()))
                        .updatedAt(toLocalDate(review.getUpdatedAt()))
                        .reviewStatus(review.getReviewStatus() == null ? null : review.getReviewStatus().intValue())
                        .build())
                .toList();
    }

    public Double getAverageRating(Long productId) {
        return reviewRepository.getAvgRatingByProductId(productId);
    }

    private LocalDate toLocalDate(Date date) {
        if (date == null) {
            return null;
        }

        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
}