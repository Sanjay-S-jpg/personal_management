package com.sanjay.personalmanagement.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {


    private final SecretKey secretKey = Keys.hmacShaKeyFor(
            System.getenv("JWT_SECRET").getBytes()
    );

    private final long expirationTime = 1000 * 60 * 60 * 24; // 24 hours

    public String generateToken(String email) {

        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }
}