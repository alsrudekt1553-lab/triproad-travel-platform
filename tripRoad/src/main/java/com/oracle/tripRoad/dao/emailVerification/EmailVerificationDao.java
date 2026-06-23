package com.oracle.tripRoad.dao.emailVerification;

import com.oracle.tripRoad.dto.emailVerification.EmailVerificationDto;

public interface EmailVerificationDao {

	void deleteByUserIdAndTokenType(EmailVerificationDto emailVerificationDto);

	void insertToken(EmailVerificationDto emailVerificationDto);

	EmailVerificationDto selectValidToken(EmailVerificationDto emailVerificationDto);

	void increaseFailCount(EmailVerificationDto emailVerificationDto);

	void deleteExpiredTokens();
}