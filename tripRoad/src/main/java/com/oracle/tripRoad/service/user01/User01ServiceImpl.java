package com.oracle.tripRoad.service.user01;

import java.security.SecureRandom;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.oracle.tripRoad.dao.emailVerification.EmailVerificationDao;
import com.oracle.tripRoad.dao.user01.User01Dao;
import com.oracle.tripRoad.dto.emailVerification.EmailVerificationDto;
import com.oracle.tripRoad.dto.user01.User01Dto;

import com.oracle.tripRoad.domain.point.UserPoint;
import com.oracle.tripRoad.domain.point.UserPointHistory;
import com.oracle.tripRoad.domain.point.UserPointLedger;
import com.oracle.tripRoad.repository.point.UserPointHistoryRepository;
import com.oracle.tripRoad.repository.point.UserPointLedgerRepository;
import com.oracle.tripRoad.repository.point.UserPointRepository;

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
	
	private static final int WELCOME_POINT_BALANCE = 10000;
	private static final int WELCOME_POINT_EXPIRE_YEARS = 1;

	private final User01Dao user01Dao;
	private final EmailVerificationDao emailVerificationDao;
	private final JavaMailSender mailSender;
	
	private final UserPointRepository userPointRepository;
	private final UserPointLedgerRepository userPointLedgerRepository;
	private final UserPointHistoryRepository userPointHistoryRepository;

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

	    Long newUserId = user01Dto.getUserId();

	    UserPoint userPoint = UserPoint.builder()
	            .userId(newUserId)
	            .pointBalance(WELCOME_POINT_BALANCE)
	            .build();

	    userPointRepository.save(userPoint);

	    UserPointLedger ledger = UserPointLedger.builder()
	            .userId(newUserId)
	            .pointAmount(WELCOME_POINT_BALANCE)
	            .remainingAmount(WELCOME_POINT_BALANCE)
	            .sourceType(UserPointLedger.SOURCE_SIGNUP_BONUS)
	            .sourceId(null)
	            .expiresAt(
	                    LocalDateTime.now()
	                            .plusYears(WELCOME_POINT_EXPIRE_YEARS)
	            )
	            .build();

	    UserPointLedger savedLedger =
	            userPointLedgerRepository.save(ledger);

	    UserPointHistory history = UserPointHistory.builder()
	            .userId(newUserId)
	            .bookingId(null)
	            .ledgerId(savedLedger.getLedgerId())
	            .pointAmount(WELCOME_POINT_BALANCE)
	            .pointBalanceAfter(WELCOME_POINT_BALANCE)
	            .historyType(UserPointHistory.TYPE_EARN)
	            .relatedType(UserPointHistory.RELATED_SIGNUP)
	            .relatedId(newUserId)
	            .description("회원가입 적립금")
	            .build();

	    userPointHistoryRepository.save(history);

	    log.info(
	            "회원가입 적립금 생성 완료 - userId={}, balance={}, ledgerId={}",
	            newUserId,
	            WELCOME_POINT_BALANCE,
	            savedLedger.getLedgerId()
	    );

	    return newUserId;
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
	
	@Override
	public Map<String, Object> changePassword(
			Long userId,
			String currentPassword,
			String newPassword
	) {
		if (currentPassword == null || currentPassword.isBlank()) {
			return Map.of(
					"result", 0,
					"MESSAGE", "현재 비밀번호를 입력해주세요."
			);
		}

		if (newPassword == null || newPassword.isBlank()) {
			return Map.of(
					"result", 0,
					"MESSAGE", "새 비밀번호를 입력해주세요."
			);
		}

		if (currentPassword.equals(newPassword)) {
			return Map.of(
					"result", 0,
					"MESSAGE", "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요."
			);
		}

		User01Dto user = user01Dao.selectUser(userId);

		if (user == null || user.getUserStatus() == null ||
				user.getUserStatus() != 100) {
			return Map.of(
					"result", 0,
					"MESSAGE", "회원 정보를 확인할 수 없습니다."
			);
		}

		User01Dto verifiedUser = user01Dao.login(
				User01Dto.builder()
						.loginId(user.getLoginId())
						.password(currentPassword)
						.build()
		);

		if (verifiedUser == null) {
			return Map.of(
					"result", 0,
					"MESSAGE", "현재 비밀번호가 일치하지 않습니다."
			);
		}

		User01Dto passwordDto = User01Dto.builder()
				.userId(userId)
				.password(newPassword)
				.build();

		user01Dao.updatePassword(passwordDto);

		return Map.of(
				"result", 1,
				"MESSAGE", "비밀번호가 변경되었습니다."
		);
	}
	
}
