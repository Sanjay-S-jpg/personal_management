import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { APP_MODULES } from '../../types/module';
import { InteractiveBackground } from '../3d/InteractiveBackground';
import { InteractiveModuleCard } from '../ui/InteractiveModuleCard';

import {
  Receipt,
  Shirt,
  CheckSquare,
  HeartPulse,
  ArrowUpRight,
  Sparkles,
  Wallet,
  Plus,
  CalendarDays,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  onNavigateModule: (moduleId: string) => void;
  onOpenAddExpense: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateModule,
  onOpenAddExpense,
}) => {
  const { user } = useAuth();
  const { dashboardSummary, expenses } = useExpenses();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  const firstName = user?.name?.split(' ')[0] || 'there';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value || 0);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-6 h-6" />;

      case 'Shirt':
        return <Shirt className="w-6 h-6" />;

      case 'CheckSquare':
        return <CheckSquare className="w-6 h-6" />;

      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6" />;

      default:
        return <Layers className="w-6 h-6" />;
    }
  };

  const getModuleStyle = (moduleId: string) => {
    switch (moduleId) {
      case 'expense-tracker':
        return {
          icon: 'text-indigo-400',
          iconBg: 'bg-indigo-500/10 border-indigo-500/20',
        };

      case 'wardrobe':
        return {
          icon: 'text-pink-400',
          iconBg: 'bg-pink-500/10 border-pink-500/20',
        };

      case 'tasks':
        return {
          icon: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        };

      case 'wellness':
        return {
          icon: 'text-amber-400',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
        };

      default:
        return {
          icon: 'text-neutral-400',
          iconBg: 'bg-neutral-500/10 border-neutral-500/20',
        };
    }
  };

  const getGlowColor = (moduleId: string) => {
    switch (moduleId) {
      case 'expense-tracker':
        return '99,102,241';

      case 'wardrobe':
        return '236,72,153';

      case 'tasks':
        return '16,185,129';

      case 'wellness':
        return '245,158,11';

      default:
        return '99,102,241';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 3D Background */}
      <InteractiveBackground />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-7 sm:p-10">

          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Welcome */}
            <div>

              <div className="flex items-center gap-2 text-xs text-indigo-400 mb-4">

                <Sparkles className="w-4 h-4" />

                <span>Personal Management</span>

                <span className="text-neutral-700">•</span>

                <span className="text-neutral-500">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {greeting},{' '}
                <span className="text-indigo-400">{firstName}</span>
                <span className="text-white">.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm sm:text-base text-neutral-400 leading-relaxed">
                Your personal command center for keeping track of money,
                wardrobe, routines and everything in between.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <button
                  onClick={onOpenAddExpense}
                  className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />

                  Add Expense

                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <button
                  onClick={() => onNavigateModule('expense-tracker')}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/70 px-5 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 hover:border-neutral-600"
                >
                  <Wallet className="w-4 h-4" />

                  View finances
                </button>

              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-3 lg:min-w-[300px]">

              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-neutral-500">
                    This month
                  </span>

                  <Wallet className="w-4 h-4 text-indigo-400" />

                </div>

                <div className="mt-3 text-2xl font-bold text-white">
                  {formatCurrency(
                    dashboardSummary?.thisMonthSpent || 0
                  )}
                </div>

                <p className="mt-1 text-[11px] text-neutral-500">
                  Total spending
                </p>

              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-xs text-neutral-500">
                    Recorded
                  </span>

                  <Receipt className="w-4 h-4 text-purple-400" />

                </div>

                <div className="mt-3 text-2xl font-bold text-white">
                  {expenses.length}
                </div>

                <p className="mt-1 text-[11px] text-neutral-500">
                  Transactions
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* MODULES */}
        <section>

          <div className="flex items-end justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium">
                Your workspace
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Everything in one place
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Choose a module to get started.
              </p>

            </div>

            <CalendarDays className="hidden sm:block w-5 h-5 text-neutral-700" />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {APP_MODULES.map((module) => {

              const isActive = module.status === 'active';
              const style = getModuleStyle(module.id);

              return (
                <InteractiveModuleCard
                  key={module.id}
                  active={isActive}
                  glowColor={getGlowColor(module.id)}
                  onClick={() => {
                    if (isActive) {
                      onNavigateModule(module.id);
                    }
                  }}
                >

                  {/* Icon + Badge */}
                  <div className="p-5">

                    <div className="flex items-start justify-between">

                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center ${style.iconBg} ${style.icon}`}
                      >
                        {getModuleIcon(module.iconName)}
                      </div>

                      {module.badge && (
                        <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
                          {module.badge}
                        </span>
                      )}

                    </div>

                    {/* Content */}
                    <div className="mt-6">

                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {module.name}
                      </h3>

                      <p className="mt-1 text-xs text-neutral-500">
                        {module.tagline}
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-neutral-400 line-clamp-3">
                        {module.description}
                      </p>

                    </div>

                    {/* Bottom */}
                    <div className="mt-8 pt-4 border-t border-neutral-800">

                      <div className="flex items-center justify-between">

                        <span
                          className={`text-xs font-medium ${
                            isActive
                              ? 'text-indigo-400'
                              : 'text-neutral-600'
                          }`}
                        >
                          {isActive
                            ? 'Open module'
                            : 'Coming soon'}
                        </span>

                        <ArrowUpRight
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive
                              ? 'text-neutral-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                              : 'text-neutral-700'
                          }`}
                        />

                      </div>

                    </div>

                  </div>

                </InteractiveModuleCard>
              );
            })}

          </div>

        </section>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-neutral-600">

          <Layers className="w-3.5 h-3.5" />

          <span>Built to grow with your life</span>

        </div>

      </div>
    </div>
  );
};