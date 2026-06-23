package com.oracle.tripRoad.repository.checklist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.checklist.Checklist;

public interface ChecklistRepository extends JpaRepository<Checklist, Long>{
	
	List<Checklist> findByUserId(Long userId);
	
}
