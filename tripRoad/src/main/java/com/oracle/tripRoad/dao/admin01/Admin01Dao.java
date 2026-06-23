package com.oracle.tripRoad.dao.admin01;

import java.util.List;

import com.oracle.tripRoad.dto.admin01.Admin01BookingDto;
import com.oracle.tripRoad.dto.admin01.Admin01ProductDto;
import com.oracle.tripRoad.dto.productImage.ProductImageDto;
import com.oracle.tripRoad.dto.productSchedule.ProductScheduleDto;
import com.oracle.tripRoad.dto.statusType.StatusTypeDto;
import com.oracle.tripRoad.dto.theme.ThemeDto;

public interface Admin01Dao {
    List<Admin01BookingDto> bookingList();
    int addProduct(Admin01ProductDto adminProductDto);
    int addProductImage(ProductImageDto productImageDto);
    int addProductSchedule(ProductScheduleDto productScheduleDto);
    int modifyProduct(Admin01ProductDto adminProductDto);
    int upsertProductImage(ProductImageDto productImageDto);
    int modifyProductSchedule(ProductScheduleDto productScheduleDto);
    List<Admin01ProductDto> productList();
    Admin01ProductDto productDetail(Long productId);
    List<ProductScheduleDto> scheduleList(Long productId);
    List<StatusTypeDto> regionList();
    List<ThemeDto> themeList();
}