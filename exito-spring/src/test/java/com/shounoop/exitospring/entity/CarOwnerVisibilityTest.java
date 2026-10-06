package com.shounoop.exitospring.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CarOwnerVisibilityTest {
    @Test
    void ownerIsAvailableOnlyInAdminCarDto() throws JsonProcessingException {
        Car car = new Car();
        car.setOwnerName("João");

        String publicJson = new ObjectMapper().writeValueAsString(car.getCarDto());
        String adminJson = new ObjectMapper().writeValueAsString(car.getAdminCarDto());

        assertFalse(publicJson.contains("ownerName"));
        assertFalse(publicJson.contains("João"));
        assertTrue(adminJson.contains("João"));
        assertEquals("João", car.getAdminCarDto().getOwnerName());
    }
}