package com.oracle.tripRoad.dto.main;

import java.util.List;

import com.oracle.tripRoad.domain.product.Theme;

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
    private List<MainProductDto> recommendProducts;
    private List<MainProductDto> newProducts;
}