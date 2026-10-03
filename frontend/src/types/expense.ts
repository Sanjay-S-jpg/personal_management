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
  id: number;
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
  dateTime: string;
}

export interface CreateExpensePayload {
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
}

export interface UpdateExpensePayload {
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
}

export interface BackendDashboardSummary {
  totalSpent: number;
  totalExpenses: number;
}

export interface ExpenseDashboardSummary {
  totalSpent: number;
  totalExpensesCount: number;
  averageExpense: number;
  highestExpense: HighestExpense | null;
  thisWeekSpent: number;
  thisMonthSpent: number;
  categoryBreakdown: CategorySummary[];
  dailySpending: DailySpending[];
}

export interface CategoryExpense {
  category: string;
  total: number;
}

export interface DailyExpense {
  date: string;
  total: number;
}

export interface HighestExpense {
  id: number;
  name: string;
  amount: number;
  category: string;
  dateTime: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface AverageExpense {
  average: number;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage?: number;
}

export interface DailySpending {
  date: string;
  dayLabel: string;
  total: number;
  count?: number;
}