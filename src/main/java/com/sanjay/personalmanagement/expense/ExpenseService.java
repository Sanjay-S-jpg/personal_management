package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

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

    public ExpenseDashboardResponse getDashboard(User user) {

        List<Expense> expenses =
                expenseRepository.findByUser(
                        user,
                        Sort.by(Sort.Direction.DESC, "dateTime")
                );

        BigDecimal totalSpent = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalExpenses = expenses.size();

        return new ExpenseDashboardResponse(
                totalSpent,
                totalExpenses
        );
    }

    public BigDecimal getMonthlyTotal(User user, int year, int month) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        return expenseRepository
                .findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay()
                )
                .stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getWeeklyTotal(User user, LocalDate date) {

        LocalDate startDate = date.with(DayOfWeek.MONDAY);
        LocalDate endDate = startDate.plusDays(7);

        return expenseRepository
                .findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay()
                )
                .stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    public List<CategoryExpenseResponse> getCategoryTotals(User user) {

        List<Expense> expenses = expenseRepository.findByUser(
                user,
                Sort.by(Sort.Direction.DESC, "dateTime")
        );

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Expense::getAmount,
                                BigDecimal::add
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> new CategoryExpenseResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    public List<DailyExpenseResponse> getDailyTotals(User user) {

        List<Expense> expenses = expenseRepository.findByUser(
                user,
                Sort.by(Sort.Direction.ASC, "dateTime")
        );

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getDateTime().toLocalDate(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Expense::getAmount,
                                BigDecimal::add
                        )
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new DailyExpenseResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    public HighestExpenseResponse getHighestExpense(User user) {

        return expenseRepository.findByUser(
                        user,
                        Sort.by(Sort.Direction.DESC, "amount")
                )
                .stream()
                .findFirst()
                .map(expense -> new HighestExpenseResponse(
                        expense.getId(),
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getDateTime()
                ))
                .orElse(null);
    }

    public List<CategoryCountResponse> getCategoryCounts(User user) {

        List<Expense> expenses = expenseRepository.findByUser(
                user,
                Sort.by(Sort.Direction.DESC, "dateTime")
        );

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> new CategoryCountResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    public AverageExpenseResponse getAverageExpense(User user) {

        List<Expense> expenses = expenseRepository.findByUser(
                user,
                Sort.by(Sort.Direction.DESC, "dateTime")
        );

        if (expenses.isEmpty()) {
            return new AverageExpenseResponse(BigDecimal.ZERO);
        }

        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal average = total.divide(
                BigDecimal.valueOf(expenses.size()),
                2,
                RoundingMode.HALF_UP
        );

        return new AverageExpenseResponse(average);
    }

    public List<CategoryExpenseResponse> getMonthlyCategoryTotals(
            User user,
            int year,
            int month
    ) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        List<Expense> expenses =
                expenseRepository.findByUserAndDateTimeBetweenOrderByDateTimeDesc(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay()
                );

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Expense::getAmount,
                                BigDecimal::add
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> new CategoryExpenseResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    public ExpenseResponse updateExpense(
            Long id,
            UpdateExpenseRequest request,
            User user
    ) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setName(request.name());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setSubcategory(request.subcategory());

        Expense updatedExpense = expenseRepository.save(expense);

        return new ExpenseResponse(
                updatedExpense.getId(),
                updatedExpense.getName(),
                updatedExpense.getAmount(),
                updatedExpense.getCategory(),
                updatedExpense.getSubcategory(),
                updatedExpense.getDateTime()
        );
    }

    public void deleteExpense(Long id, User user) {

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);
    }

}