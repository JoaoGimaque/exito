package com.shounoop.exitospring.services.auth;

import com.shounoop.exitospring.dto.SignupRequest;
import com.shounoop.exitospring.dto.UserDto;

public interface AuthService {
    UserDto createCustomer(SignupRequest signupRequest);

    boolean hasCustomerWithEmail(String email);
}
