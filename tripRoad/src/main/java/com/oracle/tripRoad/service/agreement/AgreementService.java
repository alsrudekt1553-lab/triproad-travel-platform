package com.oracle.tripRoad.service.agreement;

import com.oracle.tripRoad.dto.agreement.AgreementDto;

import java.util.List;

public interface AgreementService {

    List<AgreementDto.Info> getCurrentAgreements(Long productId, Long scheduleId);

    void saveAgreements(Long bookingId, Long userId, Long productId, Long scheduleId,
                        List<Long> agreementIds, String ipAddress, String userAgent);

    List<AgreementDto.ConsentResponse> getAgreementsByBookingId(Long bookingId);

    void withdrawAgreement(Long userAgreementId, Long userId);
}