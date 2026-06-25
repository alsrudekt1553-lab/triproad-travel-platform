package com.oracle.tripRoad.controller;

import java.util.Map;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.tripRoad.dto.user01.ChangePasswordRequest;
import com.oracle.tripRoad.dto.user01.User01Dto;
import com.oracle.tripRoad.service.user01.User01Service;
import com.oracle.tripRoad.util.CustomFileUtil;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.PageResponseDTO;
import com.oracle.tripRoad.service.Paging;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/user")
public class User01Controller {


	private final User01Service user01Service;
	private final CustomFileUtil fileUtil;


	// 회원가입
	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> register(User01Dto user01Dto) {
		log.info("register1 userDto->" + user01Dto);
		try {
			List<MultipartFile> files = user01Dto.getFiles();
			List<String> uploadFileNames = fileUtil.saveUserProfileImages(files);

			if (uploadFileNames != null && uploadFileNames.size() > 0) {
				user01Dto.setProfileImage(uploadFileNames.get(0));
			}

			System.out.println("User01Controller register user01Dto->"+user01Dto);

			Long userId = user01Service.register(user01Dto);

			return ResponseEntity.ok(Map.of("USER_ID", userId, "result", 1));
		} catch (Exception e) {
			log.error("회원가입 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("result", 0, "MESSAGE", "회원가입 중 오류가 발생했습니다: " + e.getMessage()));
		}
	}

	// 로그인 ID 찾기 (이름 + 이메일)
	@PostMapping("/find-login-id")
	public ResponseEntity<Map<String, Object>> findLoginId(@RequestBody User01Dto user01Dto) {
		log.info("findLoginId name->" + user01Dto.getName() + ", email->" + user01Dto.getEmail());
		try {
			String resultEmail = user01Service.findLoginId(user01Dto);
			if (resultEmail == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("result", 0, "MESSAGE", "일치하는 회원 정보가 없습니다."));
			}
			if ("EMAIL_FAIL".equals(resultEmail)) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of("result", 0, "MESSAGE", "이메일 발송 중 오류가 발생했습니다."));
			}
			return ResponseEntity.ok(Map.of("result", 1, "MESSAGE", "로그인 ID를 이메일로 발송했습니다.", "email", resultEmail));
		} catch (Exception e) {
			log.error("로그인 ID 찾기 중 오류", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("result", 0, "MESSAGE", "오류가 발생했습니다."));
		}
	}
	
	@PostMapping("/password-reset/send-code")
	public ResponseEntity<Map<String, Object>> sendPasswordResetCode(@RequestBody User01Dto user01Dto) {
		log.info("sendPasswordResetCode loginId->" + user01Dto.getLoginId());

		Map<String, Object> result = user01Service.sendPasswordResetCode(user01Dto);

		if (Integer.valueOf(1).equals(result.get("result"))) {
			return ResponseEntity.ok(result);
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
	}
	
	@PostMapping("/password-reset/verify-code")
	public ResponseEntity<Map<String, Object>> verifyPasswordResetCode(@RequestBody Map<String, Object> request) {
		Long userId = Long.valueOf(String.valueOf(request.get("userId")));
		String emailToken = String.valueOf(request.get("emailToken"));

		Map<String, Object> result = user01Service.verifyPasswordResetCode(userId, emailToken);

		if (Integer.valueOf(1).equals(result.get("result"))) {
			return ResponseEntity.ok(result);
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
	}
	
	@PutMapping("/password-reset/change")
	public ResponseEntity<Map<String, Object>> changePasswordAfterVerification(@RequestBody User01Dto user01Dto) {
		Map<String, Object> result = user01Service.changePasswordAfterVerification(user01Dto);

		if (Integer.valueOf(1).equals(result.get("result"))) {
			return ResponseEntity.ok(result);
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
	}

	// 로그인 ID 중복 체크
	@GetMapping("/check-login-id/{loginId}")
	public Map<String, Boolean> checkLoginId(@PathVariable(name = "loginId") String loginId) {
		log.info("checkLoginId loginId->" + loginId);

		boolean duplicated = user01Service.checkLoginId(loginId);

		return Map.of("DUPLICATED", duplicated);
	}

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(
			@RequestBody User01Dto user01Dto,
			HttpSession session
	) {
		log.info("login loginId->" + user01Dto.getLoginId());
		System.out.println("user01Dto->"+user01Dto);

		String inputId = user01Dto.getLoginId();

		// 1. loginId 존재 여부 먼저 확인
		boolean loginIdExists = user01Service.checkLoginId(inputId);

		if (!loginIdExists) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("result", 0, "MESSAGE", "존재하지 않는 아이디입니다."));
		}

		// 2. loginId 존재하면 비밀번호 확인
		User01Dto loginUser = user01Service.login(inputId, user01Dto.getPassword());

		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("result", 0, "MESSAGE", "비밀번호가 일치하지 않습니다.", "loginId", user01Dto.getLoginId()));
		}

		session.setAttribute("LOGIN_USER", loginUser);
		
		System.out.println("loginUser->"+loginUser);

		return ResponseEntity.ok(Map.of(
				"result", 1,    // 1이면 성공 , 0이면 성공
				"USER_ID", loginUser.getUserId(),
				"loginId", loginUser.getLoginId(),
				"NICKNAME", loginUser.getNickname(),
				"NAME", loginUser.getName(),
				"role", loginUser.getRole()
		));
	}

	// 현재 로그인 회원 정보
	@GetMapping("/me")
	public ResponseEntity<Map<String, Object>> me(HttpSession session) {
		User01Dto loginUser = (User01Dto) session.getAttribute("LOGIN_USER");

		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("RESULT", "FAIL", "MESSAGE", "로그인이 필요합니다."));
		}

		return ResponseEntity.ok(Map.of(
				"RESULT", "SUCCESS",
				"USER_ID", loginUser.getUserId(),
				"LOGIN_ID", loginUser.getLoginId(),
				"NICKNAME", loginUser.getNickname(),
				"NAME", loginUser.getName(),
				"EMAIL", loginUser.getEmail(),
				"PHONE", loginUser.getPhone(),
				"PROFILE_IMAGE", loginUser.getProfileImage(),
				"ROLE", loginUser.getRole()
		));
	}

	// 로그아웃
	@PostMapping("/logout")
	public Map<String, String> logout(HttpSession session) {
		session.invalidate();

		return Map.of("RESULT", "SUCCESS");
	}
	
	// 회원 목록 조회
	@GetMapping("/list")
	public PageResponseDTO<User01Dto> list(PageRequestDTO pageRequestDTO) {
		log.info("User01Controller list pageRequestDTO->" + pageRequestDTO);

		int totalCount = user01Service.userTotal();

		Paging page = new Paging(totalCount, pageRequestDTO.getPage());
		pageRequestDTO.setStart(page.getStart());
		pageRequestDTO.setEnd(page.getEnd());

		PageResponseDTO<User01Dto> userList = user01Service.list(pageRequestDTO);

		log.info("User01Controller list userList->" + userList);

		return userList;
	}
	
	// 회원 상세 조회
	@GetMapping("/{userId}")
	public User01Dto get(@PathVariable(name = "userId") Long userId) {
		log.info("get userId->" + userId);

		return user01Service.get(userId);
	}
	// 조회
	@GetMapping("/view/{fileName}")
	public ResponseEntity<Resource> viewFile(@PathVariable(name = "fileName") String fileName) {
		return fileUtil.getUserProfileImage(fileName);
	}
	
	@PutMapping("/password-change")
	public ResponseEntity<Map<String, Object>> changePassword(
			@RequestBody ChangePasswordRequest request,
			HttpSession session
	) {
		User01Dto loginUser =
				(User01Dto) session.getAttribute("LOGIN_USER");

		if (loginUser == null) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of(
							"result", 0,
							"MESSAGE", "로그인이 필요합니다."
					));
		}

		Map<String, Object> result =
				user01Service.changePassword(
						loginUser.getUserId(),
						request.getCurrentPassword(),
						request.getNewPassword()
				);

		if (Integer.valueOf(1).equals(result.get("result"))) {
			return ResponseEntity.ok(result);
		}

		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(result);
	}
	
	// 회원 정보 수정 (multipart/form-data)
	@PutMapping(value = "/modify/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> modify(
			@PathVariable(name = "userId") Long userId,
			User01Dto user01Dto
	) {
		user01Dto.setUserId(userId);

		log.info("modify userDto->" + user01Dto);

		// 파일 업로드 처리
		List<MultipartFile> files = user01Dto.getFiles();
		if (files != null && !files.isEmpty() && !files.get(0).isEmpty()) {
			List<String> uploadFileNames = fileUtil.saveUserProfileImages(files);
			if (uploadFileNames != null && uploadFileNames.size() > 0) {
				user01Dto.setProfileImage(uploadFileNames.get(0));
			}
		}

		user01Service.modify(user01Dto);

		return Map.of("RESULT", "SUCCESS");
	}

	// 회원 탈퇴 또는 삭제
	@DeleteMapping("/remove/{userId}")
	public Map<String, String> remove(@PathVariable(name = "userId") Long userId) {
		log.info("remove userId->" + userId);

		user01Service.remove(userId);

		return Map.of("RESULT", "SUCCESS");
	}
}