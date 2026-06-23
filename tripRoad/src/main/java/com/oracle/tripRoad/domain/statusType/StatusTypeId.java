package com.oracle.tripRoad.domain.statusType;

import java.io.Serializable;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class StatusTypeId implements Serializable {

    private Integer bcode;
    private Integer mcode;
}