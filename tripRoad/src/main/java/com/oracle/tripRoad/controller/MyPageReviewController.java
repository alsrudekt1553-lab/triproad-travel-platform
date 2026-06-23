package com.oracle.tripRoad.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.dto.review.ReviewDto;
import com.oracle.tripRoad.service.review.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage/review")
public class MyPageReviewController {

    private final ReviewService reviewService;

    @GetMapping("/my/{userId}")
    public List<ReviewDto> myReviewsByUserId(
            @PathVariable("userId") Long userId
    ) {
        return reviewService.listByUser(userId);
    }

    @DeleteMapping("/{reviewId}/{userId}")
    public void removeByUserId(
            @PathVariable("reviewId") Long reviewId,
            @PathVariable("userId") Long userId
    ) {
        reviewService.remove(reviewId, userId, 100L);
    }

    @PutMapping("/{reviewId}/{userId}")
    public void modifyByUserId(
            @PathVariable("reviewId") Long reviewId,
            @PathVariable("userId") Long userId,
            @RequestBody ReviewDto reviewDto
    ) {
        reviewDto.setReviewId(reviewId);
        reviewDto.setUserId(userId);

        reviewService.modify(reviewDto);
    }
}