package com.oracle.tripRoad.domain.product;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_schedule")
@Getter
@NoArgsConstructor
public class ProductSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
        generator = "schedule_seq")
    @SequenceGenerator(name = "schedule_seq",
        sequenceName = "schedule_seq", allocationSize = 1)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private TravelProduct product;

    @Column(name = "title", length = 300, nullable = false)
    private String title;

    @Column(name = "content", length = 4000)
    private String content;

    @Column(name = "status")
    private Integer status;       // 판매상태

    @Column(name = "start_date")
    private LocalDate startDate;  // 출발일

    @Column(name = "end_date")
    private LocalDate endDate;    // 종료일
    
    @Column(name = "max_headcount")
    private Integer maxHeadcount; // 최대인원
}