package com.oracle.tripRoad.domain.qna;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "QNA")
@Getter
@NoArgsConstructor
@ToString
@SequenceGenerator(
        name = "qna_seq_generator",
        sequenceName = "QNA_SEQ",
        allocationSize = 1
)
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "qna_seq_generator")
    @Column(name = "qna_id")
    private Long qnaId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "qna_type")
    private Long qnaType;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "answer_content", length = 2000)
    private String answerContent;

    @Column(name = "qna_status")
    private Long qnaStatus;

    @Column(name = "is_secret")
    private Long isSecret;

    @Column(name = "is_admin_post")
    private Long isAdminPost;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "answered_at")
    private Date answeredAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    public void changeDefaultStatus() {
        this.qnaStatus = 100L;
        if (this.isSecret == null) this.isSecret = 0L;
        if (this.isAdminPost == null) this.isAdminPost = 0L;
    }

    public void changeFaqStatus() {
        this.qnaType = 500L;
        this.qnaStatus = 200L;
        this.isAdminPost = 1L;
        this.isSecret = 0L;
        this.productId = null;
        this.scheduleId = null;
        this.paymentId = null;
    }

    public void changeQna(String title, String content, Long qnaType,
                          Long productId, Long scheduleId, Long paymentId, Long isSecret) {
        this.title = title;
        this.content = content;
        this.qnaType = qnaType;
        this.productId = productId;
        this.scheduleId = scheduleId;
        this.paymentId = paymentId;
        this.isSecret = isSecret == null ? 0L : isSecret;
    }

    public void hideQna() {
        this.qnaStatus = 900L;
    }

    public void answer(String answerContent) {
        this.answerContent = answerContent;
        this.qnaStatus = 200L;

        if (this.answeredAt == null) {
            this.answeredAt = new Date();
        }
    }

    public void deleteAnswer() {
        this.answerContent = null;
        this.answeredAt = null;
        this.qnaStatus = 100L;
    }
}