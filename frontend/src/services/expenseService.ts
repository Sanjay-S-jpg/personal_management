import {
  CategoryCount,
  CategoryExpense,
  CreateExpensePayload,
  DailyExpense,
  Expense,
  ExpenseDashboardSummary,
  BackendDashboardSummary,
  HighestExpense,
  AverageExpense,
  UpdateExpensePayload,
} from '../types/expense';

import { request } from './apiClient';

export const expenseService = {

  // -------------------------
  // CRUD
  // -------------------------

  async createExpense(
    payload: CreateExpensePayload
  ): Promise<Expense> {
    return request<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAllExpenses(
    sort: 'asc' | 'desc' = 'desc'
  ): Promise<Expense[]> {
    return request<Expense[]>(
      `/api/expenses?sort=${sort}`
    );
  },

  async getExpense(id: number): Promise<Expense> {
    return request<Expense>(
      `/api/expenses/${id}`
    );
  },

  async updateExpense(
    id: number,
    payload: UpdateExpensePayload
  ): Promise<Expense> {
    return request<Expense>(
      `/api/expenses/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  },

  async deleteExpense(id: number): Promise<boolean> {
    await request<string>(
      `/api/expenses/${id}`,
      {
        method: 'DELETE',
      }
    );

    return true;
  },

  // -------------------------
  // Expense filtering
  // -------------------------

  async getMonthlyExpenses(
    year: number,
    month: number
  ): Promise<Expense[]> {
    return request<Expense[]>(
      `/api/expenses/monthly?year=${year}&month=${month}`
    );
  },

  async getWeeklyExpenses(
    date: string
  ): Promise<Expense[]> {
    return request<Expense[]>(
      `/api/expenses/weekly?date=${date}`
    );
  },

  async getExpensesByDate(
    date: string
  ): Promise<Expense[]> {
    return request<Expense[]>(
      `/api/expenses/date?date=${date}`
    );
  },

  // -------------------------
  // Dashboard
  // -------------------------

  async getDashboardSummary(): Promise<BackendDashboardSummary> {
    return request<BackendDashboardSummary>(
      '/api/expenses/dashboard'
    );
  },

  async getMonthlyTotal(
    year: number,
    month: number
  ): Promise<number> {
    return request<number>(
      `/api/expenses/dashboard/monthly?year=${year}&month=${month}`
    );
  },

  async getWeeklyTotal(
    date: string
  ): Promise<number> {
    return request<number>(
      `/api/expenses/dashboard/weekly?date=${date}`
    );
  },

  async getCategoryTotals(): Promise<CategoryExpense[]> {
    return request<CategoryExpense[]>(
      '/api/expenses/dashboard/categories'
    );
  },

  async getDailyTotals(): Promise<DailyExpense[]> {
    return request<DailyExpense[]>(
      '/api/expenses/dashboard/daily'
    );
  },

  async getHighestExpense(): Promise<HighestExpense | null> {
    return request<HighestExpense | null>(
      '/api/expenses/dashboard/highest'
    );
  },

  async getCategoryCounts(): Promise<CategoryCount[]> {
    return request<CategoryCount[]>(
      '/api/expenses/dashboard/category-counts'
    );
  },

  async getAverageExpense(): Promise<AverageExpense> {
    return request<AverageExpense>(
      '/api/expenses/dashboard/average'
    );
  },

  async getMonthlyCategoryTotals(
    year: number,
    month: number
  ): Promise<CategoryExpense[]> {
    return request<CategoryExpense[]>(
      `/api/expenses/dashboard/monthly/categories?year=${year}&month=${month}`
    );
  },
};