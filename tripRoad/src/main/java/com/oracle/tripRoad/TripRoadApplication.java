package com.oracle.tripRoad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TripRoadApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripRoadApplication.class, args);
	}

}