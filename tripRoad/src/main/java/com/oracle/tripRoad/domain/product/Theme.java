package com.oracle.tripRoad.domain.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "theme")
@Getter
@NoArgsConstructor
public class Theme {

    @Id
    @Column(name = "theme_code")
    private Integer themeCode;

    @Column(name = "theme_name", length = 20)
    private String themeName;
}