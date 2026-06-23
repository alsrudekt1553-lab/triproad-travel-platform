package com.oracle.tripRoad.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.review.ReviewDto;
import com.oracle.tripRoad.dto.review.ReviewSummaryDto;
import com.oracle.tripRoad.dto.user01.User01Dto;
import com.oracle.tripRoad.service.review.ReviewService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@Log4j2
public class ReviewController {

    private final ReviewService reviewService;

    private User01Dto getLoginUser(HttpSession session) {
        User01Dto loginUser = (User01Dto) session.getAttribute("LOGIN_USER");

        if (loginUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return loginUser;
    }

    @PostMapping
    public Long register(@RequestBody ReviewDto reviewDto, HttpSession session) {
        User01Dto loginUser = getLoginUser(session);

        reviewDto.setUserId(loginUser.getUserId());

        log.info("register reviewDto -> {}", reviewDto);

        return reviewService.register(reviewDto);
    }

    @GetMapping("/{reviewId}")
    public ReviewDto get(@PathVariable("reviewId") Long reviewId) {
        return reviewService.get(reviewId);
    }

    @GetMapping("/list")
    public PageResponseDTO<ReviewDto> list(PageRequestDTO pageRequestDTO) {
        return reviewService.list(pageRequestDTO);
    }

    @GetMapping("/summary/{scheduleId}")
    public ReviewSummaryDto summary(@PathVariable("scheduleId") Long scheduleId) {
        return reviewService.summary(scheduleId);
    }

    @DeleteMapping("/{reviewId}")
    public void remove(@PathVariable("reviewId") Long reviewId,
                       HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        reviewService.remove(reviewId, loginUser.getUserId(), loginUser.getRole());
    }

    @PutMapping("/{reviewId}")
    public void modify(@PathVariable("reviewId") Long reviewId,
                       @RequestBody ReviewDto reviewDto,
                       HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        reviewDto.setReviewId(reviewId);
        reviewDto.setUserId(loginUser.getUserId());

        reviewService.modify(reviewDto);
    }

    @GetMapping("/schedule/{scheduleId}")
    public List<ReviewDto> listBySchedule(
            @PathVariable("scheduleId") Long scheduleId,
            @RequestParam(value = "sort", required = false) String sort) {

        return reviewService.listBySchedule(scheduleId, sort);
    }

    @GetMapping("/my")
    public List<ReviewDto> myReviews(HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        return reviewService.listByUser(loginUser.getUserId());
    }
}