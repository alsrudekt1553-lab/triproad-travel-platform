package com.oracle.tripRoad.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.oracle.tripRoad.dto.admin01.Admin01BookingDto;
import com.oracle.tripRoad.dto.admin01.Admin01ProductDto;
import com.oracle.tripRoad.dto.productSchedule.ProductScheduleDto;
import com.oracle.tripRoad.dto.statusType.StatusTypeDto;
import com.oracle.tripRoad.dto.theme.ThemeDto;
import com.oracle.tripRoad.dto.user01.User01Dto;
import com.oracle.tripRoad.service.admin01.Admin01Service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/admin")
public class Admin01Controller {
	
	private final Admin01Service adminService;
	private static final Long ADMIN_ROLE = 900L;

	private User01Dto getAdminUser(HttpSession session) {
	    User01Dto loginUser = (User01Dto) session.getAttribute("LOGIN_USER");

	    if (loginUser == null) {
	        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
	    }

	    if (!ADMIN_ROLE.equals(loginUser.getRole())) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 권한이 필요합니다.");
	    }

	    return loginUser;
	}
	
	@GetMapping("/bookingList")
	public List<Admin01BookingDto> bookingList(HttpSession session) {
		getAdminUser(session);
	    return adminService.bookingList();
	}

	@PostMapping(value = "/addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> addProduct(
	        @ModelAttribute Admin01ProductDto adminProduct01Dto,
	        @RequestParam(name = "imageFile", required = false) MultipartFile imageFile,
	        HttpSession session
	) {
		getAdminUser(session);
	    adminService.addProduct(adminProduct01Dto, imageFile);
	    return Map.of("RESULT", "SUCCESS");
	}
	
	@PostMapping("/addSchedule")
	public Map<String, String> addSchedule(
			@ModelAttribute ProductScheduleDto productScheduleDto,
			HttpSession session
	) {
		getAdminUser(session);
	    adminService.addSchedule(productScheduleDto);
	    return Map.of("RESULT", "SUCCESS");
	}
	
	@PostMapping(value = "/modifyProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> modifyProduct(
	        @ModelAttribute Admin01ProductDto adminProduct01Dto,
	        @RequestParam(name = "imageFile", required = false) MultipartFile imageFile,
			HttpSession session
	) {
		getAdminUser(session);
	    adminService.modifyProduct(adminProduct01Dto, imageFile);
	    return Map.of("RESULT", "SUCCESS");
	}
	
	@PostMapping("/modifySchedule")
	public Map<String, String> modifySchedule(
			@ModelAttribute ProductScheduleDto productScheduleDto,
			HttpSession session
	) {
		getAdminUser(session);
	    adminService.modifySchedule(productScheduleDto);
	    return Map.of("RESULT", "SUCCESS");
	}
	
	@GetMapping("/productList")
	public List<Admin01ProductDto> productList(HttpSession session) {
		getAdminUser(session);
	    return adminService.productList();
	}

	@GetMapping("/product/{productId}")
	public Admin01ProductDto productDetail(
	        @PathVariable("productId") Long productId,
	        HttpSession session
	) {
	    getAdminUser(session);
	    return adminService.productDetail(productId);
	}
	
	@GetMapping("/scheduleList/{productId}")
	public List<ProductScheduleDto> scheduleList(
			@PathVariable("productId") Long productId,
			HttpSession session
	) {
		getAdminUser(session);
	    return adminService.scheduleList(productId);
	}
	
	@GetMapping("/regionList")
	public List<StatusTypeDto> regionList(HttpSession session) {
		getAdminUser(session);
	    return adminService.regionList();
	}

	@GetMapping("/themeList")
	public List<ThemeDto> themeList(HttpSession session) {
		getAdminUser(session);
	    return adminService.themeList();
	}
	
}
