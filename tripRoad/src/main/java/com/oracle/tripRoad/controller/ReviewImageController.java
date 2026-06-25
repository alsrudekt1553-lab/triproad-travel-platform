package com.oracle.tripRoad.controller;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.oracle.tripRoad.dto.review.ReviewImageDto;
import com.oracle.tripRoad.dto.user01.User01Dto;
import com.oracle.tripRoad.service.review.ReviewImageService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/reviewImage")
@RequiredArgsConstructor
@Log4j2
public class ReviewImageController {

    private final ReviewImageService reviewImageService;

    @Value("${com.oracle.tripRoad.upload.path:upload}")
    private String uploadPath;

    private String reviewUploadPath() {
        return uploadPath + File.separator + "reviewImage";
    }

    private User01Dto getLoginUser(HttpSession session) {
        User01Dto loginUser = (User01Dto) session.getAttribute("LOGIN_USER");

        if (loginUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return loginUser;
    }

    // 이미지 업로드 + DB 등록
    @PostMapping("/upload/{reviewId}")
    public List<Long> upload(
            @PathVariable("reviewId") Long reviewId,
            @RequestPart("files") List<MultipartFile> files,
            HttpSession session) {

        getLoginUser(session);

        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 이미지가 없습니다.");
        }

        File uploadFolder = new File(reviewUploadPath());

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        List<Long> imageIds = new ArrayList<>();

        long order = 1L;

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originalName = file.getOriginalFilename();

            if (originalName == null || originalName.trim().isEmpty()) {
                continue;
            }

            String contentType = file.getContentType();

            if (contentType == null || !contentType.startsWith("image/")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 파일만 업로드할 수 있습니다.");
            }

            String savedName = UUID.randomUUID() + "_" + originalName;
            File saveFile = new File(uploadFolder, savedName);

            try {
                FileCopyUtils.copy(file.getBytes(), saveFile);
            } catch (IOException e) {
                log.error("review image upload error", e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드 실패");
            }

            ReviewImageDto imageDto = ReviewImageDto.builder()
                    .reviewId(reviewId)
                    .imageName(savedName)
                    .imageOrder(order++)
                    .build();

            Long reviewImageId = reviewImageService.register(imageDto);
            imageIds.add(reviewImageId);
        }

        return imageIds;
    }

    // 기존 이미지명 직접 등록용
    @PostMapping
    public Long register(
            @org.springframework.web.bind.annotation.RequestBody ReviewImageDto reviewImageDto,
            HttpSession session) {

        getLoginUser(session);

        return reviewImageService.register(reviewImageDto);
    }

    // 리뷰별 이미지 목록
    @GetMapping("/review/{reviewId}")
    public List<ReviewImageDto> listByReview(
            @PathVariable("reviewId") Long reviewId) {

        return reviewImageService.listByReview(reviewId);
    }

    // 이미지 파일 보기
    @GetMapping("/view/{imageName}")
    public ResponseEntity<Resource> viewImage(
            @PathVariable("imageName") String imageName) {

        try {
        	File file = new File(reviewUploadPath(), imageName);
            Resource resource = new UrlResource(file.toURI());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "이미지를 찾을 수 없습니다.");
            }

            HttpHeaders headers = new HttpHeaders();

            try {
                headers.add(
                        HttpHeaders.CONTENT_TYPE,
                        Files.probeContentType(file.toPath())
                );
            } catch (IOException e) {
                headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg");
            }

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);

        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 조회 실패");
        }
    }

    // 이미지 삭제
    @DeleteMapping("/{reviewImageId}")
    public void remove(
            @PathVariable("reviewImageId") Long reviewImageId,
            HttpSession session) {

        getLoginUser(session);

        ReviewImageDto imageDto = reviewImageService.get(reviewImageId);

        if (imageDto != null && imageDto.getImageName() != null) {
        	File file = new File(reviewUploadPath(), imageDto.getImageName());

            if (file.exists()) {
                file.delete();
            }
        }

        reviewImageService.remove(reviewImageId);
    }
}