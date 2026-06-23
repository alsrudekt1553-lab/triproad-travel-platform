package com.oracle.tripRoad.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;
import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.TodoDTO;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TodoDaoImpl implements TodoDao {

	// Mybatis DB 연동 
	private final SqlSession session;
	
	
	@Override
	public int totalTodo() {
		int totTodoCount = 0;
		System.out.println("TodoDaoImpl Start totalTodo..." );
		
		try {
			totTodoCount = session.selectOne("com.oracle.tripRoad.TodoMapper.todoTotal");
			System.out.println("TodoDaoImpl totalTodo totTodoCount->" +totTodoCount);
		
		} catch (Exception e) {
			System.out.println("TodoDaoImpl totalTodo e.getMessage()->"+e.getMessage());
		}
		
		return totTodoCount;
	}

	@Override
	public List<TodoDTO> listTodo(PageRequestDTO pageRequestDTO) {
		int end = 0;
		List<TodoDTO> todoList = null;
		System.out.println("TodoDaoImpl listTodo pageRequestDTO kkk->"+pageRequestDTO );
		TodoDTO todoDTO = new TodoDTO();
		// Start Row 설정 
		todoDTO.setStart(pageRequestDTO.getStart());
		// End   Row 설정 
		todoDTO.setEnd(pageRequestDTO.getEnd());
		System.out.println("TodoDaoImpl listTodo todoDTO->"+todoDTO );
		try {
			//                             Map ID        parameter
			todoList = session.selectList("tkTodoListAll", todoDTO);
			System.out.println("TodoDaoImpl listTodo todoList.size()->"+todoList.size());
		} catch (Exception e) {
			System.out.println("TodoDaoImpl listTodo e.getMessage()->"+e.getMessage());
		}
		return todoList;	

	}

}
