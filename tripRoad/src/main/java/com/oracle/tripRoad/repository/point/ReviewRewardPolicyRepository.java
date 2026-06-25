package com.oracle.tripRoad.repository.point;

import com.oracle.tripRoad.domain.point.ReviewRewardPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReviewRewardPolicyRepository extends JpaRepository<ReviewRewardPolicy, Long> {

    @Query("SELECT r FROM ReviewRewardPolicy r " +
           "WHERE r.status = 100 " +
           "AND r.effectiveFrom <= :today " +
           "AND (r.effectiveTo IS NULL OR r.effectiveTo >= :today)")
    List<ReviewRewardPolicy> findApplicablePolicies(@Param("today") LocalDate today);

    @Query("SELECT r FROM ReviewRewardPolicy r " +
           "WHERE r.conditionType = :conditionType " +
           "AND r.status = 100 " +
           "AND r.effectiveFrom <= :today " +
           "AND (r.effectiveTo IS NULL OR r.effectiveTo >= :today)")
    Optional<ReviewRewardPolicy> findActiveByConditionType(@Param("conditionType") String conditionType,
                                                           @Param("today") LocalDate today);
}