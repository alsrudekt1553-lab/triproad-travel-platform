package com.oracle.tripRoad.domain.review;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "REVIEW")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "review_seq_generator"
    )
    @SequenceGenerator(
            name = "review_seq_generator",
            sequenceName = "review_seq",
            allocationSize = 1
    )
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "rating")
    private Long rating;

    @Column(name = "content", length = 2000)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "review_status")
    private Long reviewStatus;


    // 수정 메서드
    public void changeRating(Long rating) {
        this.rating = rating;
    }

    public void changeContent(String content) {
        this.content = content;
    }

    public void changeReviewStatus(Long reviewStatus) {
        this.reviewStatus = reviewStatus;
    }
    
 // 후기 숨김 처리
    public void hideReview() {
        this.reviewStatus = 900L;
    }
    
    public void changeDefaultStatus() {
        if (this.reviewStatus == null) {
            this.reviewStatus = 100L;
        }
    }

}