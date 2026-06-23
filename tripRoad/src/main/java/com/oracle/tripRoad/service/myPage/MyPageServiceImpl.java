package com.oracle.tripRoad.service.myPage;

import com.oracle.tripRoad.domain.checklist.Checklist;
import com.oracle.tripRoad.domain.checklistItem.ChecklistItem;
import com.oracle.tripRoad.domain.product.TravelProduct;
import com.oracle.tripRoad.domain.wishlist.Wishlist;
import com.oracle.tripRoad.dto.wishlist.WishlistDto;
import com.oracle.tripRoad.repository.checklist.ChecklistRepository;
import com.oracle.tripRoad.repository.checklistItem.ChecklistItemRepository;
import com.oracle.tripRoad.repository.product.ProductImageRepository;
import com.oracle.tripRoad.repository.product.TravelProductRepository;
import com.oracle.tripRoad.repository.wishlist.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {

    private final WishlistRepository wishlistRepository;
    private final ChecklistRepository checklistRepository;
    private final ChecklistItemRepository checklistItemRepository;
    private final TravelProductRepository travelProductRepository;
    private final ProductImageRepository productImageRepository;

    public List<WishlistDto> getWishlist(Long memberId) {
        return wishlistRepository.findByMemberId(memberId)
                .stream()
                .map(wishlist -> {
                    TravelProduct product =
                            travelProductRepository.findById(wishlist.getPackageId())
                                    .orElseThrow();
                    String imageName = productImageRepository
                            .findByProduct_ProductIdAndImgOrder(product.getProductId(), 1)
                            .map(image -> image.getImageName())
                            .orElse(null);
                    
                    return WishlistDto.builder()
                            .wishlistId(wishlist.getWishlistId())
                            .userId(wishlist.getMemberId())
                            .productId(wishlist.getPackageId())
                            .productName(product.getProductName())
                            .createdAt(java.sql.Timestamp.valueOf(wishlist.getCreatedAt()))
                            .price(product.getPrice())
                            .imageName(imageName)
                            .build();
                })
                .toList();
    }

	@Override
	public void deleteWishlist(Long wishlistId) {
		wishlistRepository.deleteById(wishlistId);		
	}

	@Override
	public List<Checklist> getChecklists(Long userId) {
	    return checklistRepository.findByUserId(userId);
	}

	@Override
	public Checklist saveChecklist(Checklist checklist) {
	    return checklistRepository.save(checklist);
	}

	@Override
	public void deleteChecklist(Long checklistId) {
	    List<ChecklistItem> items =
	            checklistItemRepository.findByChecklistId(checklistId);

	    checklistItemRepository.deleteAll(items);

	    checklistRepository.deleteById(checklistId);
	}

	@Override
	public List<ChecklistItem> getChecklistItems(Long checklistId) {
		return checklistItemRepository.findByChecklistId(checklistId);
	}

	@Override
	public ChecklistItem saveChecklistItem(ChecklistItem checklistItem) {
		return checklistItemRepository.save(checklistItem);
	}

	@Override
	public ChecklistItem updateChecklistItem(ChecklistItem checklistItem) {
		return checklistItemRepository.save(checklistItem);
	}

	@Override
	public void deleteChecklistItem(Long itemId) {
		checklistItemRepository.deleteById(itemId);
		
	}

	@Override
	public Checklist getChecklist(Long checklistId) {
	    return checklistRepository.findById(checklistId)
	            .orElseThrow();
	}
	
	
}