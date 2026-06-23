package com.oracle.tripRoad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


// 목적 -->  페이지 번호와 페이지 크기를 기본으로 가지고, 시작과 끝 인덱스를 별도로 계산해서 페이징 처리를 도와주는 용도
@Data
//상속관계에서도 부모class 필드를 자식 Class Builder에서 설정 가능
//부모/자식 둘다 @SuperBuilder 지정 
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
	// 빌더 패턴을 사용할 때 기본값을 유지
	@Builder.Default
	private int page = 1;

	@Builder.Default
	private int size = 10;

	private int start;
	private int end;
	
}
