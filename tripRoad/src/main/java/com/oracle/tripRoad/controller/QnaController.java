package com.oracle.tripRoad.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.qna.QnaDto;
import com.oracle.tripRoad.dto.user01.User01Dto;
import com.oracle.tripRoad.service.qna.QnaService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
@Log4j2
public class QnaController {

    private final QnaService qnaService;

    private User01Dto getLoginUser(HttpSession session) {
        User01Dto loginUser = (User01Dto) session.getAttribute("LOGIN_USER");

        if (loginUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return loginUser;
    }

    @PostMapping
    public Long register(@RequestBody QnaDto qnaDto, HttpSession session) {
        User01Dto loginUser = getLoginUser(session);

        qnaDto.setUserId(loginUser.getUserId());

        log.info("qna register qnaDto -> {}", qnaDto);

        return qnaService.register(qnaDto);
    }

    @GetMapping("/{qnaId}")
    public QnaDto get(@PathVariable("qnaId") Long qnaId,
                      HttpSession session) {
        User01Dto loginUser = getLoginUser(session);

        return qnaService.get(
                qnaId,
                loginUser.getUserId(),
                loginUser.getRole()
        );
    }

    @GetMapping("/list")
    public PageResponseDTO<QnaDto> list(PageRequestDTO pageRequestDTO) {
        return qnaService.list(pageRequestDTO);
    }

    @GetMapping("/type/{qnaType}")
    public PageResponseDTO<QnaDto> listByType(
            @PathVariable("qnaType") Long qnaType,
            PageRequestDTO pageRequestDTO) {

        return qnaService.listByType(qnaType, pageRequestDTO);
    }

    @GetMapping("/user")
    public PageResponseDTO<QnaDto> listByLoginUser(
            PageRequestDTO pageRequestDTO,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        return qnaService.listByUser(loginUser.getUserId(), pageRequestDTO);
    }

    @PutMapping("/{qnaId}")
    public void modify(
            @PathVariable("qnaId") Long qnaId,
            @RequestBody QnaDto qnaDto,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaDto.setQnaId(qnaId);
        qnaDto.setUserId(loginUser.getUserId());

        qnaService.modify(qnaDto);
    }

    @DeleteMapping("/{qnaId}")
    public void remove(
            @PathVariable("qnaId") Long qnaId,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaService.remove(
                qnaId,
                loginUser.getUserId(),
                loginUser.getRole()
        );
    }

    @PutMapping("/{qnaId}/answer")
    public void answer(
            @PathVariable("qnaId") Long qnaId,
            @RequestBody QnaDto qnaDto,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaService.answer(
                qnaId,
                qnaDto.getAnswerContent(),
                loginUser.getRole()
        );
    }

    @DeleteMapping("/{qnaId}/answer")
    public void deleteAnswer(
            @PathVariable("qnaId") Long qnaId,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaService.deleteAnswer(qnaId, loginUser.getRole());
    }

    @PostMapping("/faq")
    public Long registerFaq(
            @RequestBody QnaDto qnaDto,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaDto.setUserId(loginUser.getUserId());

        return qnaService.registerFaq(qnaDto, loginUser.getRole());
    }
    @GetMapping("/faq")
    public List<QnaDto> faqList() {
        return qnaService.faqList();
    }

    @PutMapping("/faq/{qnaId}")
    public void modifyFaq(
            @PathVariable("qnaId") Long qnaId,
            @RequestBody QnaDto qnaDto,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaDto.setQnaId(qnaId);

        qnaService.modifyFaq(qnaDto, loginUser.getRole());
    }

    @DeleteMapping("/faq/{qnaId}")
    public void removeFaq(
            @PathVariable("qnaId") Long qnaId,
            HttpSession session) {

        User01Dto loginUser = getLoginUser(session);

        qnaService.removeFaq(qnaId, loginUser.getRole());
    }
}