package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpense(
            String name,
            java.math.BigDecimal amount,
            String category,
            String subcategory,
            User user
    ) {
        Expense expense = new Expense();

        expense.setName(name);
        expense.setAmount(amount);
        expense.setCategory(category);
        expense.setSubcategory(subcategory);
        expense.setDateTime(LocalDateTime.now());
        expense.setUser(user);

        return expenseRepository.save(expense);
    }
}