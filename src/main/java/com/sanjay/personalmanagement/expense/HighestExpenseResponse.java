package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record HighestExpenseResponse(
        Long id,
        String name,
        BigDecimal amount,
        String category,
        LocalDateTime dateTime
) {
}