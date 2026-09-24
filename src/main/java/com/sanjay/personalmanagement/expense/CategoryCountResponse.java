package com.sanjay.personalmanagement.expense;

public record CategoryCountResponse(
        String category,
        long count
) {
}