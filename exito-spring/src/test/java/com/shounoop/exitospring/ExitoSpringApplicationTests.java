package com.shounoop.exitospring;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:exito-test;MODE=MySQL;DB_CLOSE_DELAY=-1;NON_KEYWORDS=YEAR",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
		"spring.jpa.hibernate.ddl-auto=create-drop"
})
class ExitoSpringApplicationTests {

	@Test
	void contextLoads() {
	}

}
