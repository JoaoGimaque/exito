package com.shounoop.exitospring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.shounoop.exitospring.configuration.RailwayMySqlConfiguration;

@SpringBootApplication
public class ExitoSpringApplication {

	public static void main(String[] args) {
		SpringApplication application = new SpringApplication(ExitoSpringApplication.class);
		application.setDefaultProperties(RailwayMySqlConfiguration.fromEnvironment(System.getenv()));
		application.run(args);
	}

}
