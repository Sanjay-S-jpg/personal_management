package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public Expense addExpense(
            @RequestBody AddExpenseRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.addExpense(
                request.name(),
                request.amount(),
                request.category(),
                request.subcategory(),
                user
        );
    }
}