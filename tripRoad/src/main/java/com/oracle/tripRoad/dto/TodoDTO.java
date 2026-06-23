package com.oracle.tripRoad.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tools.jackson.databind.jsonFormatVisitors.JsonFormatTypes;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TodoDTO {

	private Long   tno;
	private String title;
	private String writer;
	private boolean complete;

//  @JsonFormat: Jackson 라이브러리에서 제공하는 어노테이션으로, JSON 변환 시 특정 필드의 형식을 지정 
//  shape = JsonFormat.Shape.STRING: 이 필드가 JSON에서 문자열 형태로 표현되어야 함을 나타냄
//  pattern = "yyyy-MM-dd": 날짜 형식을 "연도-월-일" 형태로 지정 (예: "2025-06-25")
//  private LocalDate dueDate;: LocalDate 타입의 dueDate라는 필드를 선언
//  이 코드는 Java 객체가 JSON으로 직렬화되거나 JSON에서 역직렬화될 때, dueDate 필드가 "2025-06-25"와 같은 형식의 문자열로 처리
	@JsonFormat(shape = JsonFormat.Shape.STRING,  pattern = "yyyy-MM-dd")
	private LocalDate due_date;
	
	// 조회용
	private String pageNum;  
	private int start; 		 	   private int end;
	// Page 정보
	private String currentPage;

}
