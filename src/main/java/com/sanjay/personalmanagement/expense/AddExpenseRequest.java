package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;

public record AddExpenseRequest(
        String name,
        BigDecimal amount,
        String category,
        String subcategory
) {
}