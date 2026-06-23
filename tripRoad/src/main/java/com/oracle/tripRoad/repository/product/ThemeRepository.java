package com.oracle.tripRoad.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.product.Theme;

public interface ThemeRepository extends JpaRepository<Theme, Integer> {

    // findAll()  → 테마 전체 목록 조회
    // findById() → 특정 테마 조회
}