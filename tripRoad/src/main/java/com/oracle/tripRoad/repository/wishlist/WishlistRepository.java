package com.oracle.tripRoad.repository.wishlist;

import com.oracle.tripRoad.domain.wishlist.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByMemberId(Long memberId);
    
    void deleteByWishlistId(Long wishlistId);
    
}