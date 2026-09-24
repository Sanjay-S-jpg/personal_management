package com.sanjay.personalmanagement.expense;

import java.math.BigDecimal;

public record AverageExpenseResponse(
        BigDecimal average
) {
}