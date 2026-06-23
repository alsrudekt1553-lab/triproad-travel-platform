package com.oracle.tripRoad.dao.emailVerification;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.oracle.tripRoad.dto.emailVerification.EmailVerificationDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmailVerificationDaoImpl implements EmailVerificationDao {

	private final SqlSession session;

	@Override
	public void deleteByUserIdAndTokenType(EmailVerificationDto emailVerificationDto) {
		session.delete("com.oracle.tripRoad.EmailVerificationMapper.deleteByUserIdAndTokenType", emailVerificationDto);
	}

	@Override
	public void insertToken(EmailVerificationDto emailVerificationDto) {
		session.insert("com.oracle.tripRoad.EmailVerificationMapper.insertToken", emailVerificationDto);
	}

	@Override
	public EmailVerificationDto selectValidToken(EmailVerificationDto emailVerificationDto) {
		return session.selectOne("com.oracle.tripRoad.EmailVerificationMapper.selectValidToken", emailVerificationDto);
	}

	@Override
	public void increaseFailCount(EmailVerificationDto emailVerificationDto) {
		session.update("com.oracle.tripRoad.EmailVerificationMapper.increaseFailCount", emailVerificationDto);
	}

	@Override
	public void deleteExpiredTokens() {
		session.delete("com.oracle.tripRoad.EmailVerificationMapper.deleteExpiredTokens");
	}
}