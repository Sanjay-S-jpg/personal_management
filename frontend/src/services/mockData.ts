import { Expense } from '../types/expense';

/**
 * Isolated visual development dataset.
 * Dates are dynamically adjusted relative to the current date so that
 * "This Week", "This Month", and historical trends always have meaningful data.
 */

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDate = now.getDate();

const createRelativeDate = (dayOffset: number, hours = 12, minutes = 30): string => {
  const d = new Date(currentYear, currentMonth, currentDate - dayOffset, hours, minutes);
  return d.toISOString();
};

export const INITIAL_MOCK_EXPENSES: Expense[] = [
  {
    id: 1,
    name: 'Gourmet Business Lunch',
    amount: 38.5,
    category: 'Food',
    subcategory: 'Lunch',
    createdAt: createRelativeDate(0, 13, 15),
    date: createRelativeDate(0, 13, 15),
  },
  {
    id: 2,
    name: 'EV Fast Charging Station',
    amount: 24.0,
    category: 'Fuel',
    subcategory: 'EV Charging',
    createdAt: createRelativeDate(1, 9, 20),
    date: createRelativeDate(1, 9, 20),
  },
  {
    id: 3,
    name: 'Weekly Organic Groceries',
    amount: 112.4,
    category: 'Orders',
    subcategory: 'Groceries',
    createdAt: createRelativeDate(2, 17, 45),
    date: createRelativeDate(2, 17, 45),
  },
  {
    id: 4,
    name: 'High-Speed Home Fiber Internet',
    amount: 65.0,
    category: 'Family Expense',
    subcategory: 'Utilities',
    createdAt: createRelativeDate(3, 10, 0),
    date: createRelativeDate(3, 10, 0),
  },
  {
    id: 5,
    name: 'Cloud IDE Annual Subscription',
    amount: 140.0,
    category: 'Office Expense',
    subcategory: 'Software',
    createdAt: createRelativeDate(4, 11, 30),
    date: createRelativeDate(4, 11, 30),
  },
  {
    id: 6,
    name: 'Weekend Cinema & Popcorn',
    amount: 42.0,
    category: 'Friends',
    subcategory: 'Movies',
    createdAt: createRelativeDate(5, 19, 0),
    date: createRelativeDate(5, 19, 0),
  },
  {
    id: 7,
    name: 'Ergonomic Desk Wrist Rest',
    amount: 28.9,
    category: 'Things',
    subcategory: 'Accessories',
    createdAt: createRelativeDate(6, 14, 10),
    date: createRelativeDate(6, 14, 10),
  },
  {
    id: 8,
    name: 'Index Fund Monthly Allocation',
    amount: 500.0,
    category: 'Savings',
    subcategory: 'Investments',
    createdAt: createRelativeDate(7, 8, 0),
    date: createRelativeDate(7, 8, 0),
  },
  {
    id: 9,
    name: 'Dinner at Italian Bistro',
    amount: 76.5,
    category: 'Food',
    subcategory: 'Dinner',
    createdAt: createRelativeDate(8, 20, 15),
    date: createRelativeDate(8, 20, 15),
  },
  {
    id: 10,
    name: 'Birthday Gift for Colleague',
    amount: 55.0,
    category: 'Friends',
    subcategory: 'Gifts',
    createdAt: createRelativeDate(9, 15, 30),
    date: createRelativeDate(9, 15, 30),
  },
  {
    id: 11,
    name: 'Specialty Coffee & Pastries',
    amount: 16.5,
    category: 'Food',
    subcategory: 'Snacks',
    createdAt: createRelativeDate(11, 16, 0),
    date: createRelativeDate(11, 16, 0),
  },
  {
    id: 12,
    name: 'Gasoline Fill-Up',
    amount: 52.3,
    category: 'Fuel',
    subcategory: 'Gasoline',
    createdAt: createRelativeDate(13, 11, 10),
    date: createRelativeDate(13, 11, 10),
  },
  {
    id: 13,
    name: 'Stationery Notebooks & Pens',
    amount: 22.0,
    category: 'Office Expense',
    subcategory: 'Stationery',
    createdAt: createRelativeDate(16, 14, 0),
    date: createRelativeDate(16, 14, 0),
  },
  {
    id: 14,
    name: 'Smart Thermostat Sensor',
    amount: 89.0,
    category: 'Things',
    subcategory: 'Gadgets',
    createdAt: createRelativeDate(18, 12, 0),
    date: createRelativeDate(18, 12, 0),
  },
  {
    id: 15,
    name: 'Household Cleaning Supplies',
    amount: 34.5,
    category: 'Family Expense',
    subcategory: 'Home Supplies',
    createdAt: createRelativeDate(21, 17, 20),
    date: createRelativeDate(21, 17, 20),
  },
];
