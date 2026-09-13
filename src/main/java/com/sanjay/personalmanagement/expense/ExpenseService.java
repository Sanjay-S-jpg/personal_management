package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
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

    public List<ExpenseResponse> getMyExpenses(User user, Sort.Direction direction) {
        return expenseRepository.findByUser(
                        user,
                        Sort.by(direction, "dateTime")
                )
                .stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getSubcategory(),
                        expense.getDateTime()
                ))
                .toList();
    }

    public ExpenseResponse getExpense(Long id, User user) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        return new ExpenseResponse(
                expense.getId(),
                expense.getName(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getSubcategory(),
                expense.getDateTime()
        );
    }

    public List<ExpenseResponse> getMonthlyExpenses(User user, int year, int month) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        return expenseRepository
                .findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay()
                )
                .stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getSubcategory(),
                        expense.getDateTime()
                ))
                .toList();
    }

    public List<ExpenseResponse> getWeeklyExpenses(
            User user,
            LocalDate date
    ) {
        LocalDate startDate = date.with(DayOfWeek.MONDAY);
        LocalDate endDate = startDate.plusDays(7);

        return expenseRepository
                .findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay()
                )
                .stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getSubcategory(),
                        expense.getDateTime()
                ))
                .toList();
    }

    public List<ExpenseResponse> getExpensesByDate(
            User user,
            LocalDate date
    ) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return expenseRepository
                .findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        start,
                        end
                )
                .stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getSubcategory(),
                        expense.getDateTime()
                ))
                .toList();
    }
}