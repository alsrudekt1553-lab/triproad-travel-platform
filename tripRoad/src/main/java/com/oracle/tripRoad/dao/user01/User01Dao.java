package com.oracle.tripRoad.dao.user01;

import java.util.List;

import com.oracle.tripRoad.dto.PageRequestDTO;
import com.oracle.tripRoad.dto.user01.User01Dto;

public interface User01Dao {

	void insertUser(User01Dto user01Dto);
	int countByLoginId(String loginId);
	User01Dto login(User01Dto user01Dto);
	User01Dto selectUser(Long userId);
	int totalUser();
	List<User01Dto> listUser(PageRequestDTO pageRequestDTO);
	void updateUser(User01Dto user01Dto);
	void deleteUser(Long userId);
	User01Dto findLoginIdByNameAndEmail(User01Dto user01Dto);
	User01Dto verifyUserByLoginIdAndEmail(User01Dto user01Dto);
	void updatePassword(User01Dto user01Dto);
}