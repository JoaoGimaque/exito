package com.shounoop.exitospring.dto;

import com.shounoop.exitospring.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;
    private UserRole userRole;
    private Long userId;
}
