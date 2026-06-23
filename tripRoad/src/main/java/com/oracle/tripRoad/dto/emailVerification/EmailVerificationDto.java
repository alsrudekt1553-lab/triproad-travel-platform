package com.oracle.tripRoad.dto.emailVerification;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailVerificationDto {

	private Long tokenId;
	private Long userId;
	private String emailToken;
	private Long tokenType;
	private Long failCount;
	private Date createdAt;
	private Date expiresAt;
}