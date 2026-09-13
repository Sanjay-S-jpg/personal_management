package com.sanjay.personalmanagement.auth;

public record LoginResponse(
        Long id,
        String name,
        String email,
        String token
) {
}