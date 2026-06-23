package com.oracle.tripRoad.dto.productSchedule;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductScheduleDto {
	
	private Long   scheduleId;
	private Long   productId;
	private String title;
	private String content;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startDate;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endDate;
	
	private Long   maxHeadcount;
	private Long   status;
}
