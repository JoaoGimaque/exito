package com.shounoop.exitospring.configuration;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public final class RailwayMySqlConfiguration {
    private static final String JDBC_OPTIONS = "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    private RailwayMySqlConfiguration() {}

    public static Map<String, Object> fromEnvironment(Map<String, String> environment) {
        String mysqlUrl = environment.get("MYSQL_URL");
        if (mysqlUrl == null || mysqlUrl.isBlank()
                || environment.containsKey("SPRING_DATASOURCE_URL")) {
            return Map.of();
        }

        URI uri = URI.create(mysqlUrl);
        if (!"mysql".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null) {
            throw new IllegalArgumentException("MYSQL_URL must be a valid mysql:// URL");
        }

        String host = uri.getHost();
        if (host.contains(":")) {
            host = "[" + host + "]";
        }
        int port = uri.getPort() > 0 ? uri.getPort() : 3306;
        String database = uri.getRawPath() == null ? "" : uri.getRawPath().replaceFirst("^/", "");
        if (database.isBlank()) {
            throw new IllegalArgumentException("MYSQL_URL must include a database name");
        }

        String query = uri.getRawQuery();
        String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/"
                + URLDecoder.decode(database, StandardCharsets.UTF_8) + "?" + JDBC_OPTIONS
                + (query == null || query.isBlank() ? "" : "&" + query);

        Map<String, Object> properties = new HashMap<>();
        properties.put("SPRING_DATASOURCE_URL", jdbcUrl);

        String rawUserInfo = uri.getRawUserInfo();
        if (rawUserInfo != null) {
            int separator = rawUserInfo.indexOf(':');
            if (separator >= 0) {
                if (!environment.containsKey("SPRING_DATASOURCE_USERNAME")
                        && !environment.containsKey("MYSQLUSER")) {
                    properties.put("SPRING_DATASOURCE_USERNAME",
                            URLDecoder.decode(rawUserInfo.substring(0, separator), StandardCharsets.UTF_8));
                }
                if (!environment.containsKey("SPRING_DATASOURCE_PASSWORD")
                        && !environment.containsKey("MYSQLPASSWORD")
                        && !environment.containsKey("MYSQL_ROOT_PASSWORD")) {
                    properties.put("SPRING_DATASOURCE_PASSWORD",
                            URLDecoder.decode(rawUserInfo.substring(separator + 1), StandardCharsets.UTF_8));
                }
            }
        }

        return properties;
    }
}