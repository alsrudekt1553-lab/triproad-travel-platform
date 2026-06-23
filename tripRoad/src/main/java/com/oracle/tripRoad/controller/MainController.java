package com.oracle.tripRoad.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.dto.main.MainHomeDto;
import com.oracle.tripRoad.service.main.MainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/main")
public class MainController {

    private final MainService mainService;

    @GetMapping("/home")
    public MainHomeDto home() {
        return mainService.getHomeData();
    }
}