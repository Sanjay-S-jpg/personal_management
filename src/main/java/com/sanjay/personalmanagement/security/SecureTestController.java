package com.sanjay.personalmanagement.security;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureTestController {

    @GetMapping("/api/secure-test")
    public String secureTest(Authentication authentication) {

        return "Hello " + authentication.getName() +
                "! You are authenticated.";
    }
}