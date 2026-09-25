package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
            @Valid @RequestBody AddExpenseRequest request,
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

    @GetMapping("/dashboard")
    public ExpenseDashboardResponse getDashboard(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getDashboard(user);
    }

    @GetMapping("/dashboard/monthly")
    public BigDecimal getMonthlyTotal(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getMonthlyTotal(user, year, month);
    }

    @GetMapping("/dashboard/weekly")
    public BigDecimal getWeeklyTotal(
            @RequestParam LocalDate date,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getWeeklyTotal(user, date);
    }

    @GetMapping("/dashboard/categories")
    public List<CategoryExpenseResponse> getCategoryTotals(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getCategoryTotals(user);
    }

    @GetMapping("/dashboard/daily")
    public List<DailyExpenseResponse> getDailyTotals(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getDailyTotals(user);
    }

    @GetMapping("/dashboard/highest")
    public HighestExpenseResponse getHighestExpense(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getHighestExpense(user);
    }

    @GetMapping("/dashboard/category-counts")
    public List<CategoryCountResponse> getCategoryCounts(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getCategoryCounts(user);
    }

    @GetMapping("/dashboard/average")
    public AverageExpenseResponse getAverageExpense(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getAverageExpense(user);
    }

    @GetMapping("/dashboard/monthly/categories")
    public List<CategoryExpenseResponse> getMonthlyCategoryTotals(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.getMonthlyCategoryTotals(
                user,
                year,
                month
        );
    }


    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExpenseRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return expenseService.updateExpense(id, request, user);
    }


    @DeleteMapping("/{id}")
    public String deleteExpense(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        expenseService.deleteExpense(id, user);

        return "Expense deleted successfully";
    }
}