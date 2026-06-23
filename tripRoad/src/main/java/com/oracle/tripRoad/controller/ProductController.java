package com.oracle.tripRoad.controller;

import java.io.File;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.domain.product.Theme;
import com.oracle.tripRoad.dto.product.ProductDetailDto;
import com.oracle.tripRoad.dto.product.ProductListDto;
import com.oracle.tripRoad.dto.product.ReviewDto;
import com.oracle.tripRoad.service.product.ProductService;
import com.oracle.tripRoad.service.product.ReviewService;
import com.oracle.tripRoad.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;
    private final CustomFileUtil customFileUtil;

    // 상품 전체 목록 조회
    // GET /api/products
    @GetMapping
    public ResponseEntity<List<ProductListDto>> getProductList() {
        return ResponseEntity.ok(productService.getProductList());
    }

    // 테마별 상품 목록 조회
    // GET /api/products/theme?themeCode=1
    @GetMapping("/theme")
    public ResponseEntity<List<ProductListDto>> getProductListByTheme(
            @RequestParam("themeCode") Integer themeCode) {
        return ResponseEntity.ok(productService.getProductListByTheme(themeCode));
    }

    // 상품명 검색
    // GET /api/products/search?keyword=제주
    @GetMapping("/search")
    public ResponseEntity<List<ProductListDto>> searchProduct(
            @RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(productService.searchProduct(keyword));
    }

    // 상품 상세 조회
    // GET /api/products/1
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailDto> getProductDetail(
            @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(productService.getProductDetail(productId));
    }

    // 테마 전체 목록 조회
    // GET /api/products/themes
    @GetMapping("/themes")
    public ResponseEntity<List<Theme>> getThemeList() {
        return ResponseEntity.ok(productService.getThemeList());
    }

    // 상품별 후기 목록 조회
    // GET /api/products/1/reviews
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(
            @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    // 상품별 평균 별점 조회
    // GET /api/products/1/rating
    @GetMapping("/{productId}/rating")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }
    
	 // 이미지 파일 조회
	 // GET /api/products/view/{imageName}
	 @GetMapping("/view/{imageName}")
	 public ResponseEntity<Resource> viewImage(
	         @PathVariable("imageName") String imageName) {
	     return customFileUtil.getFile("productImage" + File.separator + imageName);
	 }
}