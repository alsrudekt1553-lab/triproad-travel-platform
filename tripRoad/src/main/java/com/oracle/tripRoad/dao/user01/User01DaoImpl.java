package com.oracle.tripRoad.dao.user01;

import java.util.List;

import com.oracle.tripRoad.dto.PageRequestDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.oracle.tripRoad.dto.user01.User01Dto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class User01DaoImpl implements User01Dao {

	private final SqlSession session;

	@Override
	public void insertUser(User01Dto user01Dto) {
		// session.insert("com.oracle.tripRoad.User01Mapper.insertUser", user01Dto);
		
		int result = 0;
		System.out.println("User01DaoImpl insert user01Dto->"+user01Dto );
		try {
			result = session.insert("com.oracle.tripRoad.User01Mapper.insertUser",user01Dto);
			System.out.println("User01DaoImpl result->"+result);
		} catch (Exception e) {
		    throw new RuntimeException("회원가입 실패", e);
		}
		return;

	}

	@Override
	public int countByLoginId(String loginId) {
		return session.selectOne("com.oracle.tripRoad.User01Mapper.countByLoginId", loginId);
	}

	@Override
	public User01Dto login(User01Dto user01Dto) {
		
		// return session.selectOne("com.oracle.tripRoad.User01Mapper.login", user01Dto);
		
		System.out.println("User01DaoImpl  user01Dto->" +user01Dto);
		User01Dto user01DtoRtn = null;
		// Nameing Rule
		try {
			user01DtoRtn = session.selectOne("com.oracle.tripRoad.User01Mapper.login", user01Dto);
			System.out.println("User01DaoImpl login user01DtoRtn->"+user01DtoRtn);
			
		} catch (Exception e) {
		    System.out.println("User01DaoImpl login e.getMessage()->"+e.getMessage());
		}
		
		return user01DtoRtn;
	}
	
	@Override
	public int totalUser() {
		return session.selectOne("com.oracle.tripRoad.User01Mapper.userTotal");
	}

	@Override
	public List<User01Dto> listUser(PageRequestDTO pageRequestDTO) {
		return session.selectList("com.oracle.tripRoad.User01Mapper.userListAll", pageRequestDTO);
	}
	
	

	@Override
	public User01Dto selectUser(Long userId) {
		return session.selectOne("com.oracle.tripRoad.User01Mapper.selectUser", userId);
	}

	@Override
	public void updateUser(User01Dto user01Dto) {
		session.update("com.oracle.tripRoad.User01Mapper.updateUser", user01Dto);
	}

	@Override
	public void deleteUser(Long userId) {
		session.update("com.oracle.tripRoad.User01Mapper.deleteUser", userId);
	}

	@Override
	public User01Dto findLoginIdByNameAndEmail(User01Dto user01Dto) {
		return session.selectOne("com.oracle.tripRoad.User01Mapper.findLoginIdByNameAndEmail", user01Dto);
	}

	@Override
	public User01Dto verifyUserByLoginIdAndEmail(User01Dto user01Dto) {
		return session.selectOne("com.oracle.tripRoad.User01Mapper.verifyUserByLoginIdAndEmail", user01Dto);
	}

	@Override
	public void updatePassword(User01Dto user01Dto) {
		session.update("com.oracle.tripRoad.User01Mapper.updatePassword", user01Dto);
	}
}