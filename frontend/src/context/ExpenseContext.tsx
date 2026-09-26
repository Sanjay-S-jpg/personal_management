import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CreateExpensePayload,
  Expense,
  ExpenseDashboardSummary,
  UpdateExpensePayload,
} from '../types/expense';
import { expenseService } from '../services/expenseService';

interface ExpenseContextType {
  expenses: Expense[];
  dashboardSummary: ExpenseDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  addExpense: (payload: CreateExpensePayload) => Promise<Expense>;
  editExpense: (id: string | number, payload: UpdateExpensePayload) => Promise<Expense>;
  removeExpense: (id: string | number) => Promise<boolean>;
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

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<ExpenseDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Global filters
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterDate, setFilterDate] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allExpenses, summary] = await Promise.all([
        expenseService.getAllExpenses(),
        expenseService.getDashboardSummary(),
      ]);
      setExpenses(allExpenses);
      setDashboardSummary(summary);
    } catch (err: any) {
      console.error('Failed to load expenses', err);
      setError(err?.message || 'Failed to retrieve expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExpense = async (payload: CreateExpensePayload): Promise<Expense> => {
    try {
      const created = await expenseService.createExpense(payload);
      await loadData();
      return created;
    } catch (err: any) {
      throw err;
    }
  };

  const editExpense = async (id: string | number, payload: UpdateExpensePayload): Promise<Expense> => {
    try {
      const updated = await expenseService.updateExpense(id, payload);
      await loadData();
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const removeExpense = async (id: string | number): Promise<boolean> => {
    try {
      const result = await expenseService.deleteExpense(id);
      await loadData();
      return result.success;
    } catch (err: any) {
      throw err;
    }
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
        refreshExpenses: loadData,
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

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
