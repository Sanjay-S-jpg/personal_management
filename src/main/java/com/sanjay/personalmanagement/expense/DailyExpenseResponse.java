package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyExpenseResponse(
        LocalDate date,
        BigDecimal total
) {
}