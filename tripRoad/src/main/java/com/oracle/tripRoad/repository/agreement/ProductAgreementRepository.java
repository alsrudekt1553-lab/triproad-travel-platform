package com.oracle.tripRoad.repository.agreement;

import com.oracle.tripRoad.domain.agreement.ProductAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductAgreementRepository extends JpaRepository<ProductAgreement, Long> {

    List<ProductAgreement> findByProductIdOrderByDisplayOrderAsc(Long productId);

    boolean existsByProductIdAndAgreementId(Long productId, Long agreementId);

    @Query("SELECT pa FROM ProductAgreement pa " +
           "WHERE pa.productId = :productId AND pa.isRequired = 1 " +
           "ORDER BY pa.displayOrder ASC")
    List<ProductAgreement> findRequiredByProductId(@Param("productId") Long productId);
}