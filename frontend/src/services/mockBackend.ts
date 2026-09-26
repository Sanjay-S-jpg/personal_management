import {
  CategorySummary,
  CreateExpensePayload,
  DailySpending,
  Expense,
  ExpenseDashboardSummary,
  UpdateExpensePayload,
} from '../types/expense';
import { INITIAL_MOCK_EXPENSES } from './mockData';

const MOCK_STORAGE_KEY = 'pm_mock_expenses_store';

class MockBackendStore {
  private expenses: Expense[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY);
      if (stored) {
        this.expenses = JSON.parse(stored);
      } else {
        this.expenses = [...INITIAL_MOCK_EXPENSES];
        this.save();
      }
    } catch {
      this.expenses = [...INITIAL_MOCK_EXPENSES];
    }
  }

  private save() {
    try {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(this.expenses));
    } catch {
      // storage unavailable
    }
  }

  public resetToDefaults() {
    this.expenses = [...INITIAL_MOCK_EXPENSES];
    this.save();
  }

  public getAll(): Expense[] {
    return [...this.expenses].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  }

  public getById(id: string | number): Expense | undefined {
    return this.expenses.find((e) => String(e.id) === String(id));
  }

  public create(payload: CreateExpensePayload): Expense {
    const now = new Date();
    const newExpense: Expense = {
      id: Date.now(),
      name: payload.name.trim(),
      amount: Number(payload.amount),
      category: payload.category,
      subcategory: payload.subcategory?.trim() || undefined,
      createdAt: payload.date ? new Date(payload.date).toISOString() : now.toISOString(),
      date: payload.date ? new Date(payload.date).toISOString() : now.toISOString(),
    };
    this.expenses = [newExpense, ...this.expenses];
    this.save();
    return newExpense;
  }

  public update(id: string | number, payload: UpdateExpensePayload): Expense {
    const index = this.expenses.findIndex((e) => String(e.id) === String(id));
    if (index === -1) {
      throw new Error(`Expense with ID ${id} not found`);
    }
    const current = this.expenses[index];
    const updated: Expense = {
      ...current,
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.amount !== undefined && { amount: Number(payload.amount) }),
      ...(payload.category !== undefined && { category: payload.category }),
      ...(payload.subcategory !== undefined && { subcategory: payload.subcategory }),
      ...(payload.date !== undefined && {
        date: new Date(payload.date).toISOString(),
        createdAt: new Date(payload.date).toISOString(),
      }),
    };
    this.expenses[index] = updated;
    this.save();
    return updated;
  }

  public delete(id: string | number): boolean {
    const prevLength = this.expenses.length;
    this.expenses = this.expenses.filter((e) => String(e.id) !== String(id));
    this.save();
    return this.expenses.length < prevLength;
  }

  public getByDate(dateStr: string): Expense[] {
    // format YYYY-MM-DD
    return this.expenses.filter((e) => {
      const rawDate = e.createdAt || e.date;
      if (!rawDate) return false;
      const d = new Date(rawDate).toISOString().split('T')[0];
      return d === dateStr;
    });
  }

  public getWeekly(refDate = new Date()): Expense[] {
    const curr = new Date(refDate);
    // Find Monday of the current week
    const firstDay = curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1);
    const monday = new Date(curr.setDate(firstDay));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return this.expenses.filter((e) => {
      const d = new Date(e.createdAt || e.date || 0);
      return d >= monday && d <= sunday;
    });
  }

  public getMonthly(year = new Date().getFullYear(), month = new Date().getMonth()): Expense[] {
    return this.expenses.filter((e) => {
      const d = new Date(e.createdAt || e.date || 0);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  public getDashboardCategories(expenses = this.expenses): CategorySummary[] {
    const totals: Record<string, { total: number; count: number }> = {};
    let overallTotal = 0;

    expenses.forEach((e) => {
      const cat = e.category || 'Others';
      if (!totals[cat]) {
        totals[cat] = { total: 0, count: 0 };
      }
      totals[cat].total += Number(e.amount);
      totals[cat].count += 1;
      overallTotal += Number(e.amount);
    });

    return Object.entries(totals)
      .map(([category, { total, count }]) => ({
        category,
        total: Math.round(total * 100) / 100,
        count,
        percentage: overallTotal > 0 ? Math.round((total / overallTotal) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }

  public getDailySpending(days = 7): DailySpending[] {
    const result: DailySpending[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const ymd = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayExpenses = this.expenses.filter((e) => {
        const itemDate = new Date(e.createdAt || e.date || 0).toISOString().split('T')[0];
        return itemDate === ymd;
      });

      const total = dayExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

      result.push({
        date: ymd,
        dayLabel,
        total: Math.round(total * 100) / 100,
        count: dayExpenses.length,
      });
    }

    return result;
  }

  public getDashboardSummary(): ExpenseDashboardSummary {
    const all = this.expenses;
    const totalSpent = all.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpensesCount = all.length;
    const averageExpense = totalExpensesCount > 0 ? Math.round((totalSpent / totalExpensesCount) * 100) / 100 : 0;

    // Highest expense
    let highestExpense: Expense | null = null;
    if (all.length > 0) {
      highestExpense = [...all].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
    }

    // This week's spending
    const weeklyExpenses = this.getWeekly();
    const thisWeekSpent = weeklyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // This month's spending
    const monthlyExpenses = this.getMonthly();
    const thisMonthSpent = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const categoryBreakdown = this.getDashboardCategories();
    const dailySpending = this.getDailySpending(7);

    return {
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalExpensesCount,
      averageExpense,
      highestExpense,
      thisWeekSpent: Math.round(thisWeekSpent * 100) / 100,
      thisMonthSpent: Math.round(thisMonthSpent * 100) / 100,
      categoryBreakdown,
      dailySpending,
    };
  }
}

export const mockBackend = new MockBackendStore();
