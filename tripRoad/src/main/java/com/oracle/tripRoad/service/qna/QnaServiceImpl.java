package com.oracle.tripRoad.service.qna;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.domain.qna.Qna;
import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.qna.QnaDto;
import com.oracle.tripRoad.repository.qna.QnaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class QnaServiceImpl implements QnaService {

    private final QnaRepository qnaRepository;
    private final ModelMapper modelMapper;

    @Override
    public Long register(QnaDto qnaDto) {

        validateBasic(qnaDto);

        Qna qna = modelMapper.map(qnaDto, Qna.class);
        qna.changeDefaultStatus();

        Qna savedQna = qnaRepository.save(qna);

        return savedQna.getQnaId();
    }

    @Override
    public QnaDto get(Long qnaId, Long loginUserId, Long role) {

        Qna qna = qnaRepository.findVisibleQnaById(qnaId);

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 문의입니다.");
        }

        if (Long.valueOf(1L).equals(qna.getIsSecret())) {

            boolean isWriter = qna.getUserId().equals(loginUserId);
            boolean isAdmin = isAdmin(role);

            if (!isWriter && !isAdmin) {
                throw new IllegalArgumentException("비밀글은 작성자와 관리자만 조회할 수 있습니다.");
            }
        }

        return modelMapper.map(qna, QnaDto.class);
    }

    @Override
    public PageResponseDTO<QnaDto> list(PageRequestDTO pageRequestDTO) {

        setPaging(pageRequestDTO);

        List<QnaDto> dtoList = qnaRepository.findPagingVisible(
                        pageRequestDTO.getStart(),
                        pageRequestDTO.getEnd()
                )
                .stream()
                .map(qna -> modelMapper.map(qna, QnaDto.class))
                .toList();

        int totalCount = qnaRepository.countVisible().intValue();

        return PageResponseDTO.<QnaDto>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<QnaDto> listByType(Long qnaType, PageRequestDTO pageRequestDTO) {

        setPaging(pageRequestDTO);

        List<QnaDto> dtoList = qnaRepository.findPagingByQnaType(
                        qnaType,
                        pageRequestDTO.getStart(),
                        pageRequestDTO.getEnd()
                )
                .stream()
                .map(qna -> modelMapper.map(qna, QnaDto.class))
                .toList();

        int totalCount = qnaRepository.countByQnaType(qnaType).intValue();

        return PageResponseDTO.<QnaDto>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<QnaDto> listByUser(Long userId, PageRequestDTO pageRequestDTO) {

        setPaging(pageRequestDTO);

        List<QnaDto> dtoList = qnaRepository.findPagingByUserId(
                        userId,
                        pageRequestDTO.getStart(),
                        pageRequestDTO.getEnd()
                )
                .stream()
                .map(qna -> modelMapper.map(qna, QnaDto.class))
                .toList();

        int totalCount = qnaRepository.countByUserId(userId).intValue();

        return PageResponseDTO.<QnaDto>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public void modify(QnaDto qnaDto) {

        Qna qna = qnaRepository.findVisibleQnaById(qnaDto.getQnaId());

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 문의입니다.");
        }

        if (!qna.getUserId().equals(qnaDto.getUserId())) {
            throw new IllegalArgumentException("본인이 작성한 문의만 수정할 수 있습니다.");
        }

        if (qna.getQnaStatus().equals(200L)) {
            throw new IllegalArgumentException("답변완료된 문의는 수정할 수 없습니다.");
        }

        validateBasic(qnaDto);

        qna.changeQna(
                qnaDto.getTitle(),
                qnaDto.getContent(),
                qnaDto.getQnaType(),
                qnaDto.getProductId(),
                qnaDto.getScheduleId(),
                qnaDto.getPaymentId(),
                qnaDto.getIsSecret()
        );
    }

    @Override
    public void remove(Long qnaId, Long userId, Long role) {

        Qna qna = qnaRepository.findVisibleQnaById(qnaId);

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 문의입니다.");
        }

        boolean isOwner = qna.getUserId().equals(userId);
        boolean isAdmin = role != null && role.equals(900L);

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("문의 삭제 권한이 없습니다.");
        }

        qna.hideQna();
    }

    @Override
    public void answer(Long qnaId, String answerContent, Long role) {

        checkAdmin(role);

        Qna qna = qnaRepository.findVisibleQnaById(qnaId);

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 문의입니다.");
        }

        if (answerContent == null || answerContent.trim().isEmpty()) {
            throw new IllegalArgumentException("답변 내용은 필수입니다.");
        }

        qna.answer(answerContent);
    }

    @Override
    public void deleteAnswer(Long qnaId, Long role) {

        checkAdmin(role);

        Qna qna = qnaRepository.findVisibleQnaById(qnaId);

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 문의입니다.");
        }

        qna.deleteAnswer();
    }

    @Override
    public Long registerFaq(QnaDto qnaDto, Long role) {

        checkAdmin(role);

        validateBasic(qnaDto);

        Qna qna = modelMapper.map(qnaDto, Qna.class);
        qna.changeFaqStatus();

        Qna savedQna = qnaRepository.save(qna);

        return savedQna.getQnaId();
    }

    @Override
    public List<QnaDto> faqList() {

        return qnaRepository.findFaqList()
                .stream()
                .map(qna -> modelMapper.map(qna, QnaDto.class))
                .toList();
    }

    @Override
    public void modifyFaq(QnaDto qnaDto, Long role) {

        checkAdmin(role);

        Qna qna = qnaRepository.findVisibleQnaById(qnaDto.getQnaId());

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 FAQ입니다.");
        }

        if (!qna.getIsAdminPost().equals(1L) || !qna.getQnaType().equals(500L)) {
            throw new IllegalArgumentException("FAQ 글이 아닙니다.");
        }

        validateBasic(qnaDto);

        qna.changeQna(
                qnaDto.getTitle(),
                qnaDto.getContent(),
                500L,
                null,
                null,
                null,
                0L
        );
    }

    @Override
    public void removeFaq(Long qnaId, Long role) {

        checkAdmin(role);

        Qna qna = qnaRepository.findVisibleQnaById(qnaId);

        if (qna == null) {
            throw new IllegalArgumentException("존재하지 않는 FAQ입니다.");
        }

        if (!qna.getIsAdminPost().equals(1L) || !qna.getQnaType().equals(500L)) {
            throw new IllegalArgumentException("FAQ 글이 아닙니다.");
        }

        qna.hideQna();
    }

    private void validateBasic(QnaDto qnaDto) {

        if (qnaDto.getUserId() == null) {
            throw new IllegalArgumentException("사용자 번호는 필수입니다.");
        }

        if (qnaDto.getTitle() == null || qnaDto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("제목은 필수입니다.");
        }

        if (qnaDto.getContent() == null || qnaDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("내용은 필수입니다.");
        }
    }

    private void checkAdmin(Long role) {
        if (!isAdmin(role)) {
            throw new IllegalArgumentException("관리자만 처리할 수 있습니다.");
        }
    }

    private boolean isAdmin(Long role) {
        return Long.valueOf(900L).equals(role);
    }

    private void setPaging(PageRequestDTO pageRequestDTO) {

        int page = pageRequestDTO.getPage();
        int size = pageRequestDTO.getSize();

        int start = (page - 1) * size + 1;
        int end = page * size;

        pageRequestDTO.setStart(start);
        pageRequestDTO.setEnd(end);
    }
}