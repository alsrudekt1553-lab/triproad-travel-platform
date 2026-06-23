package com.oracle.tripRoad.service.qna;

import java.util.List;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.qna.QnaDto;

public interface QnaService {

    Long register(QnaDto qnaDto);

    QnaDto get(Long qnaId, Long loginUserId, Long role);

    PageResponseDTO<QnaDto> list(PageRequestDTO pageRequestDTO);

    PageResponseDTO<QnaDto> listByType(Long qnaType, PageRequestDTO pageRequestDTO);

    PageResponseDTO<QnaDto> listByUser(Long userId, PageRequestDTO pageRequestDTO);

    void modify(QnaDto qnaDto);

    void remove(Long qnaId, Long userId, Long role);

    void answer(Long qnaId, String answerContent, Long role);

    void deleteAnswer(Long qnaId, Long role);

    Long registerFaq(QnaDto qnaDto, Long role);

    List<QnaDto> faqList();

    void modifyFaq(QnaDto qnaDto, Long role);

    void removeFaq(Long qnaId, Long role);
}