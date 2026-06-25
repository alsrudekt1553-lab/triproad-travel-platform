package com.oracle.tripRoad.dao.main;

import java.util.List;

import com.oracle.tripRoad.dto.main.MainProductDto;

public interface MainDao {

    List<MainProductDto> recommendProducts();

    List<MainProductDto> newProducts();
}