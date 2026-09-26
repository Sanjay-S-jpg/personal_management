import {
  CategorySummary,
  CreateExpensePayload,
  DailySpending,
  Expense,
  ExpenseDashboardSummary,
  UpdateExpensePayload,
} from '../types/expense';
import { ApiError, request } from './apiClient';
import { mockBackend } from './mockBackend';

/**
 * Expense Service
 * Connects directly to Spring Boot backend endpoints:
 *
 * POST /api/expenses
 * GET /api/expenses
 * GET /api/expenses/{id}
 * PUT /api/expenses/{id}
 * DELETE /api/expenses/{id}
 *
 * GET /api/expenses/monthly
 * GET /api/expenses/weekly
 * GET /api/expenses/date
 *
 * GET /api/expenses/dashboard
 * GET /api/expenses/dashboard/monthly
 * GET /api/expenses/dashboard/weekly
 * GET /api/expenses/dashboard/categories
 * GET /api/expenses/dashboard/monthly/categories
 * GET /api/expenses/dashboard/daily
 * GET /api/expenses/dashboard/highest
 * GET /api/expenses/dashboard/category-counts
 * GET /api/expenses/dashboard/average
 */

// Helper to determine whether we should gracefully fallback to isolated mock
const handleWithFallback = async <T>(
  apiFn: () => Promise<T>,
  fallbackFn: () => T | Promise<T>
): Promise<T> => {
  try {
    return await apiFn();
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 0) {
      // Backend server is offline or unreachable; use isolated mock store
      return await fallbackFn();
    }
    throw err;
  }
};

