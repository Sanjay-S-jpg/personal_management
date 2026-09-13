package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @GetMapping
    public List<ExpenseResponse> getMyExpenses(
            @RequestParam(defaultValue = "desc") String sort,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Sort.Direction direction =
                sort.equalsIgnoreCase("asc")
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        return expenseService.getMyExpenses(user, direction);
    }

    @GetMapping("/{id}")
    public ExpenseResponse getExpense(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getExpense(id, user);
    }

    @GetMapping("/monthly")
    public List<ExpenseResponse> getMonthlyExpenses(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getMonthlyExpenses(user, year, month);
    }

    @GetMapping("/weekly")
    public List<ExpenseResponse> getWeeklyExpenses(
            @RequestParam LocalDate date,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getWeeklyExpenses(user, date);
    }

    @GetMapping("/date")
    public List<ExpenseResponse> getExpensesByDate(
            @RequestParam LocalDate date,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getExpensesByDate(user, date);
    }
}