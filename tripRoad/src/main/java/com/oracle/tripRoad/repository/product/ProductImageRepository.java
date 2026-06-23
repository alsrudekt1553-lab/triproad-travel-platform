package com.oracle.tripRoad.repository.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.product.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    // 상품 ID로 이미지 목록 순서대로 조회
    List<ProductImage> findByProduct_ProductIdOrderByImgOrderAsc(Long productId);

    // 대표 이미지만 조회 (img_order = 1)
    Optional<ProductImage> findByProduct_ProductIdAndImgOrder(Long productId, Integer imgOrder);
}