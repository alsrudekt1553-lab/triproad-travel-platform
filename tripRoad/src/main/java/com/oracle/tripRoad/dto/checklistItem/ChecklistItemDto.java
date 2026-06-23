package com.oracle.tripRoad.dto.checklistItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistItemDto {
	
	private Long   itemId;
	private Long   checklistId;
	private String itemName;
	private Long   isChecked;
}
