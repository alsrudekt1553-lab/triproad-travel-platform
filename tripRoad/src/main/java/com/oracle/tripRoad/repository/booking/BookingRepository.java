package com.oracle.tripRoad.repository.booking;

import com.oracle.tripRoad.domain.booking.Booking;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.scheduleId = :scheduleId AND b.status IN (100, 500)")
    List<Booking> findByScheduleIdWithLock(@Param("scheduleId") Long scheduleId);


    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.scheduleId = :scheduleId AND b.status = 100")
    Optional<Booking> findHoldByUserAndSchedule(@Param("userId") Long userId,
                                                @Param("scheduleId") Long scheduleId);


    @Query("SELECT COALESCE(SUM(b.headcount), 0) FROM Booking b " +
           "WHERE b.scheduleId = :scheduleId AND b.status IN :statusList")
    int sumHeadcountByScheduleIdAndStatusIn(@Param("scheduleId") Long scheduleId,
                                            @Param("statusList") List<Integer> statusList);


    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.holdAt < :expiredBefore")
    List<Booking> findAllByStatusAndHoldAtBefore(@Param("status") int status,
                                                 @Param("expiredBefore") LocalDateTime expiredBefore);


    @Modifying
    @Query("UPDATE Booking b SET b.status = :status, b.updatedAt = :updatedAt WHERE b.bookingId = :bookingId")
    int updateStatus(@Param("bookingId") Long bookingId,
                     @Param("status") int status,
                     @Param("updatedAt") LocalDateTime updatedAt);
}

