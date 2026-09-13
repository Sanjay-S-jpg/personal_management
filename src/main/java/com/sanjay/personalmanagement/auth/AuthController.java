package com.sanjay.personalmanagement.auth;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {

        return authService.register(
                request.name(),
                request.email(),
                request.password()
        );
    }

    public record RegisterRequest(
            String name,
            String email,
            String password
    ) {
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(
                request.email(),
                request.password()
        );
    }
}