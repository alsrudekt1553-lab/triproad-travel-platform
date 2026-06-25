package com.oracle.tripRoad.repository.point;

import com.oracle.tripRoad.domain.point.PointEarnPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PointEarnPolicyRepository extends JpaRepository<PointEarnPolicy, Long> {

    @Query("SELECT p FROM PointEarnPolicy p " +
           "WHERE p.status = 100 " +
           "AND p.effectiveFrom <= :today " +
           "AND (p.effectiveTo IS NULL OR p.effectiveTo >= :today) " +
           "ORDER BY p.priority ASC")
    List<PointEarnPolicy> findApplicablePolicies(@Param("today") LocalDate today);

    List<PointEarnPolicy> findByTargetTypeAndStatus(String targetType, Integer status);

    @Query("SELECT p FROM PointEarnPolicy p " +
           "WHERE p.targetType = :targetType " +
           "AND p.targetId = :targetId " +
           "AND p.status = 100 " +
           "AND p.effectiveFrom <= :today " +
           "AND (p.effectiveTo IS NULL OR p.effectiveTo >= :today)")
    List<PointEarnPolicy> findActiveByTarget(@Param("targetType") String targetType,
                                             @Param("targetId") Long targetId,
                                             @Param("today") LocalDate today);
}