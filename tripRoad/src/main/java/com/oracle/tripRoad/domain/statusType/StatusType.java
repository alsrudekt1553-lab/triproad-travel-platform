package com.oracle.tripRoad.domain.statusType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "status_type")
@Getter
@NoArgsConstructor
@IdClass(StatusTypeId.class)
public class StatusType {

    @Id
    @Column(name = "bcode")
    private Integer bcode;

    @Id
    @Column(name = "mcode")
    private Integer mcode;

    @Column(name = "code_contents")
    private String codeContents;
}