package com.oracle.tripRoad.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.TodoDTO;
import com.oracle.tripRoad.service.Paging;
import com.oracle.tripRoad.service.TodoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/todo")
public class TodoController {
	
	private final TodoService todoService;
	
	// @RequestBody TodoDTO todoDTO --> React로 부터 전송받음 
	@PostMapping("/register")
	public Map<String, Long> register(@RequestBody TodoDTO todoDTO) {
		Long tno = 0L;
		log.info("register todoDTO->"+todoDTO);
		tno = todoService.register(todoDTO);
		// React로 전송	
		return Map.of("TNO",tno);
		
	}
	
	@GetMapping("/{tno}")
	public TodoDTO get(@PathVariable(name = "tno") Long tno) {
		System.out.println("TodoController tno->"+tno);
		TodoDTO todoDTO = todoService.get(tno);
		System.out.println("TodoController get todoDTO->"+todoDTO);
		return todoDTO;
	}
	

	@GetMapping("/list")
	public PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO) {
		System.out.println("TodoController list start..");
		System.out.println("TodoController list pageRequestDTO->"+pageRequestDTO);
		
		int totalCount =  todoService.todoTotal();
		System.out.println("TodoController list totalCount->"+totalCount);
		
		// Paging 작업
		Paging   page = new Paging(totalCount, pageRequestDTO.getPage());
		// Parameter pageRequestDTO --> Page만 추가 Setting
		pageRequestDTO.setStart(page.getStart());   // 시작시 1
		pageRequestDTO.setEnd(page.getEnd());       // 시작시 10 
		System.out.println("TodoController list page after pageRequestDTO->"+pageRequestDTO);
		log.info(pageRequestDTO);

		PageResponseDTO<TodoDTO>  todoDTOList = todoService.list(pageRequestDTO);
		
		System.out.println("TodoController list page after todoDTOList->"+todoDTOList);
		
		return todoDTOList;
	}

	@PutMapping("/modify/{tno}")
	public Map<String, String> modify(
			 @PathVariable(name = "tno") Long tno ,
			 @RequestBody TodoDTO todoDTO
			 ) 
	{
		 todoDTO.setTno(tno);
		 log.info("Modify: " + todoDTO);

		 todoService.modify(todoDTO);

		 return Map.of("RESULT", "SUCCESS");
		 
	}
	
	  @DeleteMapping("/remove/{tno}")
	  public Map<String, String> remove( @PathVariable(name="tno") Long tno ){

	    log.info("Remove:  " + tno);

	    todoService.remove(tno); 

	    return Map.of("RESULT", "SUCCESS");
	  }

	
	

}
