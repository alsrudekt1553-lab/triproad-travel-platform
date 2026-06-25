package com.oracle.tripRoad.repository.product;

import java.util.List;

import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.product.ProductSchedule;

public interface ProductScheduleRepository extends JpaRepository<ProductSchedule, Long> {
	
	// product 담당자 파트
    // 상품 ID로 일정 목록 조회 (출발일 순서대로)
    List<ProductSchedule> findByProduct_ProductIdOrderByStartDateAsc(Long productId);
    
    // booking 담당자 파트 
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ProductSchedule s JOIN FETCH s.product WHERE s.scheduleId = :scheduleId")
    Optional<ProductSchedule> findByIdWithLock(@Param("scheduleId") Long scheduleId);

    // booking 담당자 파트 
    @Query("SELECT s FROM ProductSchedule s JOIN FETCH s.product WHERE s.scheduleId = :scheduleId")
    Optional<ProductSchedule> findByIdFetchProduct(@Param("scheduleId") Long scheduleId);
    
    @Query("SELECT s FROM ProductSchedule s JOIN FETCH s.product WHERE s.scheduleId IN :scheduleIds")
    List<ProductSchedule> findAllByScheduleIdInFetchProduct(@Param("scheduleIds") List<Long> scheduleIds);
}