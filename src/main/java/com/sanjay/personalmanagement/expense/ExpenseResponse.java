package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        String name,
        BigDecimal amount,
        String category,
        String subcategory,
        LocalDateTime dateTime
) {
}