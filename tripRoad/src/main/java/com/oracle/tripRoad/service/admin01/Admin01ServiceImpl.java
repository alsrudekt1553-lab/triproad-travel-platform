package com.oracle.tripRoad.service.admin01;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.tripRoad.dao.admin01.Admin01Dao;
import com.oracle.tripRoad.dto.admin01.Admin01BookingDto;
import com.oracle.tripRoad.dto.admin01.Admin01ProductDto;
import com.oracle.tripRoad.dto.productImage.ProductImageDto;
import com.oracle.tripRoad.dto.productSchedule.ProductScheduleDto;
import com.oracle.tripRoad.dto.statusType.StatusTypeDto;
import com.oracle.tripRoad.dto.theme.ThemeDto;
import com.oracle.tripRoad.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Admin01ServiceImpl implements Admin01Service {
	
	private final Admin01Dao adminDao;
	private final CustomFileUtil customFileUtil;
	
	@Override
	public List<Admin01BookingDto> bookingList() {
		return adminDao.bookingList();
	}

	@Override
	@Transactional
	public int addProduct(Admin01ProductDto admin01ProductDto, MultipartFile imageFile) {
		int result = adminDao.addProduct(admin01ProductDto);
	    
	    if (imageFile != null && !imageFile.isEmpty()) {
	        String savedName = customFileUtil.saveProductImage(imageFile);

	        ProductImageDto productImageDto = ProductImageDto.builder()
	                .productId(admin01ProductDto.getProductId())
	                .imageName(savedName)
	                .imgOrder(1L)
	                .build();

	        adminDao.addProductImage(productImageDto);
	    }

	    return result;
	}
	
	@Override
	@Transactional
	public int addSchedule(ProductScheduleDto productScheduleDto) {
	    if (productScheduleDto.getStatus() == null) {
	        productScheduleDto.setStatus(100L);
	    }

	    return adminDao.addProductSchedule(productScheduleDto);
	}
	
	@Override
	@Transactional
	public int modifyProduct(Admin01ProductDto admin01ProductDto, MultipartFile imageFile) {
	    int result = adminDao.modifyProduct(admin01ProductDto);
	    
	    if (result == 0) {
	        throw new IllegalArgumentException("존재하지 않는 상품입니다.");
	    }
	    
	    if (imageFile != null && !imageFile.isEmpty()) {
	        String savedName = customFileUtil.saveProductImage(imageFile);

	        ProductImageDto productImageDto = ProductImageDto.builder()
	                .productId(admin01ProductDto.getProductId())
	                .imageName(savedName)
	                .imgOrder(1L)
	                .build();

	        adminDao.upsertProductImage(productImageDto);
	    }

	    return result;
	}
	
	@Override
	@Transactional
	public int modifySchedule(ProductScheduleDto productScheduleDto) {
	    int result = adminDao.modifyProductSchedule(productScheduleDto);

	    if (result == 0) {
	        throw new IllegalArgumentException("존재하지 않는 일정입니다.");
	    }

	    return result;
	}
	
	@Override
	public List<Admin01ProductDto> productList() {
	    return adminDao.productList();
	}

	@Override
	public Admin01ProductDto productDetail(Long productId) {
	    Admin01ProductDto product = adminDao.productDetail(productId);

	    if (product == null) {
	        throw new IllegalArgumentException("존재하지 않는 상품입니다.");
	    }

	    return product;
	}
	
	@Override
	public List<ProductScheduleDto> scheduleList(Long productId) {
	    return adminDao.scheduleList(productId);
	}
	
	@Override
	public List<StatusTypeDto> regionList() {
	    return adminDao.regionList();
	}

	@Override
	public List<ThemeDto> themeList() {
	    return adminDao.themeList();
	}
	
}
