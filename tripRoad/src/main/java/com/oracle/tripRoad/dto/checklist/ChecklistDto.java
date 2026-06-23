package com.oracle.tripRoad.dto.checklist;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistDto {
	
	private Long   checklistId;
	private Long   bookingId;
	private Long   userId;
	private String title;
	private Date   createdAt;
	private Long   productId;
}
