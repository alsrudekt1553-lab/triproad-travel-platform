package com.oracle.tripRoad.service.user01;

import java.util.Map;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.dto.user01.User01Dto;

public interface User01Service {

	Long register(User01Dto user01Dto);
	boolean checkLoginId(String loginId);
	User01Dto login(String loginId, String password);
	int userTotal();
	PageResponseDTO<User01Dto> list(PageRequestDTO pageRequestDTO);
	User01Dto get(Long userId);
	void modify(User01Dto user01Dto);
	void remove(Long userId);
	String findLoginId(User01Dto user01Dto);
	Map<String, Object> sendPasswordResetCode(User01Dto user01Dto);
	Map<String, Object> verifyPasswordResetCode(Long userId, String emailToken);
	Map<String, Object> changePasswordAfterVerification(User01Dto user01Dto);
	Map<String, Object> changePassword(
			Long userId,
			String currentPassword,
			String newPassword
	);
}
