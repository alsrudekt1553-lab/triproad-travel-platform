package com.oracle.tripRoad.service.agreement;

import com.oracle.tripRoad.domain.agreement.AgreementType;
import com.oracle.tripRoad.domain.agreement.BookingAgreement;
import com.oracle.tripRoad.dto.agreement.AgreementDto;
import com.oracle.tripRoad.repository.agreement.AgreementTypeRepository;
import com.oracle.tripRoad.repository.agreement.BookingAgreementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgreementServiceImpl implements AgreementService {

    private final AgreementTypeRepository agreementTypeRepository;
    private final BookingAgreementRepository bookingAgreementRepository;


    @Override
    @Transactional(readOnly = true)
    public List<AgreementDto.Info> getCurrentAgreements() {

        LocalDate today = LocalDate.now();

        return agreementTypeRepository.findCurrentAgreements(today)
                .stream()
                .map(a -> AgreementDto.Info.builder()
                        .agreementId(a.getAgreementId())
                        .typeCode(a.getTypeCode())
                        .version(a.getVersion())
                        .title(a.getTitle())
                        .content(a.getContent())
                        .isRequired(a.getIsRequired())
                        .effectiveFrom(a.getEffectiveFrom())
                        .build())
                .toList();
    }


    @Override
    @Transactional
    public void saveAgreements(Long bookingId, List<Long> agreementIds,
                               String ipAddress, String userAgent) {

        if (agreementIds == null || agreementIds.isEmpty()) {
            throw new IllegalArgumentException("동의한 약관이 없습니다.");
        }


        LocalDate today = LocalDate.now();
        List<AgreementType> currentAgreements =
                agreementTypeRepository.findCurrentAgreements(today);


        Set<Long> agreedIds = new HashSet<>(agreementIds);
        List<Long> missingRequired = currentAgreements.stream()
                .filter(AgreementType::isRequired)
                .map(AgreementType::getAgreementId)
                .filter(id -> !agreedIds.contains(id))
                .toList();

        if (!missingRequired.isEmpty()) {
            throw new IllegalArgumentException(
                    "필수 약관 미동의: agreementId=" + missingRequired);
        }


        Set<Long> validIds = currentAgreements.stream()
                .map(AgreementType::getAgreementId)
                .collect(Collectors.toSet());

        List<Long> invalidIds = agreementIds.stream()
                .filter(id -> !validIds.contains(id))
                .toList();

        if (!invalidIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "유효하지 않은 약관: agreementId=" + invalidIds);
        }


        List<BookingAgreement> rows = agreementIds.stream()
                .map(agreementId -> BookingAgreement.builder()
                        .bookingId(bookingId)
                        .agreementId(agreementId)
                        .ipAddress(ipAddress)
                        .userAgent(userAgent)
                        .build())
                .toList();

        bookingAgreementRepository.saveAll(rows);

        log.info("약관 동의 저장 완료 - bookingId={}, count={}, ip={}",
                bookingId, rows.size(), ipAddress);
    }
}