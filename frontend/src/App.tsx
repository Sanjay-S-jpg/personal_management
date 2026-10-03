import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BackendStatusProvider } from './context/BackendStatusContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { Navbar } from './components/common/Navbar';
import { HomePage } from './components/home/HomePage';
import {
  ExpenseTrackerLayout,
  ExpenseSubView,
} from './components/expenses/ExpenseTrackerLayout';
import { WardrobePage } from './components/wardrobe/WardrobePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

type ViewType = 'home' | 'expenses' | 'wardrobe' | 'login' | 'register';

const getInitialRoute = (): {
  view: ViewType;
  expenseSubView: ExpenseSubView;
} => {
  const path = window.location.pathname;

  if (path === '/expenses/add') {
    return { view: 'expenses', expenseSubView: 'add' };
  }

  if (path === '/expenses/history') {
    return { view: 'expenses', expenseSubView: 'history' };
  }

  if (path === '/expenses/weekly') {
    return { view: 'expenses', expenseSubView: 'weekly' };
  }

  if (path === '/expenses/monthly') {
    return { view: 'expenses', expenseSubView: 'monthly' };
  }

  if (path === '/expenses') {
    return { view: 'expenses', expenseSubView: 'dashboard' };
  }

  if (path === '/wardrobe') {
    return { view: 'wardrobe', expenseSubView: 'dashboard' };
  }

  if (path === '/login') {
    return { view: 'login', expenseSubView: 'dashboard' };
  }

  if (path === '/register') {
    return { view: 'register', expenseSubView: 'dashboard' };
  }

  return { view: 'home', expenseSubView: 'dashboard' };
};

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const initialRoute = getInitialRoute();

  const [currentView, setCurrentView] =
    useState<ViewType>(initialRoute.view);

  const [expenseSubView, setExpenseSubView] =
    useState<ExpenseSubView>(initialRoute.expenseSubView);

  const updateUrl = (path: string) => {
    window.history.pushState({}, '', path);
  };

  const handleNavigate = (view: string) => {
    if (view === 'expenses' || view === 'expense-tracker') {
      setCurrentView('expenses');
      setExpenseSubView('dashboard');
      updateUrl('/expenses');

    } else if (view === 'wardrobe') {
      setCurrentView('wardrobe');
      updateUrl('/wardrobe');

    } else if (view === 'login') {
      setCurrentView('login');
      updateUrl('/login');

    } else if (view === 'register') {
      setCurrentView('register');
      updateUrl('/register');

    } else {
      setCurrentView('home');
      updateUrl('/');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddExpense = () => {
    setCurrentView('expenses');
    setExpenseSubView('add');
    updateUrl('/expenses/add');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">

      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAddExpense={
          currentView !== 'login' && currentView !== 'register'
            ? handleOpenAddExpense
            : undefined
        }
      />

      <main className="flex-1">

        {currentView === 'home' && (
          <HomePage
            onNavigateModule={(modId) => {
              if (modId === 'expense-tracker') {
                setCurrentView('expenses');
                setExpenseSubView('dashboard');
                updateUrl('/expenses');

              } else if (modId === 'wardrobe') {
                setCurrentView('wardrobe');
                updateUrl('/wardrobe');

              } else {
                setCurrentView('home');
                updateUrl('/');
              }
            }}
            onOpenAddExpense={handleOpenAddExpense}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseTrackerLayout
            key={expenseSubView}
            initialSubView={expenseSubView}
            onBackHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'wardrobe' && (
          <WardrobePage
            onBackHome={() => handleNavigate('home')}
            onOpenExpenses={() => {
              setCurrentView('expenses');
              setExpenseSubView('dashboard');
              updateUrl('/expenses');
            }}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onSuccess={() => handleNavigate('home')}
            onNavigateRegister={() => handleNavigate('register')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onSuccess={() => handleNavigate('home')}
            onNavigateLogin={() => handleNavigate('login')}
          />
        )}

      </main>

      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">
              Personal Management
            </span>
            <span aria-hidden="true">·</span>
            <span>REST API Ready Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">

            <button
              onClick={() => handleNavigate('home')}
              className="hover:text-white transition-colors"
            >
              Overview
            </button>

            <button
              onClick={() => handleNavigate('expenses')}
              className="hover:text-white transition-colors"
            >
              Expense Tracker
            </button>

            <button
              onClick={() => handleNavigate('wardrobe')}
              className="hover:text-white transition-colors"
            >
              Wardrobe
            </button>

          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BackendStatusProvider>
        <ExpenseProvider>
          <MainAppContent />
        </ExpenseProvider>
      </BackendStatusProvider>
    </AuthProvider>
  );
}