package com.sanjay.personalmanagement.expense;

import com.sanjay.personalmanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user, org.springframework.data.domain.Sort sort);

    Optional<Expense> findByIdAndUser(Long id, User user);
    List<Expense> findByUserAndDateTimeBetweenOrderByDateTimeDesc(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

}