import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  CategorySummary,
  CreateExpensePayload,
  DailySpending,
  Expense,
  BackendDashboardSummary,
ExpenseDashboardSummary,
  HighestExpense,
  UpdateExpensePayload,
} from '../types/expense';

import { expenseService } from '../services/expenseService';

interface ExpenseContextType {
  expenses: Expense[];

  dashboardSummary: ExpenseDashboardSummary | null;

  isLoading: boolean;
  error: string | null;

  addExpense: (
    payload: CreateExpensePayload
  ) => Promise<Expense>;

  editExpense: (
    id: string | number,
    payload: UpdateExpensePayload
  ) => Promise<Expense>;

  removeExpense: (
    id: string | number
  ) => Promise<boolean>;

  refreshExpenses: () => Promise<void>;

  filterCategory: string;
  setFilterCategory: (category: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;

  filterDate: string;
  setFilterDate: (date: string) => void;
}

const ExpenseContext =
  createContext<ExpenseContextType | undefined>(undefined);


// Get YYYY-MM-DD using the user's local time
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


// Convert backend daily totals into the format
// expected by the existing dashboard chart.
const buildDailySpending = (
  dailyTotals: { date: string; total: number }[]
): DailySpending[] => {

  const today = new Date();

  const lastSevenDates: DailySpending[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = getLocalDateString(date);

    const matchingDay = dailyTotals.find(
      (item) => item.date === dateString
    );

    lastSevenDates.push({
      date: dateString,
      dayLabel: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      total: matchingDay?.total ?? 0,
    });
  }

  return lastSevenDates;
};


export const ExpenseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [dashboardSummary, setDashboardSummary] =
    useState<ExpenseDashboardSummary | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [filterCategory, setFilterCategory] =
    useState<string>('all');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [sortOrder, setSortOrder] =
    useState<'newest' | 'oldest'>('newest');

  const [filterDate, setFilterDate] =
    useState('');


  // --------------------------------
  // Load expenses + dashboard data
  // --------------------------------

  const refreshExpenses = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);

    const sort =
      sortOrder === 'newest'
        ? 'desc'
        : 'asc';

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = getLocalDateString(now);

    // --------------------------------
    // STEP 1: Load critical data first
    // --------------------------------

    const [
      expensesData,
      summaryData,
      monthlyTotal,
      weeklyTotal,
    ] = await Promise.all([
      expenseService.getAllExpenses(sort),
      expenseService.getDashboardSummary(),
      expenseService.getMonthlyTotal(year, month),
      expenseService.getWeeklyTotal(today),
    ]);

    // Show the basic data immediately
    setExpenses(expensesData);

    const initialSummary: ExpenseDashboardSummary = {
      totalSpent: Number(summaryData.totalSpent),

      totalExpensesCount:
        Number(summaryData.totalExpenses),

      averageExpense: 0,

      highestExpense: null,

      thisWeekSpent:
        Number(weeklyTotal),

      thisMonthSpent:
        Number(monthlyTotal),

      categoryBreakdown: [],

      dailySpending: [],
    };

    setDashboardSummary(initialSummary);

    // --------------------------------
    // STEP 2: Load analytics
    // --------------------------------

    const [
      categoryTotals,
      dailyTotals,
      highestExpense,
      averageExpense,
    ] = await Promise.all([
      expenseService.getCategoryTotals(),
      expenseService.getDailyTotals(),
      expenseService.getHighestExpense(),
      expenseService.getAverageExpense(),
    ]);

    // Category breakdown
    const totalCategorySpent =
      categoryTotals.reduce(
        (sum, item) =>
          sum + Number(item.total),
        0
      );

    const categoryBreakdown: CategorySummary[] =
      categoryTotals.map((item) => ({
        category: item.category,
        total: Number(item.total),
        count: 0,
        percentage:
          totalCategorySpent > 0
            ? Math.round(
                (Number(item.total) /
                  totalCategorySpent) *
                  1000
              ) / 10
            : 0,
      }));

    // Daily spending
    const dailySpending =
      buildDailySpending(dailyTotals);

    // --------------------------------
    // Update dashboard with analytics
    // --------------------------------

    setDashboardSummary({
      totalSpent:
        Number(summaryData.totalSpent),

      totalExpensesCount:
        Number(summaryData.totalExpenses),

      averageExpense:
        Number(averageExpense.average),

      highestExpense,

      thisWeekSpent:
        Number(weeklyTotal),

      thisMonthSpent:
        Number(monthlyTotal),

      categoryBreakdown,

      dailySpending,
      });

    } catch (err) {
      console.error(
        'Failed to load expense data:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load expense data'
      );

    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);


  // Initial load
  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);


  // --------------------------------
  // Add expense
  // --------------------------------

  const addExpense = async (
    payload: CreateExpensePayload
  ): Promise<Expense> => {

    const expense =
      await expenseService.createExpense(
        payload
      );

    await refreshExpenses();

    return expense;
  };


  // --------------------------------
  // Edit expense
  // --------------------------------

  const editExpense = async (
    id: string | number,
    payload: UpdateExpensePayload
  ): Promise<Expense> => {

    const expense =
      await expenseService.updateExpense(
        Number(id),
        payload
      );

    await refreshExpenses();

    return expense;
  };


  // --------------------------------
  // Delete expense
  // --------------------------------

  const removeExpense = async (
    id: string | number
  ): Promise<boolean> => {

    const result =
      await expenseService.deleteExpense(
        Number(id)
      );

    await refreshExpenses();

    return result;
  };


  return (
    <ExpenseContext.Provider
      value={{
        expenses,

        dashboardSummary,

        isLoading,
        error,

        addExpense,
        editExpense,
        removeExpense,
        refreshExpenses,

        filterCategory,
        setFilterCategory,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        filterDate,
        setFilterDate,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};


// Keep the existing hook name used by your components.
export const useExpenses = (): ExpenseContextType => {

  const context =
    useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      'useExpenses must be used inside ExpenseProvider'
    );
  }

  return context;
};  