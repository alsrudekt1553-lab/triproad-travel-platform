package com.oracle.tripRoad.service.agreement;

import com.oracle.tripRoad.dto.agreement.AgreementDto;

import java.util.List;

public interface AgreementService {


    List<AgreementDto.Info> getCurrentAgreements();


    void saveAgreements(Long bookingId, List<Long> agreementIds, String ipAddress, String userAgent);
}