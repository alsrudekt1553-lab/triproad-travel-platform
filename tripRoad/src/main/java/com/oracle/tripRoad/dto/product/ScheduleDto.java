package com.oracle.tripRoad.dto.product;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDto {

    private Long 	  scheduleId;      // 일정 ID
    private String    title;           // 일정 제목
    private String    content;         // 일정 내용
    private Integer   status;          // 판매상태
    private LocalDate startDate;       // 출발일
    private LocalDate endDate;         // 종료일
    private Integer   maxHeadcount;    // 최대인원
}