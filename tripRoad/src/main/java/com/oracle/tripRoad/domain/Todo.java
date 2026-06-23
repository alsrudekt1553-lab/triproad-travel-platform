package com.oracle.tripRoad.domain;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "tbl_todo")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SequenceGenerator(
		name = "todo_seq_gen",               // Seq 객체
        sequenceName = "todo_seq_generator", // Seq DB 
		initialValue = 1,
		allocationSize = 1
		)

public class Todo {
	  @Id	
	  @GeneratedValue(
			  	strategy = GenerationType.SEQUENCE,
			  	generator = "todo_seq_gen"
	  )
	  private Long tno;
	  private String title;
	  private String writer;
	  private boolean complete;
	  private LocalDate dueDate;

	  public void changeWriter(String writer){
		  this.writer = writer;
	  } 
	  
	  public void changeTitle(String title){
		  this.title = title;
	  }

	  public void changeComplete(boolean complete){
	      this.complete = complete;
	  }

	  public void changeDueDate(LocalDate dueDate){
	      this.dueDate = dueDate;
	  }

}
