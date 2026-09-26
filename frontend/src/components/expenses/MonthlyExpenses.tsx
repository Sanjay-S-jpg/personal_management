import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { DailyTrendChart } from '../charts/DailyTrendChart';
import { DailySpending } from '../../types/expense';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MonthlyExpenses: React.FC = () => {
  const { expenses } = useExpenses();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-indexed

  // Navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Filter expenses for selected month and year
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.createdAt || e.date || 0);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [expenses, selectedYear, selectedMonth]);

  const monthTotal = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Category breakdown for this month
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    monthlyExpenses.forEach((e) => {
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
        percentage: monthTotal > 0 ? Math.round((total / monthTotal) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [monthlyExpenses, monthTotal]);

  // Days in selected month for daily trend
  const dailySpendingTrend = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const result: DailySpending[] = [];

    // Bucket into 7-10 aggregated segments or key days so the chart remains ultra clean
    const step = daysInMonth > 28 ? 3 : 2;
    for (let day = 1; day <= daysInMonth; day += step) {
      const endDay = Math.min(day + step - 1, daysInMonth);
      let segmentTotal = 0;
      let count = 0;

      for (let d = day; d <= endDay; d++) {
        const targetDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const matching = monthlyExpenses.filter((e) => {
          const raw = e.createdAt || e.date;
          return raw && new Date(raw).toISOString().split('T')[0] === targetDateStr;
        });
        segmentTotal += matching.reduce((s, e) => s + Number(e.amount), 0);
        count += matching.length;
      }

      result.push({
        date: `${MONTH_NAMES[selectedMonth].substring(0, 3)} ${day}-${endDay}`,
        dayLabel: `${day}-${endDay}`,
        total: Math.round(segmentTotal * 100) / 100,
        count,
      });
    }

    return result;
  }, [monthlyExpenses, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Header and Month/Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Monthly Overview</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit monthly allocations, category distributions, and daily velocity.
          </p>
        </div>

        {/* Month & Year Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-neutral-100 focus:outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx} className="bg-neutral-900 text-neutral-100">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-mono text-neutral-300 focus:outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr} className="bg-neutral-900 text-neutral-100">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">
            Total Spent ({MONTH_NAMES[selectedMonth]})
          </span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            ${monthTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Monthly aggregate</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">Number of Transactions</span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            {monthlyExpenses.length}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Logged items this month</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">Active Categories</span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            {categoryBreakdown.length}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Unique budget divisions</span>
        </div>
      </div>

      {/* Charts Grid: Monthly Category Breakdown & Daily Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Monthly Category Breakdown</h3>
              <p className="text-xs text-neutral-400">Share by budget bucket for {MONTH_NAMES[selectedMonth]}</p>
            </div>
            <span className="text-xs font-mono text-neutral-300 tabular-nums">
              ${monthTotal.toFixed(2)}
            </span>
          </div>

          <CategoryDonutChart categories={categoryBreakdown} totalSpent={monthTotal} />
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Daily Spending Trend</h3>
              <p className="text-xs text-neutral-400">Expenditure flow throughout {MONTH_NAMES[selectedMonth]}</p>
            </div>
          </div>

          <DailyTrendChart data={dailySpendingTrend} />
        </div>
      </div>

      {/* Expense History for Selected Month */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-100">
            Transactions in {MONTH_NAMES[selectedMonth]} {selectedYear} ({monthlyExpenses.length})
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Total: ${monthTotal.toFixed(2)}
          </span>
        </div>

        {monthlyExpenses.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-400">
            No expenses logged in {MONTH_NAMES[selectedMonth]} {selectedYear}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Expense</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Subcategory</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {monthlyExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-neutral-100 max-w-[200px] truncate">
                      {exp.name}
                    </td>
                    <td className="py-3 px-3 text-neutral-300">{exp.category}</td>
                    <td className="py-3 px-3 text-neutral-400">{exp.subcategory || '—'}</td>
                    <td className="py-3 px-3 text-neutral-400 font-mono">
                      {new Date(exp.createdAt || exp.date || '').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
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
