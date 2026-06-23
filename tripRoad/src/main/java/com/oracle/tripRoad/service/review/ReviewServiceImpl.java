package com.oracle.tripRoad.service.review;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.domain.review.Review;
import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.review.ReviewDto;
import com.oracle.tripRoad.dto.review.ReviewSummaryDto;
import com.oracle.tripRoad.repository.review.ReviewImageRepository;
import com.oracle.tripRoad.repository.review.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

	private final ReviewRepository reviewRepository;
	private final ReviewImageRepository reviewImageRepository;
	private final ModelMapper modelMapper;

    @Override
    public Long register(ReviewDto reviewDto) {

        log.info("register start reviewDto -> {}", reviewDto);

        if (reviewDto.getRating() == null
                || reviewDto.getRating() < 1
                || reviewDto.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1점 이상 5점 이하만 가능합니다.");
        }

        if (reviewDto.getContent() == null
                || reviewDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("후기 내용은 필수입니다.");
        }

        Long count = reviewRepository.countByBookingIdAndReviewStatus(
                reviewDto.getBookingId(),
                100L
        );

        if (count > 0) {
            throw new IllegalArgumentException("이미 후기가 등록된 예약입니다.");
        }

        Review review = modelMapper.map(reviewDto, Review.class);
        review.changeReviewStatus(100L);

        Review saveReview = reviewRepository.save(review);

        return saveReview.getReviewId();
    }

    @Override
    public ReviewDto get(Long reviewId) {

        Review review = reviewRepository.findVisibleReviewById(reviewId);

        if (review == null) {
            throw new IllegalArgumentException("조회 가능한 후기가 없습니다.");
        }

        return modelMapper.map(review, ReviewDto.class);
    }

    @Override
    public PageResponseDTO<ReviewDto> list(PageRequestDTO pageRequestDTO) {

        log.info("list start pageRequestDTO -> {}", pageRequestDTO);

        int page = pageRequestDTO.getPage();
        int size = pageRequestDTO.getSize();

        int start = (page - 1) * size + 1;
        int end = page * size;

        pageRequestDTO.setStart(start);
        pageRequestDTO.setEnd(end);

        List<ReviewDto> dtoList =
                reviewRepository.findPagingByReviewStatus(100L, start, end)
                        .stream()
                        .map(review -> modelMapper.map(review, ReviewDto.class))
                        .toList();

        int totalCount = reviewRepository.countByReviewStatus(100L).intValue();

        return PageResponseDTO.<ReviewDto>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public void modify(ReviewDto reviewDto) {

        Review review = reviewRepository.findById(reviewDto.getReviewId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));

        if (review.getReviewStatus() == 900L) {
            throw new IllegalArgumentException("삭제된 후기는 수정할 수 없습니다.");
        }

        if (!review.getUserId().equals(reviewDto.getUserId())) {
            throw new IllegalArgumentException("본인이 작성한 후기만 수정할 수 있습니다.");
        }

        if (reviewDto.getRating() == null
                || reviewDto.getRating() < 1
                || reviewDto.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1점 이상 5점 이하만 가능합니다.");
        }

        if (reviewDto.getContent() == null
                || reviewDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("후기 내용은 필수입니다.");
        }

        review.changeRating(reviewDto.getRating());
        review.changeContent(reviewDto.getContent());

        reviewRepository.save(review);
    }

    @Override
    public void remove(Long reviewId, Long userId, Long role) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 후기입니다."));

        if (review.getReviewStatus() == 900L) {
            throw new IllegalArgumentException("이미 삭제된 후기입니다.");
        }

        boolean isOwner = review.getUserId().equals(userId);
        boolean isAdmin = role != null && role.equals(900L);

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("후기 삭제 권한이 없습니다.");
        }

        reviewImageRepository.deleteByReviewId(reviewId);

        review.hideReview();
    }

    @Override
    public ReviewSummaryDto summary(Long scheduleId) {

        Double avgRating = reviewRepository.getAvgRatingByScheduleId(scheduleId);
        Long reviewCount = reviewRepository.getReviewCountByScheduleId(scheduleId);

        return ReviewSummaryDto.builder()
                .scheduleId(scheduleId)
                .avgRating(avgRating)
                .reviewCount(reviewCount)
                .build();
    }

    @Override
    public List<ReviewDto> listBySchedule(Long scheduleId, String sort) {

        if (sort == null || sort.isBlank()) {
            sort = "latest";
        }

        return reviewRepository.findByScheduleIdWithSort(scheduleId, sort)
                .stream()
                .map(review -> modelMapper.map(review, ReviewDto.class))
                .toList();
    }
    
    @Override
    public List<ReviewDto> listByUser(Long userId) {

        return reviewRepository.findMyReviews(userId)
                .stream()
                .map(review -> modelMapper.map(review, ReviewDto.class))
                .toList();
    }
}