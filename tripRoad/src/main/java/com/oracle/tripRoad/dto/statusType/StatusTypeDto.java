package com.oracle.tripRoad.dto.statusType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatusTypeDto {
	
	private Long   bcode;
	private Long   mcode;
	private String codeContents;
}
