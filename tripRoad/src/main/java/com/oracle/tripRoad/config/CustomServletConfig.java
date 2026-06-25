package com.oracle.tripRoad.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.oracle.tripRoad.controller.formatter.LocalDateFormatter;



@Configuration
public class CustomServletConfig implements WebMvcConfigurer{
	
	@Override
	public void addFormatters(FormatterRegistry registry) {
		// TODO Auto-generated method stub
		registry.addFormatter(new LocalDateFormatter());
	}
	
	
	// Cors 오류 --> 정의
	// addMapping("/**") : 모든 URL 패턴에 대해 CORS 정책을 적용
	// allowedOrigins("*") : 모든 도메인에서 오는 요청을 허용 (실제 서비스에서는 보안 위해 특정 도메인만 지정
	// allowedMethods(...) : 허용하는 HTTP 메서드들 지정
	// maxAge(300) : 사전 요청(preflight OPTIONS)이 성공한 후 브라우저가 이 설정을 300초 동안 재사용(캐시)
	// allowedHeaders(...) : 요청 시 허용할 헤더 목록 지정 (예: 인증 토큰이나 콘텐츠 타입 등)
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// TODO Auto-generated method stub
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:5173")
				.allowedMethods(
				        "HEAD",
				        "GET",
				        "POST",
				        "PUT",
				        "DELETE",
				        "PATCH",
				        "OPTIONS"
				)
				.maxAge(300)
				.allowedHeaders("Authorization", "Cache-Control", "Content-Type")
				.allowCredentials(true)
				;

	}

}
