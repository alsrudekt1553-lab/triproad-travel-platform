package com.oracle.tripRoad.service.user01;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dao.emailVerification.EmailVerificationDao;
import com.oracle.tripRoad.dao.user01.User01Dao;
import com.oracle.tripRoad.dto.emailVerification.EmailVerificationDto;
import com.oracle.tripRoad.dto.user01.User01Dto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;


@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class User01ServiceImpl implements User01Service {

	private static final long PASSWORD_RESET_TOKEN_TYPE = 100L;
	private static final long MAX_FAIL_COUNT = 5L;
	private static final String TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	private final User01Dao user01Dao;
	private final EmailVerificationDao emailVerificationDao;
	private final JavaMailSender mailSender;

	private String createEmailToken() {
		SecureRandom random = new SecureRandom();
		StringBuilder token = new StringBuilder();

		for (int i = 0; i < 6; i++) {
			int index = random.nextInt(TOKEN_CHARS.length());
			token.append(TOKEN_CHARS.charAt(index));
		}

		return token.toString();
	}
	
	@Override
	public Long register(User01Dto user01Dto) {
		log.info("register userDto->" + user01Dto);
		user01Dao.insertUser(user01Dto);
		return user01Dto.getUserId();
	}

	@Override
	public boolean checkLoginId(String loginId) {
		int count = user01Dao.countByLoginId(loginId);
		return count > 0;
	}

	@Override
	public User01Dto login(String loginId, String password) {
		User01Dto userDto = new User01Dto();
		userDto.setLoginId(loginId);
		userDto.setPassword(password);
		return user01Dao.login(userDto);
	}

	@Override
	public int userTotal() {
		return user01Dao.totalUser();
	}

	@Override
	public PageResponseDTO<User01Dto> list(PageRequestDTO pageRequestDTO) {
		List<User01Dto> dtoList = user01Dao.listUser(pageRequestDTO);
		int totalCount = user01Dao.totalUser();
		PageResponseDTO<User01Dto> responseDTO = PageResponseDTO.<User01Dto>withAll()
				.dtoList(dtoList)
				.pageRequestDTO(pageRequestDTO)
				.totalCount(totalCount)
				.build();
		return responseDTO;
	}

	@Override
	public User01Dto get(Long userId) {
		return user01Dao.selectUser(userId);
	}

	@Override
	public void modify(User01Dto user01Dto) {
		user01Dao.updateUser(user01Dto);
	}

	@Override
	public void remove(Long userId) {
		user01Dao.deleteUser(userId);
	}

	@Override
	public String findLoginId(User01Dto user01Dto) {
		User01Dto found = user01Dao.findLoginIdByNameAndEmail(user01Dto);
		if (found == null) {
			return null;
		}
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(found.getEmail());
			message.setSubject("[tripRoad] 로그인 ID 찾기 결과");
			message.setText("회원님의 로그인 ID는 다음과 같습니다.\n\n로그인 ID: " + found.getLoginId());
			mailSender.send(message);
			return found.getEmail();
		} catch (Exception e) {
			log.error("이메일 발송 실패", e);
			return "EMAIL_FAIL";
		}
	}
	
	@Override
	public Map<String, Object> sendPasswordResetCode(User01Dto user01Dto) {
		User01Dto found = user01Dao.verifyUserByLoginIdAndEmail(user01Dto);

		if (found == null) {
			return Map.of("result", 0, "MESSAGE", "일치하는 회원 정보가 없습니다.");
		}

		EmailVerificationDto deleteDto = EmailVerificationDto.builder()
				.userId(found.getUserId())
				.tokenType(PASSWORD_RESET_TOKEN_TYPE)
				.build();

		emailVerificationDao.deleteByUserIdAndTokenType(deleteDto);
		emailVerificationDao.deleteExpiredTokens();

		String token = createEmailToken();

		EmailVerificationDto tokenDto = EmailVerificationDto.builder()
				.userId(found.getUserId())
				.emailToken(token)
				.tokenType(PASSWORD_RESET_TOKEN_TYPE)
				.build();

		emailVerificationDao.insertToken(tokenDto);

		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(found.getEmail());
			message.setSubject("[TripRoad] 비밀번호 재설정 인증코드");
			message.setText("비밀번호 재설정 인증코드는 다음과 같습니다.\n\n인증코드: " + token + "\n\n인증코드는 5분 동안 유효합니다.");
			mailSender.send(message);

			return Map.of("result", 1, "USER_ID", found.getUserId(), "MESSAGE", "인증코드가 발송되었습니다.");
		} catch (Exception e) {
			log.error("비밀번호 재설정 인증코드 이메일 발송 실패", e);
			emailVerificationDao.deleteByUserIdAndTokenType(deleteDto);
			return Map.of("result", 0, "MESSAGE", "이메일 발송 중 오류가 발생했습니다.");
		}
	}

	@Override
	public Map<String, Object> verifyPasswordResetCode(Long userId, String emailToken) {
		EmailVerificationDto searchDto = EmailVerificationDto.builder()
				.userId(userId)
				.tokenType(PASSWORD_RESET_TOKEN_TYPE)
				.build();

		EmailVerificationDto savedToken = emailVerificationDao.selectValidToken(searchDto);

		if (savedToken == null) {
			return Map.of("result", 0, "code", "TOKEN_EXPIRED", "MESSAGE", "인증코드가 만료되었습니다. 다시 발송해주세요.");
		}

		if (savedToken.getFailCount() != null && savedToken.getFailCount() >= MAX_FAIL_COUNT) {
			emailVerificationDao.deleteByUserIdAndTokenType(searchDto);
			return Map.of("result", 0, "code", "TOO_MANY_FAIL", "MESSAGE", "인증 실패 횟수를 초과했습니다. 인증코드를 다시 발송해주세요.");
		}

		if (!savedToken.getEmailToken().equalsIgnoreCase(emailToken)) {
			emailVerificationDao.increaseFailCount(searchDto);

			long nextFailCount = (savedToken.getFailCount() == null ? 0 : savedToken.getFailCount()) + 1;

			if (nextFailCount >= MAX_FAIL_COUNT) {
				emailVerificationDao.deleteByUserIdAndTokenType(searchDto);
				return Map.of("result", 0, "code", "TOO_MANY_FAIL", "MESSAGE", "인증 실패 횟수를 초과했습니다. 인증코드를 다시 발송해주세요.");
			}

			return Map.of("result", 0, "code", "TOKEN_MISMATCH", "MESSAGE", "인증코드가 일치하지 않습니다.");
		}

		return Map.of("result", 1, "MESSAGE", "인증되었습니다.");
	}

	@Override
	public Map<String, Object> changePasswordAfterVerification(User01Dto user01Dto) {
		EmailVerificationDto searchDto = EmailVerificationDto.builder()
				.userId(user01Dto.getUserId())
				.tokenType(PASSWORD_RESET_TOKEN_TYPE)
				.build();

		EmailVerificationDto savedToken = emailVerificationDao.selectValidToken(searchDto);

		if (savedToken == null) {
			return Map.of("result", 0, "MESSAGE", "인증정보가 만료되었습니다. 다시 인증해주세요.");
		}

		user01Dao.updatePassword(user01Dto);
		emailVerificationDao.deleteByUserIdAndTokenType(searchDto);

		return Map.of("result", 1, "MESSAGE", "비밀번호가 변경되었습니다.");
	}
}
