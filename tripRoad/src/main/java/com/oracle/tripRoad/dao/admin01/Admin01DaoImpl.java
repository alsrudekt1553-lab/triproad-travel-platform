package com.oracle.tripRoad.dao.admin01;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.oracle.tripRoad.dto.admin01.Admin01BookingDto;
import com.oracle.tripRoad.dto.admin01.Admin01ProductDto;
import com.oracle.tripRoad.dto.productImage.ProductImageDto;
import com.oracle.tripRoad.dto.productSchedule.ProductScheduleDto;
import com.oracle.tripRoad.dto.statusType.StatusTypeDto;
import com.oracle.tripRoad.dto.theme.ThemeDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class Admin01DaoImpl implements Admin01Dao {
	
	private final SqlSession session;

	@Override
	public List<Admin01BookingDto> bookingList() {
		return session.selectList("com.oracle.tripRoad.Admin01Mapper.bookingList");
	}

	@Override
	public int addProduct(Admin01ProductDto admin01ProductDto) {
		return session.insert("com.oracle.tripRoad.Admin01Mapper.addProduct", admin01ProductDto);
	}
	
	@Override
	public int addProductImage(ProductImageDto productImageDto) {
	    return session.insert("com.oracle.tripRoad.Admin01Mapper.addProductImage", productImageDto);
	}
	
	@Override
	public int addProductSchedule(ProductScheduleDto productScheduleDto) {
	    return session.insert("com.oracle.tripRoad.Admin01Mapper.addProductSchedule", productScheduleDto);
	}
	
	@Override
	public int modifyProduct(Admin01ProductDto admin01ProductDto) {
	    return session.update("com.oracle.tripRoad.Admin01Mapper.modifyProduct", admin01ProductDto);
	}

	@Override
	public int upsertProductImage(ProductImageDto productImageDto) {
	    return session.update("com.oracle.tripRoad.Admin01Mapper.upsertProductImage", productImageDto);
	}
	
	@Override
	public int modifyProductSchedule(ProductScheduleDto productScheduleDto) {
	    return session.update("com.oracle.tripRoad.Admin01Mapper.modifyProductSchedule", productScheduleDto);
	}
	
	@Override
	public List<Admin01ProductDto> productList() {
	    return session.selectList("com.oracle.tripRoad.Admin01Mapper.productList");
	}

	@Override
	public Admin01ProductDto productDetail(Long productId) {
	    return session.selectOne(
	        "com.oracle.tripRoad.Admin01Mapper.productDetail",
	        productId
	    );
	}
	
	@Override
	public List<ProductScheduleDto> scheduleList(Long productId) {
	    return session.selectList("com.oracle.tripRoad.Admin01Mapper.scheduleList", productId);
	}
	
	@Override
	public List<StatusTypeDto> regionList() {
	    return session.selectList("com.oracle.tripRoad.Admin01Mapper.regionList");
	}

	@Override
	public List<ThemeDto> themeList() {
	    return session.selectList("com.oracle.tripRoad.Admin01Mapper.themeList");
	}
}
