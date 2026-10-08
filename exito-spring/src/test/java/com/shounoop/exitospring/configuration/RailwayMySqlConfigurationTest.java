package com.shounoop.exitospring.configuration;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RailwayMySqlConfigurationTest {
    @Test
    void convertsRailwayMysqlUrlToJdbcAndReadsEncodedCredentials() {
        Map<String, Object> properties = RailwayMySqlConfiguration.fromEnvironment(Map.of(
                "MYSQL_URL", "mysql://railway-user:p%40ss%3Aword@mysql.railway.internal:3307/railway"
        ));

        assertEquals(
                "jdbc:mysql://mysql.railway.internal:3307/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                properties.get("SPRING_DATASOURCE_URL")
        );
        assertEquals("railway-user", properties.get("SPRING_DATASOURCE_USERNAME"));
        assertEquals("p@ss:word", properties.get("SPRING_DATASOURCE_PASSWORD"));
    }

    @Test
    void explicitDatasourceUrlTakesPrecedenceOverRailwayUrl() {
        Map<String, Object> properties = RailwayMySqlConfiguration.fromEnvironment(Map.of(
                "MYSQL_URL", "mysql://user:password@mysql.railway.internal:3306/railway",
                "SPRING_DATASOURCE_URL", "jdbc:mysql://custom-host:3306/custom-db"
        ));

        assertTrue(properties.isEmpty());
    }
}