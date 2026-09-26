import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { APP_MODULES, AppModule } from '../../types/module';
import {
  Receipt,
  Shirt,
  CheckSquare,
  HeartPulse,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  onNavigateModule: (moduleId: string) => void;
  onOpenAddExpense: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateModule, onOpenAddExpense }) => {
  const { user } = useAuth();
  const { dashboardSummary, expenses } = useExpenses();

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-6 h-6 text-indigo-400" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-pink-400" />;
      case 'CheckSquare':
        return <CheckSquare className="w-6 h-6 text-emerald-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-amber-400" />;
      default:
        return <Layers className="w-6 h-6 text-neutral-400" />;
    }
  };

  // Human greeting based on hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personal Management Hub</span>
              <span aria-hidden="true">·</span>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
              {greeting}, {firstName}
            </h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Your central dashboard for finances, daily habits, and personal asset planning. 
              Built on a modular architecture ready for full Spring Boot backend integration.
            </p>
          </div>

          {/* Quick Stat Pill Widget */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3.5 min-w-[130px]">
              <span className="text-[11px] text-neutral-400 block">This Month</span>
              <span className="text-lg font-bold text-neutral-100 font-mono tabular-nums">
                ${(dashboardSummary?.thisMonthSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3.5 min-w-[130px]">
              <span className="text-[11px] text-neutral-400 block">Total Recorded</span>
              <span className="text-lg font-bold text-neutral-100 font-mono tabular-nums">
                {expenses.length} <span className="text-xs font-normal text-neutral-500">entries</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Application Modules</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Plug-and-play productivity and life organization suites
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {APP_MODULES.map((module) => {
            const isActive = module.status === 'active';

            return (
              <div
                key={module.id}
                onClick={() => onNavigateModule(module.id)}
                className={`group relative rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-850 hover:shadow-lg hover:shadow-indigo-500/5'
                    : 'bg-neutral-900/60 border-neutral-800/70 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Card Header with Icon and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                      {getModuleIcon(module.iconName)}
                    </div>
                    {module.badge && (
                      <span className="text-[11px] font-medium text-neutral-400 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-neutral-100 group-hover:text-indigo-300 transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-400 mt-1">
                    {module.tagline}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 pt-4 border-t border-neutral-800/60 space-y-1.5">
                    {module.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="w-1 h-1 rounded-full bg-neutral-600" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-medium">
                  <span className={isActive ? 'text-indigo-400' : 'text-neutral-500'}>
                    {isActive ? 'Launch Module' : 'Preview Roadmap'}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isActive ? 'text-indigo-400' : 'text-neutral-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Extensibility Callout */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-indigo-400 shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">
              Extensible Modular Architecture
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              New personal management modules (Wardrobe, Task Matrix, Health) mount cleanly into 
              the central router and shared Spring Boot authentication context without re-architecting existing services.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateModule('expense-tracker')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shrink-0"
        >
          Open Expense Tracker
        </button>
      </section>
    </div>
  );
};
