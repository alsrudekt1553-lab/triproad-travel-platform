package com.oracle.tripRoad.service.review;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.domain.review.ReviewImage;
import com.oracle.tripRoad.dto.review.ReviewImageDto;
import com.oracle.tripRoad.repository.review.ReviewImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewImageServiceImpl implements ReviewImageService {

    private final ReviewImageRepository reviewImageRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ReviewImageDto> listByReview(Long reviewId) {

        return reviewImageRepository
                .findByReviewIdOrderByImageOrderAsc(reviewId)
                .stream()
                .map(reviewImage -> modelMapper.map(reviewImage, ReviewImageDto.class))
                .toList();
    }

    @Override
    public Long register(ReviewImageDto reviewImageDto) {

        ReviewImage reviewImage = new ReviewImage(
                reviewImageDto.getReviewId(),
                reviewImageDto.getImageName(),
                reviewImageDto.getImageOrder()
        );

        ReviewImage savedImage =
                reviewImageRepository.save(reviewImage);

        return savedImage.getReviewImageId();
    }

    @Override
    public void remove(Long reviewImageId) {

        reviewImageRepository.deleteById(reviewImageId);
    }

    @Override
    public ReviewImageDto get(Long reviewImageId) {

        return reviewImageRepository.findById(reviewImageId)
                .map(reviewImage -> modelMapper.map(reviewImage, ReviewImageDto.class))
                .orElse(null);
    }
}