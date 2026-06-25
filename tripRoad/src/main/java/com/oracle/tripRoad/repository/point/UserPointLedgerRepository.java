package com.oracle.tripRoad.repository.point;

import com.oracle.tripRoad.domain.point.UserPointLedger;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserPointLedgerRepository extends JpaRepository<UserPointLedger, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM UserPointLedger l " +
           "WHERE l.userId = :userId AND l.status = 100 " +
           "ORDER BY l.expiresAt ASC")
    List<UserPointLedger> findActiveByUserIdOrderByExpiresAtAscWithLock(@Param("userId") Long userId);

    @Query("SELECT l FROM UserPointLedger l " +
           "WHERE l.userId = :userId AND l.status = 100 " +
           "ORDER BY l.expiresAt ASC")
    List<UserPointLedger> findActiveByUserIdOrderByExpiresAtAsc(@Param("userId") Long userId);

    @Query("SELECT l FROM UserPointLedger l " +
           "WHERE l.status = 100 AND l.expiresAt < :now")
    List<UserPointLedger> findExpiredActiveLedgers(@Param("now") LocalDateTime now);

    @Query("SELECT COALESCE(SUM(l.remainingAmount), 0) FROM UserPointLedger l " +
           "WHERE l.userId = :userId AND l.status = 100")
    int sumRemainingByUserId(@Param("userId") Long userId);
}
