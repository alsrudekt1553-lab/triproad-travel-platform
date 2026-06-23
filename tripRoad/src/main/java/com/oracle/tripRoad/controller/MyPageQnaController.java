package com.oracle.tripRoad.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.qna.QnaDto;
import com.oracle.tripRoad.service.qna.QnaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage/qna")
public class MyPageQnaController {

    private final QnaService qnaService;

    @GetMapping("/user/{userId}")
    public PageResponseDTO<QnaDto> listByUser(
            @PathVariable("userId") Long userId,
            PageRequestDTO pageRequestDTO
    ) {
        return qnaService.listByUser(userId, pageRequestDTO);
    }
}