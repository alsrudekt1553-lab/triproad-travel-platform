package com.oracle.tripRoad.dao;

import java.util.List;
import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.TodoDTO;


public interface TodoDao {
	int           		totalTodo();
	List<TodoDTO>       listTodo(PageRequestDTO pageRequestDTO);
}
