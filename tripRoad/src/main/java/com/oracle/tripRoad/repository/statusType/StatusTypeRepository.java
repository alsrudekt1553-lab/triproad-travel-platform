package com.oracle.tripRoad.repository.statusType;

import java.util.Optional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oracle.tripRoad.domain.statusType.StatusType;
import com.oracle.tripRoad.domain.statusType.StatusTypeId;

public interface StatusTypeRepository extends JpaRepository<StatusType, StatusTypeId> {

    // bcode랑 mcode로 지역명 조회
    // 예: bcode=510, mcode=100 → "제주도"
    Optional<StatusType> findByBcodeAndMcode(Integer bcode, Integer mcode);
    
    // bcode=510인 목록 전체 조회
    List<StatusType> findByBcode(Integer bcode);
}