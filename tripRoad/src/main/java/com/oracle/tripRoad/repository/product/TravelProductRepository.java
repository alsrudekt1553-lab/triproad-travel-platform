package com.oracle.tripRoad.repository.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.product.TravelProduct;

public interface TravelProductRepository extends JpaRepository<TravelProduct, Long> {

    // 테마별 상품 조회
    List<TravelProduct> findByTheme_ThemeCode(Integer themeCode);

    // 지역별 상품 조회
    List<TravelProduct> findByRegionId(Integer regionId);

    // 상품명 검색
    List<TravelProduct> findByProductNameContaining(String keyword);

    // 최신순 정렬
    List<TravelProduct> findAllByOrderByRegDateDesc();
}