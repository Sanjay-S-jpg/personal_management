package com.sanjay.personalmanagement.auth;

public record RegisterResponse(
        Long id,
        String name,
        String email
) {
}