package com.oracle.tripRoad.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RootConfig {
	//.setFieldMatchingEnabled(true)
	//필드명 기준으로 매핑을 활성화. 기본적으로는 getter/setter 기준인데, 필드(멤버 변수)끼리 매핑하도록 설정한 것.
	//.setFieldAccessLevel(...)
	//필드 접근 레벨을 PRIVATE까지 허용해서, private 필드도 매핑 대상으로 포함할 수 있도록 함.
	//.setMatchingStrategy(MatchingStrategies.LOOSE)
	//느슨한 매칭 전략을 사용해 이름이 완전히 일치하지 않아도 비슷한 이름이라면 매핑 허용.
	//(예: userId와 id 같은 경우도 매핑 가능하게 함)
	@Bean
	public ModelMapper getMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration()
		           .setFieldMatchingEnabled(true)
		           .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
		           .setMatchingStrategy(MatchingStrategies.LOOSE);
		
		return modelMapper;
	}

}
