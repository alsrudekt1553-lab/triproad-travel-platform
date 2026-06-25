package com.oracle.tripRoad.service.agreement;

import com.oracle.tripRoad.domain.agreement.AgreementType;
import com.oracle.tripRoad.domain.agreement.ProductAgreement;
import com.oracle.tripRoad.domain.agreement.ScheduleAgreementOverride;
import com.oracle.tripRoad.domain.agreement.UserAgreement;
import com.oracle.tripRoad.dto.agreement.AgreementDto;
import com.oracle.tripRoad.exception.ForbiddenException;
import com.oracle.tripRoad.repository.agreement.AgreementTypeRepository;
import com.oracle.tripRoad.repository.agreement.ProductAgreementRepository;
import com.oracle.tripRoad.repository.agreement.ScheduleAgreementOverrideRepository;
import com.oracle.tripRoad.repository.agreement.UserAgreementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgreementServiceImpl implements AgreementService {

    private final AgreementTypeRepository agreementTypeRepository;
    private final UserAgreementRepository userAgreementRepository;
    private final ProductAgreementRepository productAgreementRepository;
    private final ScheduleAgreementOverrideRepository scheduleAgreementOverrideRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AgreementDto.Info> getCurrentAgreements(Long productId, Long scheduleId) {

        LocalDate today = LocalDate.now();

        Map<Long, AgreementType> agreementMap = new LinkedHashMap<>();
        for (AgreementType a : agreementTypeRepository.findCurrentAgreements(today)) {
            if (a.isCommonScope()) {
                agreementMap.put(a.getAgreementId(), a);
            }
        }


        Map<Long, Integer> requiredOverrideMap = new HashMap<>();
        if (productId != null) {
            List<ProductAgreement> productAgreements =
                    productAgreementRepository.findByProductIdOrderByDisplayOrderAsc(productId);

            for (ProductAgreement pa : productAgreements) {
                AgreementType type = agreementTypeRepository.findById(pa.getAgreementId())
                        .orElse(null);
                if (type == null) continue;
                if (!type.isApplicable(today)) continue;

                agreementMap.put(type.getAgreementId(), type);

                requiredOverrideMap.put(type.getAgreementId(),
                        pa.getIsRequired() != null ? pa.getIsRequired() : 0);
            }
        }

        if (scheduleId != null) {
            List<ScheduleAgreementOverride> overrides =
                    scheduleAgreementOverrideRepository.findByScheduleId(scheduleId);

            for (ScheduleAgreementOverride o : overrides) {
                if (o.isAdd()) {
 
                    AgreementType type = agreementTypeRepository.findById(o.getAgreementId())
                            .orElse(null);
                    if (type == null) continue;
                    if (!type.isApplicable(today)) continue;

                    agreementMap.put(type.getAgreementId(), type);

                    requiredOverrideMap.put(type.getAgreementId(),
                            o.getIsRequired() != null ? o.getIsRequired() : 0);

                } else if (o.isRemove()) {
                    agreementMap.remove(o.getAgreementId());
                    requiredOverrideMap.remove(o.getAgreementId());
                }
            }
        }


        return agreementMap.values().stream()
                .map(a -> AgreementDto.Info.builder()
                        .agreementId(a.getAgreementId())
                        .typeCode(a.getTypeCode())
                        .version(a.getVersion())
                        .title(a.getTitle())
                        .content(a.getContent())
                        .isRequired(
                                requiredOverrideMap.getOrDefault(
                                        a.getAgreementId(),
                                        a.getIsRequired()
                                )
                        )
                        .effectiveFrom(a.getEffectiveFrom())
                        .build())
                .sorted(Comparator.comparingInt(AgreementDto.Info::getTypeCode))
                .toList();
    }


    @Override
    @Transactional
    public void saveAgreements(Long bookingId, Long userId, Long productId, Long scheduleId,
                               List<Long> agreementIds,
                               String ipAddress, String userAgent) {

        if (agreementIds == null || agreementIds.isEmpty()) {
            throw new IllegalArgumentException("동의한 약관이 없습니다.");
        }


        List<AgreementDto.Info> currentAgreements =
                getCurrentAgreements(productId, scheduleId);


        Set<Long> agreedIds = new HashSet<>(agreementIds);
        List<Long> missingRequired = currentAgreements.stream()
                .filter(a -> a.getIsRequired() != null && a.getIsRequired() == 1)
                .map(AgreementDto.Info::getAgreementId)
                .filter(id -> !agreedIds.contains(id))
                .toList();

        if (!missingRequired.isEmpty()) {
            throw new IllegalArgumentException(
                    "필수 약관 미동의: agreementId=" + missingRequired);
        }

        Set<Long> validIds = currentAgreements.stream()
                .map(AgreementDto.Info::getAgreementId)
                .collect(Collectors.toSet());

        List<Long> invalidIds = agreementIds.stream()
                .filter(id -> !validIds.contains(id))
                .toList();

        if (!invalidIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "유효하지 않은 약관: agreementId=" + invalidIds);
        }


        List<UserAgreement> rows = new ArrayList<>();
        for (Long agreementId : agreementIds) {
            rows.add(UserAgreement.builder()
                    .bookingId(bookingId)
                    .userId(userId)
                    .scheduleId(scheduleId)
                    .agreementId(agreementId)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build());
        }

        userAgreementRepository.saveAll(rows);

        log.info("약관 동의 저장 완료 - bookingId={}, userId={}, productId={}, scheduleId={}, count={}, ip={}",
                bookingId, userId, productId, scheduleId, rows.size(), ipAddress);
    }


    @Override
    @Transactional(readOnly = true)
    public List<AgreementDto.ConsentResponse> getAgreementsByBookingId(Long bookingId) {

        List<UserAgreement> userAgreements =
                userAgreementRepository.findByBookingIdAndWithdrawnAtIsNull(bookingId);

        return userAgreements.stream()
                .filter(UserAgreement::isAgreed)
                .map(ua -> {
                    AgreementType type = agreementTypeRepository.findById(ua.getAgreementId())
                            .orElse(null);
                    if (type == null) {
                        log.warn("약관 정보 없음 - userAgreementId={}, agreementId={}",
                                ua.getUserAgreementId(), ua.getAgreementId());
                        return null;
                    }
                    return AgreementDto.ConsentResponse.builder()
                            .userAgreementId(ua.getUserAgreementId())
                            .bookingId(ua.getBookingId())
                            .agreementId(ua.getAgreementId())
                            .typeCode(type.getTypeCode())
                            .title(type.getTitle())
                            .version(type.getVersion())
                            .agreedAt(ua.getAgreedAt())
                            .content(type.getContent())
                            .isRequired(type.getIsRequired())
                            .build();
                })
                .filter(c -> c != null)
                .sorted(Comparator.comparingInt(AgreementDto.ConsentResponse::getTypeCode))
                .toList();
    }


    @Override
    @Transactional
    public void withdrawAgreement(Long userAgreementId, Long userId) {

        UserAgreement userAgreement = userAgreementRepository.findById(userAgreementId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "약관 동의 정보를 찾을 수 없습니다. userAgreementId=" + userAgreementId));

        if (!userAgreement.getUserId().equals(userId)) {
            log.warn("약관 철회 권한 없음 - userAgreementId={}, ownerUserId={}, requestUserId={}",
                    userAgreementId, userAgreement.getUserId(), userId);
            throw new ForbiddenException("본인의 약관 동의만 철회할 수 있습니다.");
        }

        if (userAgreement.getWithdrawnAt() != null) {
            throw new IllegalArgumentException(
                    "이미 철회된 약관입니다. userAgreementId=" + userAgreementId);
        }

        AgreementType agreementType = agreementTypeRepository.findById(userAgreement.getAgreementId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "약관 정보를 찾을 수 없습니다. agreementId=" + userAgreement.getAgreementId()));

        if (agreementType.isRequired()) {
            throw new IllegalArgumentException(
                    "필수 약관은 단건 철회할 수 없습니다. 회원 탈퇴 화면에서 진행해주세요. " +
                    "agreementId=" + agreementType.getAgreementId() +
                    ", title=" + agreementType.getTitle());
        }

        userAgreement.withdraw();

        log.info("약관 동의 철회 완료 - userAgreementId={}, userId={}, agreementId={}, title={}",
                userAgreementId, userId, agreementType.getAgreementId(), agreementType.getTitle());
    }

}