package com.oracle.tripRoad.repository.point;

import com.oracle.tripRoad.domain.point.UserPointHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserPointHistoryRepository extends JpaRepository<UserPointHistory, Long> {

    @Query("SELECT COUNT(h) > 0 FROM UserPointHistory h " +
           "WHERE h.bookingId = :bookingId AND h.historyType = :historyType")
    boolean existsByBookingIdAndHistoryType(@Param("bookingId") Long bookingId,
                                            @Param("historyType") int historyType);

    List<UserPointHistory> findByBookingIdAndHistoryType(Long bookingId, int historyType);

    List<UserPointHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}