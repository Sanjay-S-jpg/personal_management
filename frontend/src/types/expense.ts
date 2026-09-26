export type ExpenseCategory =
  | 'Food'
  | 'Fuel'
  | 'Orders'
  | 'Family Expense'
  | 'Office Expense'
  | 'Friends'
  | 'Things'
  | 'Savings'
  | 'Others';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Fuel',
  'Orders',
  'Family Expense',
  'Office Expense',
  'Friends',
  'Things',
  'Savings',
  'Others',
];

export const CATEGORY_SUBCATEGORIES: Record<ExpenseCategory, string[]> = {
  Food: ['Lunch', 'Dinner', 'Snacks'],
  Friends: ['Gifts', 'Movies'],
  Fuel: ['Gasoline', 'Diesel', 'EV Charging'],
  Orders: ['Online Shopping', 'Groceries', 'Electronics'],
  'Family Expense': ['Home Supplies', 'Utilities', 'Medical'],
  'Office Expense': ['Stationery', 'Software', 'Equipment'],
  Things: ['Gadgets', 'Tools', 'Accessories'],
  Savings: ['Emergency Fund', 'Investments', 'Fixed Deposit'],
  Others: ['General', 'Miscellaneous'],
};

export interface Expense {
  id: string | number;
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
  createdAt?: string; // ISO date string from backend
  date?: string;      // Formatted date or ISO string
}

export interface CreateExpensePayload {
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
  date?: string; // Optional if user wants to log for a specific date
}

export interface UpdateExpensePayload {
  name?: string;
  amount?: number;
  category?: ExpenseCategory;
  subcategory?: string;
  date?: string;
}

export interface CategorySummary {
  category: ExpenseCategory | string;
  total: number;
  count: number;
  percentage?: number;
}

export interface DailySpending {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  total: number;
  count?: number;
}

export interface ExpenseDashboardSummary {
  totalSpent: number;
  totalExpensesCount: number;
  averageExpense: number;
  highestExpense: Expense | null;
  thisWeekSpent: number;
  thisMonthSpent: number;
  categoryBreakdown: CategorySummary[];
  dailySpending: DailySpending[];
}
