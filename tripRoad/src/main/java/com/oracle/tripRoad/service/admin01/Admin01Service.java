package com.oracle.tripRoad.service.admin01;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.oracle.tripRoad.dto.admin01.Admin01BookingDto;
import com.oracle.tripRoad.dto.admin01.Admin01ProductDto;
import com.oracle.tripRoad.dto.productSchedule.ProductScheduleDto;
import com.oracle.tripRoad.dto.statusType.StatusTypeDto;
import com.oracle.tripRoad.dto.theme.ThemeDto;

public interface Admin01Service {
    List<Admin01BookingDto> bookingList();
    int addProduct(Admin01ProductDto admin01ProductDto, MultipartFile imageFile);
    int addSchedule(ProductScheduleDto productScheduleDto);
    int modifyProduct(Admin01ProductDto admin01ProductDto, MultipartFile imageFile);
    int modifySchedule(ProductScheduleDto productScheduleDto);
    List<Admin01ProductDto> productList();
    Admin01ProductDto productDetail(Long productId);
    List<ProductScheduleDto> scheduleList(Long productId);
    List<StatusTypeDto> regionList();
    List<ThemeDto> themeList();
}