package com.oracle.tripRoad.service.main;

import java.util.List;

import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dto.main.MainHomeDto;
import com.oracle.tripRoad.dto.product.ProductListDto;
import com.oracle.tripRoad.service.product.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private final ProductService productService;

    @Override
    public MainHomeDto getHomeData() {
        List<ProductListDto> products = productService.getProductList();

        return MainHomeDto.builder()
                .themes(productService.getThemeList())
                .recommendProducts(products.stream().limit(3).toList())
                .newProducts(products.stream().limit(6).toList())
                .build();
    }
}