export const expenseService = {
  // 1. POST /api/expenses
  async createExpense(payload: CreateExpensePayload): Promise<Expense> {
    return handleWithFallback(
      () =>
        request<Expense>('/api/expenses', {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      () => mockBackend.create(payload)
    );
  },

  // 2. GET /api/expenses
  async getAllExpenses(): Promise<Expense[]> {
    return handleWithFallback(
      () => request<Expense[]>('/api/expenses'),
      () => mockBackend.getAll()
    );
  },

  // 3. GET /api/expenses/{id}
  async getExpenseById(id: string | number): Promise<Expense> {
    return handleWithFallback(
      () => request<Expense>(`/api/expenses/${id}`),
      () => {
        const item = mockBackend.getById(id);
        if (!item) throw new ApiError(`Expense ${id} not found`, 404);
        return item;
      }
    );
  },

  // 4. PUT /api/expenses/{id}
  async updateExpense(id: string | number, payload: UpdateExpensePayload): Promise<Expense> {
    return handleWithFallback(
      () =>
        request<Expense>(`/api/expenses/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      () => mockBackend.update(id, payload)
    );
  },

  // 5. DELETE /api/expenses/{id}
  async deleteExpense(id: string | number): Promise<{ success: boolean }> {
    return handleWithFallback(
      () =>
        request<{ success: boolean }>(`/api/expenses/${id}`, {
          method: 'DELETE',
        }),
      () => {
        const ok = mockBackend.delete(id);
        return { success: ok };
      }
    );
  },

  // 6. GET /api/expenses/monthly
  async getMonthlyExpenses(year?: number, month?: number): Promise<Expense[]> {
    const y = year ?? new Date().getFullYear();
    const m = month ?? new Date().getMonth() + 1; // 1-indexed for HTTP params
    return handleWithFallback(
      () =>
        request<Expense[]>('/api/expenses/monthly', {
          params: { year: y, month: m },
        }),
      () => mockBackend.getMonthly(y, m - 1)
    );
  },

  // 7. GET /api/expenses/weekly
  async getWeeklyExpenses(referenceDate?: string): Promise<Expense[]> {
    return handleWithFallback(
      () =>
        request<Expense[]>('/api/expenses/weekly', {
          params: referenceDate ? { date: referenceDate } : undefined,
        }),
      () => mockBackend.getWeekly(referenceDate ? new Date(referenceDate) : new Date())
    );
  },

  // 8. GET /api/expenses/date
  async getExpensesByDate(dateStr: string): Promise<Expense[]> {
    return handleWithFallback(
      () =>
        request<Expense[]>('/api/expenses/date', {
          params: { date: dateStr },
        }),
      () => mockBackend.getByDate(dateStr)
    );
  },

  // 9. GET /api/expenses/dashboard
  async getDashboardSummary(): Promise<ExpenseDashboardSummary> {
    return handleWithFallback(
      () => request<ExpenseDashboardSummary>('/api/expenses/dashboard'),
      () => mockBackend.getDashboardSummary()
    );
  },

  // 10. GET /api/expenses/dashboard/monthly
  async getDashboardMonthly(): Promise<{ total: number; count: number; month: number; year: number }> {
    const now = new Date();
    return handleWithFallback(
      () =>
        request<{ total: number; count: number; month: number; year: number }>(
          '/api/expenses/dashboard/monthly'
        ),
      () => {
        const monthly = mockBackend.getMonthly();
        const total = monthly.reduce((sum, e) => sum + Number(e.amount), 0);
        return {
          total: Math.round(total * 100) / 100,
          count: monthly.length,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        };
      }
    );
  },

  // 11. GET /api/expenses/dashboard/weekly
  async getDashboardWeekly(): Promise<{ total: number; count: number }> {
    return handleWithFallback(
      () => request<{ total: number; count: number }>('/api/expenses/dashboard/weekly'),
      () => {
        const weekly = mockBackend.getWeekly();
        const total = weekly.reduce((sum, e) => sum + Number(e.amount), 0);
        return {
          total: Math.round(total * 100) / 100,
          count: weekly.length,
        };
      }
    );
  },

  // 12. GET /api/expenses/dashboard/categories
  async getDashboardCategories(): Promise<CategorySummary[]> {
    return handleWithFallback(
      () => request<CategorySummary[]>('/api/expenses/dashboard/categories'),
      () => mockBackend.getDashboardCategories()
    );
  },

  // 13. GET /api/expenses/dashboard/monthly/categories
  async getDashboardMonthlyCategories(year?: number, month?: number): Promise<CategorySummary[]> {
    const y = year ?? new Date().getFullYear();
    const m = month ?? new Date().getMonth();
    return handleWithFallback(
      () =>
        request<CategorySummary[]>('/api/expenses/dashboard/monthly/categories', {
          params: { year: y, month: m + 1 },
        }),
      () => {
        const monthly = mockBackend.getMonthly(y, m);
        return mockBackend.getDashboardCategories(monthly);
      }
    );
  },

  // 14. GET /api/expenses/dashboard/daily
  async getDashboardDaily(days = 7): Promise<DailySpending[]> {
    return handleWithFallback(
      () =>
        request<DailySpending[]>('/api/expenses/dashboard/daily', {
          params: { days },
        }),
      () => mockBackend.getDailySpending(days)
    );
  },

  // 15. GET /api/expenses/dashboard/highest
  async getDashboardHighest(): Promise<Expense | null> {
    return handleWithFallback(
      () => request<Expense | null>('/api/expenses/dashboard/highest'),
      () => {
        const summary = mockBackend.getDashboardSummary();
        return summary.highestExpense;
      }
    );
  },

  // 16. GET /api/expenses/dashboard/category-counts
  async getDashboardCategoryCounts(): Promise<Record<string, number>> {
    return handleWithFallback(
      () => request<Record<string, number>>('/api/expenses/dashboard/category-counts'),
      () => {
        const categories = mockBackend.getDashboardCategories();
        const map: Record<string, number> = {};
        categories.forEach((c) => {
          map[c.category] = c.count;
        });
        return map;
      }
    );
  },

  // 17. GET /api/expenses/dashboard/average
  async getDashboardAverage(): Promise<{ average: number }> {
    return handleWithFallback(
      () => request<{ average: number }>('/api/expenses/dashboard/average'),
      () => {
        const summary = mockBackend.getDashboardSummary();
        return { average: summary.averageExpense };
      }
    );
  },

  // Helper: test connectivity to backend
  async testBackendConnection(): Promise<boolean> {
    try {
      const baseUrl = (await import('./apiClient')).getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/expenses`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      return res.status < 500;
    } catch {
      return false;
    }
  },
};
