package com.oracle.tripRoad.dto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.Builder;
import lombok.Data;

@Data
public class PageResponseDTO<E> {
	private List<E>        dtoList;    // tbl_todo , tbl_product
	private List<Integer>  pageNumList;
	private PageRequestDTO pageRequestDTO;
	private boolean        prev,next;

    private int totalCount, prevPage, nextPage, totalPage, current;
    // 이 DTO는 페이징 UI를 구성하는 데 필요한 모든 정보를 한곳에 담아 전달하는 역할
    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E>        dtoList
    		              ,PageRequestDTO pageRequestDTO
    		              ,int            totalCount ) {
        this.dtoList = dtoList;                // dtoList: 실제 데이터 리스트
        this.pageRequestDTO = pageRequestDTO;  // 화면에 보여줄 페이지 번호들의 리스트 (예: 1~10 페이지 번호)
        this.totalCount = totalCount;
  
        System.out.println("PageResponseDTO withAll->"+pageRequestDTO);
   
        // Page Setting
        int end =   (int)(Math.ceil( pageRequestDTO.getPage() / 10.0 )) *  10;
        System.out.println("PageResponseDTO withAll 1 end->"+end);
        int start = end - 9;   // 시작 페이지는 끝 페이지에서 9를 뺀 값.  예시 start = 10 - 9 = 1.
        // last -->전체 데이터 수를 페이지 크기로 나누고 올림하여 전체 페이지 최대값 구함.
        int last =  (int)(Math.ceil((totalCount/(double)pageRequestDTO.getSize())));
        System.out.println("PageResponseDTO withAll 1 last->"+last);
        // 계산된 끝 페이지(end)가 전체 마지막 페이지(last)보다 크면, last로 바꿈.
        end =  end > last ? last: end;

        System.out.println("PageResponseDTO withAll start->"+start);
        System.out.println("PageResponseDTO withAll 2 end->"+end);
        System.out.println("PageResponseDTO withAll 2 last->"+last);
        System.out.println("PageResponseDTO withAll start->"+start);

        this.prev = start > 1;                                                 //이전/다음 페이지 블록이 있는지 여부를 true/false로 표시
        this.next =  totalCount > end * pageRequestDTO.getSize();
        // 시작~끝 start부터 end까지 정수 리스트를 만들어서 UI용 페이지 번호 리스트로 사용
        this.pageNumList = IntStream.rangeClosed(start,end)
        		                    .boxed()
        		                    .collect(Collectors.toList());

        if(prev) {
            this.prevPage = start -1;
        }

        if(next) {
            this.nextPage = end + 1;
        }

        this.totalPage = this.pageNumList.size();  // 현재 페이지 범위 내 페이지 개수
        this.current = pageRequestDTO.getPage();   // 현재 페이지 번호
    }
}
