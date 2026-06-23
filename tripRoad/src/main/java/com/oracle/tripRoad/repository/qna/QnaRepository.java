package com.oracle.tripRoad.repository.qna;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oracle.tripRoad.domain.qna.Qna;

public interface QnaRepository extends JpaRepository<Qna, Long> {

    @Query(value =
            "SELECT a.* FROM ( " +
            "   SELECT ROWNUM rn, a.* FROM ( " +
            "       SELECT * FROM QNA " +
            "       WHERE qna_status != 900 " +
            "       ORDER BY qna_id DESC " +
            "   ) a WHERE ROWNUM <= :end " +
            ") a WHERE rn >= :start",
            nativeQuery = true)
    List<Qna> findPagingVisible(@Param("start") int start,
                                @Param("end") int end);

    @Query(value =
            "SELECT COUNT(*) FROM QNA WHERE qna_status != 900",
            nativeQuery = true)
    Long countVisible();

    @Query(value =
            "SELECT * FROM QNA " +
            "WHERE qna_id = :qnaId " +
            "AND qna_status != 900",
            nativeQuery = true)
    Qna findVisibleQnaById(@Param("qnaId") Long qnaId);

    @Query(value =
            "SELECT a.* FROM ( " +
            "   SELECT ROWNUM rn, a.* FROM ( " +
            "       SELECT * FROM QNA " +
            "       WHERE qna_type = :qnaType " +
            "       AND qna_status != 900 " +
            "       ORDER BY qna_id DESC " +
            "   ) a WHERE ROWNUM <= :end " +
            ") a WHERE rn >= :start",
            nativeQuery = true)
    List<Qna> findPagingByQnaType(@Param("qnaType") Long qnaType,
                                  @Param("start") int start,
                                  @Param("end") int end);

    @Query(value =
            "SELECT COUNT(*) FROM QNA " +
            "WHERE qna_type = :qnaType " +
            "AND qna_status != 900",
            nativeQuery = true)
    Long countByQnaType(@Param("qnaType") Long qnaType);

    @Query(value =
            "SELECT a.* FROM ( " +
            "   SELECT ROWNUM rn, a.* FROM ( " +
            "       SELECT * FROM QNA " +
            "       WHERE user_id = :userId " +
            "       AND qna_status != 900 " +
            "       ORDER BY qna_id DESC " +
            "   ) a WHERE ROWNUM <= :end " +
            ") a WHERE rn >= :start",
            nativeQuery = true)
    List<Qna> findPagingByUserId(@Param("userId") Long userId,
                                 @Param("start") int start,
                                 @Param("end") int end);

    @Query(value =
            "SELECT COUNT(*) FROM QNA " +
            "WHERE user_id = :userId " +
            "AND qna_status != 900",
            nativeQuery = true)
    Long countByUserId(@Param("userId") Long userId);

    @Query(value =
            "SELECT * FROM QNA " +
            "WHERE qna_type = 500 " +
            "AND is_admin_post = 1 " +
            "AND qna_status != 900 " +
            "ORDER BY qna_id DESC",
            nativeQuery = true)
    List<Qna> findFaqList();
}