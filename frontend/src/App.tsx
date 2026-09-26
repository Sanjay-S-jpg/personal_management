import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BackendStatusProvider } from './context/BackendStatusContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { Navbar } from './components/common/Navbar';
import { HomePage } from './components/home/HomePage';
import { ExpenseTrackerLayout, ExpenseSubView } from './components/expenses/ExpenseTrackerLayout';
import { WardrobePage } from './components/wardrobe/WardrobePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

type ViewType = 'home' | 'expenses' | 'wardrobe' | 'login' | 'register';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [expenseSubView, setExpenseSubView] = useState<ExpenseSubView>('dashboard');

  const handleNavigate = (view: string) => {
    if (view === 'expenses' || view === 'expense-tracker') {
      setCurrentView('expenses');
      setExpenseSubView('dashboard');
    } else if (view === 'wardrobe') {
      setCurrentView('wardrobe');
    } else if (view === 'login') {
      setCurrentView('login');
    } else if (view === 'register') {
      setCurrentView('register');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddExpense = () => {
    setCurrentView('expenses');
    setExpenseSubView('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAddExpense={currentView !== 'login' && currentView !== 'register' ? handleOpenAddExpense : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigateModule={(modId) => {
              if (modId === 'expense-tracker') {
                setCurrentView('expenses');
                setExpenseSubView('dashboard');
              } else if (modId === 'wardrobe') {
                setCurrentView('wardrobe');
              } else {
                // other future modules
                setCurrentView('home');
              }
            }}
            onOpenAddExpense={handleOpenAddExpense}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseTrackerLayout
            key={expenseSubView}
            initialSubView={expenseSubView}
            onBackHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'wardrobe' && (
          <WardrobePage
            onBackHome={() => setCurrentView('home')}
            onOpenExpenses={() => {
              setCurrentView('expenses');
              setExpenseSubView('dashboard');
            }}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentView('home')}
            onNavigateRegister={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onSuccess={() => setCurrentView('home')}
            onNavigateLogin={() => setCurrentView('login')}
          />
        )}
      </main>

      {/* Quiet, Human-Designed Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">Personal Management</span>
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
