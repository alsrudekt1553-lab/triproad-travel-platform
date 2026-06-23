package com.oracle.tripRoad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oracle.tripRoad.domain.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long>{

}
