package com.oracle.tripRoad.service.main;

import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dao.main.MainDao;
import com.oracle.tripRoad.dto.main.MainHomeDto;
import com.oracle.tripRoad.service.product.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private final ProductService productService;
    private final MainDao mainDao;

    @Override
    public MainHomeDto getHomeData() {
        return MainHomeDto.builder()
                .themes(productService.getThemeList())
                .recommendProducts(mainDao.recommendProducts())
                .newProducts(mainDao.newProducts())
                .build();
    }
}