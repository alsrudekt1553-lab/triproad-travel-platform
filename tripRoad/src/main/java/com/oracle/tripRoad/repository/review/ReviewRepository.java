package com.oracle.tripRoad.repository.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oracle.tripRoad.domain.review.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewStatus(Long reviewStatus);

    @Query(value =
            "SELECT a.* " +
            "FROM ( " +
            "    SELECT ROWNUM rn, a.* " +
            "    FROM ( " +
            "        SELECT * " +
            "        FROM REVIEW " +
            "        WHERE review_status = :reviewStatus " +
            "        ORDER BY review_id DESC " +
            "    ) a " +
            "    WHERE ROWNUM <= :end " +
            ") a " +
            "WHERE rn >= :start",
            nativeQuery = true)
    List<Review> findPagingByReviewStatus(
            @Param("reviewStatus") Long reviewStatus,
            @Param("start") int start,
            @Param("end") int end
    );

    Long countByReviewStatus(Long reviewStatus);

    @Query(value =
            "SELECT NVL(AVG(rating), 0) " +
            "FROM REVIEW " +
            "WHERE schedule_id = :scheduleId " +
            "AND review_status = 100",
            nativeQuery = true)
    Double getAvgRatingByScheduleId(
            @Param("scheduleId") Long scheduleId
    );

    @Query(value =
            "SELECT COUNT(*) " +
            "FROM REVIEW " +
            "WHERE schedule_id = :scheduleId " +
            "AND review_status = 100",
            nativeQuery = true)
    Long getReviewCountByScheduleId(
            @Param("scheduleId") Long scheduleId
    );

    List<Review> findByScheduleIdAndReviewStatusOrderByReviewIdDesc(
            Long scheduleId,
            Long reviewStatus
    );

    @Query(value =
            "SELECT * " +
            "FROM REVIEW " +
            "WHERE schedule_id = :scheduleId " +
            "AND review_status = 100 " +
            "ORDER BY " +
            "CASE WHEN :sort = 'latest' THEN review_id END DESC, " +
            "CASE WHEN :sort = 'old' THEN review_id END ASC, " +
            "CASE WHEN :sort = 'highRating' THEN rating END DESC, " +
            "CASE WHEN :sort = 'lowRating' THEN rating END ASC, " +
            "review_id DESC",
            nativeQuery = true)
    List<Review> findByScheduleIdWithSort(
            @Param("scheduleId") Long scheduleId,
            @Param("sort") String sort
    );

    @Query(value =
            "SELECT COUNT(*) " +
            "FROM REVIEW " +
            "WHERE booking_id = :bookingId " +
            "AND review_status = :reviewStatus",
            nativeQuery = true)
    Long countByBookingIdAndReviewStatus(
            @Param("bookingId") Long bookingId,
            @Param("reviewStatus") Long reviewStatus
    );

    @Query(value =
            "SELECT * " +
            "FROM REVIEW " +
            "WHERE review_id = :reviewId " +
            "AND review_status = 100",
            nativeQuery = true)
    Review findVisibleReviewById(@Param("reviewId") Long reviewId);
    
    @Query(value =
            "SELECT r.* " +
            "FROM review r " +
            "JOIN product_schedule ps ON r.schedule_id = ps.schedule_id " +
            "WHERE ps.product_id = :productId " +
            "AND r.review_status = 100 " +
            "ORDER BY r.review_id DESC",
            nativeQuery = true)
    List<Review> findVisibleReviewsByProductId(@Param("productId") Long productId);

    @Query(value =
            "SELECT NVL(AVG(r.rating), 0) " +
            "FROM review r " +
            "JOIN product_schedule ps ON r.schedule_id = ps.schedule_id " +
            "WHERE ps.product_id = :productId " +
            "AND r.review_status = 100",
            nativeQuery = true)
    Double getAvgRatingByProductId(@Param("productId") Long productId);
    
    @Query(value =
            "SELECT * " +
            "FROM REVIEW " +
            "WHERE user_id = :userId " +
            "AND review_status = 100 " +
            "ORDER BY review_id DESC",
            nativeQuery = true)
    List<Review> findMyReviews(@Param("userId") Long userId);
    
}