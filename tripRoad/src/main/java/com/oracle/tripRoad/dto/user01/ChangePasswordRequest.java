package com.oracle.tripRoad.dto.user01;

import lombok.Data;

@Data
public class ChangePasswordRequest {

	private String currentPassword;
	private String newPassword;
}