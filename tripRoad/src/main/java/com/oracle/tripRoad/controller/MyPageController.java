package com.oracle.tripRoad.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.domain.checklist.Checklist;
import com.oracle.tripRoad.domain.checklistItem.ChecklistItem;
import com.oracle.tripRoad.domain.wishlist.Wishlist;
import com.oracle.tripRoad.dto.wishlist.WishlistDto;
import com.oracle.tripRoad.repository.checklistItem.ChecklistItemRepository;
import com.oracle.tripRoad.service.myPage.MyPageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
//@RequestMapping("/api/name")형식으로 코딩 바랍니다(매핑할때 /api/를 붙이고 매핑)
@RequestMapping("/api/mypage")
public class MyPageController {
	private final MyPageService myPageService;
	private final ChecklistItemRepository checklistItemRepository;

	@GetMapping("/{memberId}/wishlist")
	public List<WishlistDto> getWishlist(@PathVariable("memberId") Long memberId) {
	    return myPageService.getWishlist(memberId);
	}
	
	@DeleteMapping("/wishlist/{wishlistId}")
	public void deleteWishlist(@PathVariable("wishlistId") Long wishlistId) {
	    myPageService.deleteWishlist(wishlistId);
	}
	
	@GetMapping("/{userId}/checklists")
	public List<Checklist> getChecklists(@PathVariable("userId") Long userId) {
	    return myPageService.getChecklists(userId);
	}

	@PostMapping("/checklists")
	public Checklist saveChecklist(@RequestBody Checklist checklist) {
	    return myPageService.saveChecklist(checklist);
	}

	@DeleteMapping("/checklists/{checklistId}")
	public void deleteChecklist(@PathVariable("checklistId") Long checklistId) {
	    myPageService.deleteChecklist(checklistId);
	}
	
	@GetMapping("/checklists/{checklistId}/items")
	public List<ChecklistItem> getChecklistItems(@PathVariable("checklistId") Long checklistId) {
	    return myPageService.getChecklistItems(checklistId);
	}

	@PostMapping("/checklist-items")
	public ChecklistItem saveChecklistItem(@RequestBody ChecklistItem checklistItem) {
	    return myPageService.saveChecklistItem(checklistItem);
	}

	@PutMapping("/checklist-items/{itemId}")
	public ChecklistItem updateChecklistItem(
	        @PathVariable("itemId") Long itemId,
	        @RequestBody ChecklistItem request
	) {
	    ChecklistItem item = checklistItemRepository.findById(itemId)
	            .orElseThrow();

	    item.setItemName(request.getItemName());
	    item.setIsChecked(request.getIsChecked());

	    return checklistItemRepository.save(item);
	}

	@DeleteMapping("/checklist-items/{itemId}")
	public void deleteChecklistItem(@PathVariable("itemId") Long itemId) {
	    myPageService.deleteChecklistItem(itemId);
	}
	
	@PutMapping("/checklists/{checklistId}")
	public Checklist updateChecklist(
	        @PathVariable("checklistId") Long checklistId,
	        @RequestBody Checklist request
	) {
	    Checklist checklist = myPageService.getChecklist(checklistId);

	    checklist.setTitle(request.getTitle());

	    return myPageService.saveChecklist(checklist);
	}
	
	
}
