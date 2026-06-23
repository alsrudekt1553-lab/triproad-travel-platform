package com.oracle.tripRoad.service;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Paging {

	private int currentPage = 1;	private int rowPage   = 10;
	private int pageBlock = 10;		
	private int start;				private int end;
	private int startPage;			private int endPage;
	private int totalCount;			private int totalPage;

	public Paging(int totalCount, int currentPage1) {
		this.totalCount  = totalCount;      // 41
		this.currentPage = currentPage1;    // 1

		//           1               10
		start = (currentPage - 1) * rowPage + 1;  // 시작시 1     11   
		end   = start + rowPage - 1;              // 시작시 10    20   
		                 //                 23    /   10 
		totalPage = (int) Math.ceil((double)totalCount / rowPage);  // 시작시 3  
		            //   1         1
		startPage = currentPage - (currentPage - 1) % pageBlock; // 시작시 1    
		endPage = startPage + pageBlock - 1;  // 10
		//    10        14
		if (endPage > totalPage) {
			endPage = totalPage;
		}
	}	
}
