import React, { useState } from 'react';
import { ExpenseDashboard } from './ExpenseDashboard';
import { AddExpenseForm } from './AddExpenseForm';
import { ExpenseHistory } from './ExpenseHistory';
import { WeeklyExpenses } from './WeeklyExpenses';
import { MonthlyExpenses } from './MonthlyExpenses';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  CalendarDays,
  CalendarRange,
  ArrowLeft,
} from 'lucide-react';

export type ExpenseSubView = 'dashboard' | 'add' | 'history' | 'weekly' | 'monthly';

interface ExpenseTrackerLayoutProps {
  initialSubView?: ExpenseSubView;
  onBackHome: () => void;
}

export const ExpenseTrackerLayout: React.FC<ExpenseTrackerLayoutProps> = ({
  initialSubView = 'dashboard',
  onBackHome,
}) => {
  const [activeSubView, setActiveSubView] = useState<ExpenseSubView>(initialSubView);

  const navItems = [
    {
      id: 'dashboard' as ExpenseSubView,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'add' as ExpenseSubView,
      label: 'Add Expense',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'history' as ExpenseSubView,
      label: 'Expense History',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'weekly' as ExpenseSubView,
      label: 'Weekly View',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'monthly' as ExpenseSubView,
      label: 'Monthly View',
      icon: <CalendarRange className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top breadcrumb & Module title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Personal Management</span>
            <span aria-hidden="true">/</span>
            <span>Modules</span>
          </button>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
            Expense Tracker
          </h1>
        </div>

        {/* Action Button: Quick Add Expense if not already on add tab */}
        {activeSubView !== 'add' && (
          <button
            onClick={() => setActiveSubView('add')}
            className="self-start sm:self-auto px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record New Expense</span>
          </button>
        )}
      </div>

      {/* Segmented Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeSubView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              <span className={isActive ? 'text-indigo-400' : 'text-neutral-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-View Body */}
      <div className="pt-2">
        {activeSubView === 'dashboard' && (
          <ExpenseDashboard
            onNavigateAddExpense={() => setActiveSubView('add')}
            onNavigateHistory={() => setActiveSubView('history')}
          />
        )}

        {activeSubView === 'add' && (
          <AddExpenseForm
            onSuccess={() => setActiveSubView('history')}
            onCancel={() => setActiveSubView('dashboard')}
          />
        )}

        {activeSubView === 'history' && <ExpenseHistory />}

        {activeSubView === 'weekly' && <WeeklyExpenses />}

        {activeSubView === 'monthly' && <MonthlyExpenses />}
      </div>
    </div>
  );
};
