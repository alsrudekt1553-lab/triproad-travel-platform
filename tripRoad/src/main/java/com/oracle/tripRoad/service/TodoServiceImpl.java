package com.oracle.tripRoad.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dao.TodoDao;
import com.oracle.tripRoad.domain.Todo;
import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.TodoDTO;
import com.oracle.tripRoad.repository.TodoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {
	
	//자동주입 대상은 final로 
	private final TodoRepository todoRepository;
	private final TodoDao        todoDao;
	private final ModelMapper    modelMapper;
	

	@Override
	public Long register(TodoDTO todoDTO) {
		log.info("register start todoDTO->"+todoDTO);
		Todo todo = modelMapper.map(todoDTO, Todo.class);
		
		Todo saveTodo = todoRepository.save(todo);
		System.out.println("TodoServiceImpl register  saveTodo->"+saveTodo);
		// 일반적인 Pattern -> domain 저장후 PK return
		return saveTodo.getTno();
	}

	@Override
	public int todoTotal() {
	    // 전체 갯수 ---------------------------------------------
	    int totalCount = todoDao.totalTodo();
		return totalCount;
	}

	@Override
	public TodoDTO get(Long tno) {
		Optional<Todo>  maybeTodo = todoRepository.findById(tno);
		
		Todo todo = maybeTodo.orElseThrow();
		TodoDTO dto = modelMapper.map(todo, TodoDTO.class);
		System.out.println("TodoServiceImpl get  dto->"+dto);
		
		return dto;
	}

	@Override
	public PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO) {
		// 10 Row Get
		List<TodoDTO> dtoList = todoDao.listTodo(pageRequestDTO);
	    System.out.println("list dtoList->"+dtoList);
	    // 전체 갯수 ---------------------------------------------
	    int totalCount = todoDao.totalTodo();
	    
	    // 
	    PageResponseDTO<TodoDTO> responseDTO = PageResponseDTO.<TodoDTO>withAll()
	    						   .dtoList(dtoList)	
	    						   .pageRequestDTO(pageRequestDTO)
	    						   .totalCount(totalCount)
	    						   .build()
	    						   ;
	    
		// TODO Auto-generated method stub
		return responseDTO;
	}

	@Override
	public void modify(TodoDTO todoDTO) {
		Optional<Todo> maybeTodo = todoRepository.findById(todoDTO.getTno());
		Todo todo = maybeTodo.orElseThrow();
		todo.changeTitle(todoDTO.getTitle());
		todo.changeWriter(todoDTO.getWriter());
		todo.changeDueDate(todoDTO.getDue_date());
		todo.changeComplete(todoDTO.isComplete());
	    System.out.println("TodoServiceImpl modify todo->"+todo);

	    todoRepository.save(todo);
	}

	@Override
	public void remove(Long tno) {
		todoRepository.deleteById(tno);

	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

}
