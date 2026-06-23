package com.oracle.tripRoad.dto.main;

import java.util.List;

import com.oracle.tripRoad.domain.product.Theme;
import com.oracle.tripRoad.dto.product.ProductListDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MainHomeDto {

    private List<Theme> themes;
    private List<ProductListDto> recommendProducts;
    private List<ProductListDto> newProducts;
}