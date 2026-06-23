package com.oracle.tripRoad.service.myPage;

import com.oracle.tripRoad.domain.checklist.Checklist;
import com.oracle.tripRoad.domain.checklistItem.ChecklistItem;
import com.oracle.tripRoad.domain.wishlist.Wishlist;
import com.oracle.tripRoad.dto.wishlist.WishlistDto;

import java.util.List;

public interface MyPageService {

	List<WishlistDto> getWishlist(Long memberId);
    List<Checklist> getChecklists(Long userId);
    List<ChecklistItem> getChecklistItems(Long checklistId);
    
	Checklist saveChecklist(Checklist checklist);
    ChecklistItem saveChecklistItem(ChecklistItem checklistItem);

    ChecklistItem updateChecklistItem(ChecklistItem checklistItem);

    void deleteWishlist(Long wishlistId);
    void deleteChecklist(Long checklistId);
    void deleteChecklistItem(Long itemId);
	Checklist 	getChecklist(Long checklistId); 

}