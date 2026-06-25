package com.oracle.tripRoad.repository.point;

import com.oracle.tripRoad.domain.point.UserPoint;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserPointRepository extends JpaRepository<UserPoint, Long> {

    Optional<UserPoint> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT up FROM UserPoint up WHERE up.userId = :userId")
    Optional<UserPoint> findByUserIdWithLock(@Param("userId") Long userId);

    boolean existsByUserId(Long userId);

    List<UserPoint> findByPointBalanceGreaterThan(int amount);

    long countByPointBalanceGreaterThan(int amount);

    List<UserPoint> findTop100ByOrderByPointBalanceDesc();

    @Query("SELECT COALESCE(SUM(up.pointBalance), 0) FROM UserPoint up")
    long sumTotalLiability();
}