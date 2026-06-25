package com.oracle.tripRoad.repository.agreement;

import com.oracle.tripRoad.domain.agreement.AgreementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AgreementTypeRepository extends JpaRepository<AgreementType, Long> {

    @Query("SELECT a FROM AgreementType a " +
           "WHERE a.effectiveFrom <= :today " +
           "AND (a.effectiveTo IS NULL OR a.effectiveTo >= :today) " +
           "ORDER BY a.typeCode ASC")
    List<AgreementType> findCurrentAgreements(@Param("today") LocalDate today);

    @Query("SELECT a FROM AgreementType a " +
           "WHERE a.typeCode = :typeCode " +
           "AND a.effectiveFrom <= :today " +
           "AND (a.effectiveTo IS NULL OR a.effectiveTo >= :today)")
    Optional<AgreementType> findCurrentByTypeCode(@Param("typeCode") int typeCode,
                                                  @Param("today") LocalDate today);
}

