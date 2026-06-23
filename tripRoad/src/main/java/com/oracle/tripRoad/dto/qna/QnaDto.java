package com.oracle.tripRoad.dto.qna;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaDto {

    private Long qnaId;
    private Long userId;

    private Long productId;
    private Long scheduleId;
    private Long paymentId;

    private Long qnaType;
    private String title;
    private String content;

    private String answerContent;

    private Long qnaStatus;
    private Long isSecret;
    private Long isAdminPost;

    private Date createdAt;
    private Date answeredAt;
    private Date updatedAt;
}