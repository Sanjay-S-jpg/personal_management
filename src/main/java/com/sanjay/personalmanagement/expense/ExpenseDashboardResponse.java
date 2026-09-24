package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;

public record ExpenseDashboardResponse(
        BigDecimal totalSpent,
        long totalExpenses
) {
}