package com.oracle.tripRoad.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class KakaoPayConfig {

    @Value("${kakaopay.secret-key}")
    private String secretKey;

    public static final String READY_URL = "https://open-api.kakaopay.com/online/v1/payment/ready";

    public static final String APPROVE_URL = "https://open-api.kakaopay.com/online/v1/payment/approve";

    public static final String CANCEL_URL = "https://open-api.kakaopay.com/online/v1/payment/cancel";

    public static final String CID = "TC0ONETIME";

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getSecretKey() {
        return secretKey;
    }
}