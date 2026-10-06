package com.shounoop.exitospring.dto;

import com.shounoop.exitospring.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private UserRole userRole;
}
