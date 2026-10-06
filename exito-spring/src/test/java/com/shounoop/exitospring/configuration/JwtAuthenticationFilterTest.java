package com.shounoop.exitospring.configuration;

import com.shounoop.exitospring.services.jwt.UserService;
import com.shounoop.exitospring.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtAuthenticationFilterTest {
    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void expiredTokenContinuesAsAnonymousRequest() throws ServletException, IOException {
        JwtUtil jwtUtil = mock(JwtUtil.class);
        UserService userService = mock(UserService.class);
        when(jwtUtil.extractUserName("expired-token"))
                .thenThrow(new ExpiredJwtException(null, null, "JWT expired"));

        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtUtil, userService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer expired-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        assertDoesNotThrow(() -> filter.doFilter(request, response, chain));
        assertNotNull(chain.getRequest());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertNull(response.getErrorMessage());
    }
}