package com.sanjay.personalmanagement.auth;

public record LoginRequest(
        String email,
        String password
) {
}