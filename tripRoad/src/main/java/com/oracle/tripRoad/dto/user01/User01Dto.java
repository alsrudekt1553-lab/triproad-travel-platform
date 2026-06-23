package com.oracle.tripRoad.dto.user01;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User01Dto {

	private Long   userId;
	private String loginId;
	private String password;
	private String nickname;
	private String name;
	private String email;
	private String phone;
	private String profileImage;
	private List<MultipartFile> files;
	private Date   createdAt;
	private Long   role;
	private Long   userStatus;
}
