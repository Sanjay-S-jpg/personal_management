import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { BackendConfigModal } from './BackendConfigModal';
import { LogOut, Server, User, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAddExpense?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAddExpense }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isBackendConnected } = useBackendStatus();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap text-left"
          >
            Personal Management
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors whitespace-nowrap ${
                currentView === 'home'
                  ? 'text-indigo-400 font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('expenses')}
              className={`transition-colors whitespace-nowrap ${
                currentView.startsWith('expense')
                  ? 'text-indigo-400 font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Expense Tracker
            </button>
            <button
              onClick={() => onNavigate('wardrobe')}
              className={`transition-colors whitespace-nowrap ${
                currentView === 'wardrobe'
                  ? 'text-indigo-400 font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Wardrobe
            </button>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="text-neutral-400 hover:text-neutral-200 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Backend API</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-400' : 'bg-neutral-500'
                }`}
                title={isBackendConnected ? 'Connected to Spring Boot' : 'Standalone Preview Mode'}
              />
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {onOpenAddExpense && (
              <button
                onClick={onOpenAddExpense}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Expense
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="truncate max-w-[120px] font-medium">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 text-xs font-medium bg-neutral-900">
          <button
            onClick={() => onNavigate('home')}
            className={`py-1 px-2 rounded ${
              currentView === 'home' ? 'text-indigo-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('expenses')}
            className={`py-1 px-2 rounded ${
              currentView.startsWith('expense') ? 'text-indigo-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => onNavigate('wardrobe')}
            className={`py-1 px-2 rounded ${
              currentView === 'wardrobe' ? 'text-indigo-400 font-semibold' : 'text-neutral-400'
            }`}
          >
            Wardrobe
          </button>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="py-1 px-2 text-neutral-400 flex items-center gap-1"
          >
            <Server className="w-3 h-3" />
            <span>API</span>
          </button>
        </div>
      </header>

      <BackendConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </>
  );
};
