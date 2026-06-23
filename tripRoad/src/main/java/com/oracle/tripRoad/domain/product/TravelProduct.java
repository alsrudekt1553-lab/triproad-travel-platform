package com.oracle.tripRoad.domain.product;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "travel_product")
@Getter
@NoArgsConstructor
public class TravelProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
        generator = "product_seq")
    @SequenceGenerator(name = "product_seq",
        sequenceName = "product_seq", allocationSize = 1)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "region_id")
    private Integer regionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_code")
    private Theme theme;

    @Column(name = "product_name", length = 200, nullable = false)
    private String productName;

    @Column(name = "description", length = 4000)
    private String description;

    @Column(name = "price")
    private Long price;

    @Column(name = "reg_date", nullable = false)
    private LocalDate regDate;

    @Column(name = "mod_date")
    private LocalDate modDate;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductSchedule> schedules = new ArrayList<>();
}