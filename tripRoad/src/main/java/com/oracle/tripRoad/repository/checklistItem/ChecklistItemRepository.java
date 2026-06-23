package com.oracle.tripRoad.repository.checklistItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.checklistItem.ChecklistItem;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

    List<ChecklistItem> findByChecklistId(Long checklistId);

}
