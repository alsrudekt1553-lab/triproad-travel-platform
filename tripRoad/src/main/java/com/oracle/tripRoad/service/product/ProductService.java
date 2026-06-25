package com.oracle.tripRoad.service.product;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.oracle.tripRoad.domain.product.ProductImage;
import com.oracle.tripRoad.domain.product.Theme;
import com.oracle.tripRoad.domain.product.TravelProduct;
import com.oracle.tripRoad.domain.statusType.StatusType;
import com.oracle.tripRoad.dto.product.ProductDetailDto;
import com.oracle.tripRoad.dto.product.ProductListDto;
import com.oracle.tripRoad.dto.product.ScheduleDto;
import com.oracle.tripRoad.repository.product.ProductImageRepository;
import com.oracle.tripRoad.repository.product.ProductScheduleRepository;
import com.oracle.tripRoad.repository.product.ThemeRepository;
import com.oracle.tripRoad.repository.product.TravelProductRepository;
import com.oracle.tripRoad.repository.review.ReviewRepository;
import com.oracle.tripRoad.repository.statusType.StatusTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final TravelProductRepository productRepository;
    private final ThemeRepository themeRepository;
    private final ProductImageRepository imageRepository;
    private final ProductScheduleRepository scheduleRepository;
    private final StatusTypeRepository statusTypeRepository;
    private final ReviewRepository reviewRepository;
    
    private Double getAverageRating(Long productId) {
    	Double averageRating =
    			reviewRepository.getAvgRatingByProductId(productId);

    	if (averageRating == null || averageRating <= 0) {
    		return null;
    	}

    	return averageRating;
    }

    // 지역 목록 한번에 가져와서 Map으로 만들기
    // { 100: "제주도", 120: "부산" } 이런 형태
    private Map<Integer, String> getRegionMap() {
        return statusTypeRepository.findByBcode(510)
                .stream()
                .collect(Collectors.toMap(
                        StatusType::getMcode,
                        StatusType::getCodeContents
                ));
    }

    // 상품 목록 조회
    public List<ProductListDto> getProductList() {
        Map<Integer, String> regionMap = getRegionMap();
        return productRepository.findAllByOrderByRegDateDesc()
                .stream()
                .map(product -> {
                    String imageName = imageRepository
                            .findByProduct_ProductIdAndImgOrder(product.getProductId(), 1)
                            .map(ProductImage::getImageName)
                            .orElse(null);

                    return ProductListDto.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .price(product.getPrice())
                            .regionId(product.getRegionId())
                            .regionName(regionMap.getOrDefault(product.getRegionId(), String.valueOf(product.getRegionId())))
                            .themeName(product.getTheme() != null ? product.getTheme().getThemeName() : null)
                            .imageName(imageName)
                            .averageRating(getAverageRating(product.getProductId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 테마별 상품 목록 조회
    public List<ProductListDto> getProductListByTheme(Integer themeCode) {
        Map<Integer, String> regionMap = getRegionMap();
        return productRepository.findByTheme_ThemeCode(themeCode)
                .stream()
                .map(product -> {
                    String imageName = imageRepository
                            .findByProduct_ProductIdAndImgOrder(product.getProductId(), 1)
                            .map(ProductImage::getImageName)
                            .orElse(null);

                    return ProductListDto.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .price(product.getPrice())
                            .regionId(product.getRegionId())
                            .regionName(regionMap.getOrDefault(product.getRegionId(), String.valueOf(product.getRegionId())))
                            .themeName(product.getTheme() != null ? product.getTheme().getThemeName() : null)
                            .imageName(imageName)
                            .averageRating(getAverageRating(product.getProductId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 상품명 검색
    public List<ProductListDto> searchProduct(String keyword) {
        Map<Integer, String> regionMap = getRegionMap();
        return productRepository.findByProductNameContaining(keyword)
                .stream()
                .map(product -> {
                    String imageName = imageRepository
                            .findByProduct_ProductIdAndImgOrder(product.getProductId(), 1)
                            .map(ProductImage::getImageName)
                            .orElse(null);

                    return ProductListDto.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .price(product.getPrice())
                            .regionId(product.getRegionId())
                            .regionName(regionMap.getOrDefault(product.getRegionId(), String.valueOf(product.getRegionId())))
                            .themeName(product.getTheme() != null ? product.getTheme().getThemeName() : null)
                            .imageName(imageName)
                            .averageRating(getAverageRating(product.getProductId()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 상품 상세 조회
    public ProductDetailDto getProductDetail(Long productId) {
        Map<Integer, String> regionMap = getRegionMap();
        TravelProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // 이미지 목록
        List<String> imageNames = imageRepository
                .findByProduct_ProductIdOrderByImgOrderAsc(productId)
                .stream()
                .map(ProductImage::getImageName)
                .collect(Collectors.toList());

        // 일정 목록
        List<ScheduleDto> schedules = scheduleRepository
                .findByProduct_ProductIdOrderByStartDateAsc(productId)
                .stream()
                .map(s -> ScheduleDto.builder()
                        .scheduleId(s.getScheduleId())
                        .title(s.getTitle())
                        .content(s.getContent())
                        .status(s.getStatus())
                        .startDate(s.getStartDate())
                        .endDate(s.getEndDate())
                        .maxHeadcount(s.getMaxHeadcount())
                        .build())
                .collect(Collectors.toList());

        return ProductDetailDto.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .regionId(product.getRegionId())
                .regionName(regionMap.getOrDefault(product.getRegionId(), String.valueOf(product.getRegionId())))
                .themeName(product.getTheme() != null ? product.getTheme().getThemeName() : null)
                .regDate(product.getRegDate())
                .imageNames(imageNames)
                .schedules(schedules)
                .build();
    }

    // 테마 전체 목록 조회
    public List<Theme> getThemeList() {
        return themeRepository.findAll();
    }
}