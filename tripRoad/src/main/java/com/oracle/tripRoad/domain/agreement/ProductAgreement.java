package com.oracle.tripRoad.domain.agreement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PRODUCT_AGREEMENT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "productAgreementId")
public class ProductAgreement {

    public static final int REQUIRED_YES = 1;
    public static final int REQUIRED_NO  = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRODUCT_AGREEMENT_SEQ_GENERATOR")
    @SequenceGenerator(
            name = "PRODUCT_AGREEMENT_SEQ_GENERATOR",
            sequenceName = "PRODUCT_AGREEMENT_SEQ",
            allocationSize = 1
    )
    @Column(name = "PRODUCT_AGREEMENT_ID", precision = 19)
    private Long productAgreementId;

    @Column(name = "PRODUCT_ID", nullable = false)
    private Long productId;

    @Column(name = "AGREEMENT_ID", nullable = false, precision = 19)
    private Long agreementId;

    @Column(name = "IS_REQUIRED", nullable = false)
    private Integer isRequired;

    @Column(name = "DISPLAY_ORDER", nullable = false)
    private Integer displayOrder;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isRequired == null) {
            this.isRequired = REQUIRED_NO;
        }
        if (this.displayOrder == null) {
            this.displayOrder = 999;
        }
    }

    public boolean isRequired() {
        return this.isRequired != null && this.isRequired == REQUIRED_YES;
    }
}