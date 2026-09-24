package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;

public record CategoryExpenseResponse(
        String category,
        BigDecimal total
) {
}