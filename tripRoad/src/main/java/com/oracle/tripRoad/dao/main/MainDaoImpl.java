package com.oracle.tripRoad.dao.main;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.oracle.tripRoad.dto.main.MainProductDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MainDaoImpl implements MainDao {

    private final SqlSession session;

    @Override
    public List<MainProductDto> recommendProducts() {
        return session.selectList(
                "com.oracle.tripRoad.MainMapper.recommendProducts"
        );
    }

    @Override
    public List<MainProductDto> newProducts() {
        return session.selectList(
                "com.oracle.tripRoad.MainMapper.newProducts"
        );
    }
}