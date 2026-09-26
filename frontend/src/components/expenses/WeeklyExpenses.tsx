import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { WeeklyBarChart } from '../charts/WeeklyBarChart';
import { ChevronLeft, ChevronRight, Calendar, Receipt } from 'lucide-react';

export const WeeklyExpenses: React.FC = () => {
  const { expenses } = useExpenses();

  // Current week offset in weeks (0 = this week, -1 = last week, etc.)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Calculate Monday and Sunday for the target week
  const { monday, sunday, dateLabel } = useMemo(() => {
    const now = new Date();
    // target date based on offset
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekOffset * 7);

    // Monday
    const dayOfWeek = target.getDay();
    const diffToMonday = target.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const mon = new Date(target.setDate(diffToMonday));
    mon.setHours(0, 0, 0, 0);

    // Sunday
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);

    const formatOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const label = `${mon.toLocaleDateString('en-US', formatOpts)} — ${sun.toLocaleDateString('en-US', formatOpts)}`;

    return { monday: mon, sunday: sun, dateLabel: label };
  }, [weekOffset]);

  // Expenses within this week window
  const weekExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.createdAt || e.date || 0);
      return d >= monday && d <= sunday;
    });
  }, [expenses, monday, sunday]);

  const weekTotal = weekExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Daily distribution for Mon - Sun
  const dailyDistribution = useMemo(() => {
    const days: { dayName: string; dateStr: string; total: number; count: number }[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ymd = d.toISOString().split('T')[0];

      const matching = weekExpenses.filter((e) => {
        const itemYmd = new Date(e.createdAt || e.date || 0).toISOString().split('T')[0];
        return itemYmd === ymd;
      });

      const dayTotal = matching.reduce((s, e) => s + Number(e.amount), 0);
      days.push({
        dayName: dayNames[i],
        dateStr: ymd,
        total: Math.round(dayTotal * 100) / 100,
        count: matching.length,
      });
    }

    return days;
  }, [monday, weekExpenses]);

  return (
    <div className="space-y-6">
      {/* Header and Week Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Weekly Overview</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor week-by-week spending rhythms and day-by-day allocation.
          </p>
        </div>

        {/* Week Navigator Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200">
            {dateLabel}
          </div>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Current Week
            </button>
          )}
        </div>
      </div>

      {/* Week Summary Stat Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">Total Spent This Week</span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            ${weekTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">7-day period aggregate</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">Number of Transactions</span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            {weekExpenses.length}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Logged expenses during this week</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-neutral-400 font-medium block">Average Per Day</span>
          <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums block mt-1">
            ${(weekTotal / 7).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Daily burn rate across 7 days</span>
        </div>
      </div>

      {/* Daily Spending Visualization (Mon - Sun) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-100 mb-1">
          Daily Spending Distribution
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          Expenditure breakdown from Monday through Sunday
        </p>

        <WeeklyBarChart days={dailyDistribution} weekTotal={weekTotal} />
      </div>

      {/* Expense List for Selected Week */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-100">
            Expenses in Selected Week ({weekExpenses.length})
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Sum: ${weekTotal.toFixed(2)}
          </span>
        </div>

        {weekExpenses.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-400">
            No expenses recorded during this week.
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
                {weekExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-neutral-100 max-w-[200px] truncate">
                      {exp.name}
                    </td>
                    <td className="py-3 px-3 text-neutral-300">{exp.category}</td>
                    <td className="py-3 px-3 text-neutral-400">{exp.subcategory || '—'}</td>
                    <td className="py-3 px-3 text-neutral-400 font-mono">
                      {new Date(exp.createdAt || exp.date || '').toLocaleDateString('en-US', {
                        weekday: 'short',
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
