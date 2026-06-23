package com.oracle.tripRoad.service;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.TodoDTO;

public interface TodoService {
	  Long    				 	register(TodoDTO todoDTO);
	  int     				 	todoTotal();
	  TodoDTO 				    get(Long tno);
	  PageResponseDTO<TodoDTO>  list(PageRequestDTO pageRequestDTO);
	  void                      modify(TodoDTO todoDTO);
	  void                      remove(Long tno);

}
