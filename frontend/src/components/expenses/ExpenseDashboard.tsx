import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { DailyTrendChart } from '../charts/DailyTrendChart';
import {
  DollarSign,
  Hash,
  Calculator,
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface ExpenseDashboardProps {
  onNavigateAddExpense: () => void;
  onNavigateHistory: () => void;
}

export const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({
  onNavigateAddExpense,
  onNavigateHistory,
}) => {
  const { expenses, dashboardSummary, isLoading } = useExpenses();
  const [periodFilter, setPeriodFilter] = useState<'all' | '30days' | '7days'>('all');

  // Filter expenses according to time period
  const getFilteredData = () => {
    if (!expenses) return { expenses: [], total: 0 };
    const now = new Date();

    if (periodFilter === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const filtered = expenses.filter(
        (e) => new Date(e.createdAt || e.date || 0) >= sevenDaysAgo
      );
      return {
        expenses: filtered,
        total: filtered.reduce((s, e) => s + Number(e.amount), 0),
      };
    }

    if (periodFilter === '30days') {
      const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      const filtered = expenses.filter(
        (e) => new Date(e.createdAt || e.date || 0) >= thirtyDaysAgo
      );
      return {
        expenses: filtered,
        total: filtered.reduce((s, e) => s + Number(e.amount), 0),
      };
    }

    return {
      expenses,
      total: dashboardSummary?.totalSpent || 0,
    };
  };

  const { expenses: activeExpenses, total: activeTotal } = getFilteredData();

  // Compute category breakdown dynamically for selected period
  const computeActiveCategories = () => {
    const map: Record<string, { total: number; count: number }> = {};
    activeExpenses.forEach((e) => {
      const cat = e.category || 'Others';
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += Number(e.amount);
      map[cat].count += 1;
    });

    return Object.entries(map)
      .map(([category, { total, count }]) => ({
        category,
        total: Math.round(total * 100) / 100,
        count,
      }))
      .sort((a, b) => b.total - a.total);
  };

  const activeCategories = computeActiveCategories();

  // Summary Metrics
  const totalSpent = dashboardSummary?.totalSpent ?? 0;
  const totalCount = dashboardSummary?.totalExpensesCount ?? expenses.length;
  const averageExpense = dashboardSummary?.averageExpense ?? 0;
  const highestExpense = dashboardSummary?.highestExpense ?? null;
  const thisWeekSpent = dashboardSummary?.thisWeekSpent ?? 0;
  const thisMonthSpent = dashboardSummary?.thisMonthSpent ?? 0;

  return (
    <div className="space-y-8">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Financial Analytics</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Aggregated expenditure metrics, categorical breakdown, and activity trends.
          </p>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setPeriodFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              periodFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriodFilter('30days')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              periodFilter === '30days'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setPeriodFilter('7days')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              periodFilter === '7days'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Past 7 Days
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Spent */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Total Spent</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Cumulative all-time expenditure</div>
        </div>

        {/* 2. Total Number of Expenses */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Total Expenses Logged</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sky-400">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Total recorded receipts & transactions</div>
        </div>

        {/* 3. Average Expense */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Average Expense</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
            ${averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Mean expenditure per transaction</div>
        </div>

        {/* 4. Highest Expense */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Highest Expense</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums truncate">
            {highestExpense ? (
              `$${Number(highestExpense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              '$0.00'
            )}
          </div>
          <div className="text-[11px] text-neutral-400 truncate mt-1">
            {highestExpense ? highestExpense.name : 'No records yet'}
          </div>
        </div>

        {/* 5. This Week's Spending */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">This Week's Spending</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
            ${thisWeekSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Monday to Sunday window</div>
        </div>

        {/* 6. This Month's Spending */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">This Month's Spending</span>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-purple-400">
              <CalendarRange className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
            ${thisMonthSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Current calendar month total</div>
        </div>
      </div>

      {/* Visual Charts Grid: Category Breakdown + Daily Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Spending by Category */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Spending by Category</h3>
              <p className="text-xs text-neutral-400">
                Categorical allocation ({periodFilter === 'all' ? 'All Time' : periodFilter})
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-neutral-300">
              ${activeTotal.toFixed(2)}
            </span>
          </div>

          <CategoryDonutChart categories={activeCategories} totalSpent={activeTotal} />
        </div>

        {/* Chart 2: Daily Spending Trend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Daily Spending Trend</h3>
              <p className="text-xs text-neutral-400">Recent 7-day transaction velocity</p>
            </div>
            <button
              onClick={onNavigateAddExpense}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>

          <DailyTrendChart data={dashboardSummary?.dailySpending || []} />
        </div>
      </div>

      {/* Recent Transactions List with Clean Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/80">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">Recent Transactions</h3>
            <p className="text-xs text-neutral-400">Latest expense entries logged</p>
          </div>
          <button
            onClick={onNavigateHistory}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-400">
            No expenses logged yet. Click "Add Expense" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subcategory</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {expenses.slice(0, 5).map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-neutral-100 truncate max-w-[200px]">
                      {exp.name}
                    </td>
                    <td className="py-3 px-3 text-neutral-300">
                      {exp.category}
                    </td>
                    <td className="py-3 px-3 text-neutral-400">
                      {exp.subcategory || '—'}
                    </td>
                    <td className="py-3 px-3 text-neutral-400 font-mono">
                      {new Date(exp.createdAt || exp.date || '').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold font-mono text-neutral-100 tabular-nums">
                      ${Number(exp.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
