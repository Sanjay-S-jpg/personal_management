import React, { useState } from 'react';
import { Modal } from './Modal';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { mockBackend } from '../../services/mockBackend';
import { CheckCircle2, XCircle, RefreshCw, Server, ShieldCheck, Database, Key } from 'lucide-react';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({ isOpen, onClose }) => {
  const { baseUrl, isBackendConnected, isChecking, updateBaseUrl, checkConnection } = useBackendStatus();
  const { token, user } = useAuth();
  const { refreshExpenses } = useExpenses();
  const [inputUrl, setInputUrl] = useState(baseUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBaseUrl(inputUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetData = () => {
    mockBackend.resetToDefaults();
    refreshExpenses();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Spring Boot Backend Integration" maxWidth="lg">
      <div className="space-y-6 text-sm text-neutral-300">
        {/* Status banner */}
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${
          isBackendConnected 
            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300' 
            : 'bg-neutral-800/40 border-neutral-700/60 text-neutral-300'
        }`}>
          {isBackendConnected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Server className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-semibold text-neutral-100 flex items-center gap-2">
              {isBackendConnected ? 'Connected to Spring Boot API' : 'Standalone Visual Preview Mode'}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {isBackendConnected
                ? `Active REST connection to Spring Boot backend at ${baseUrl}. Requests include Bearer JWT header.`
                : `Spring Boot backend is not currently detected at ${baseUrl}. The app is running with an isolated local repository so all features (add, edit, delete, analytics) are fully testable right now.`}
            </p>
          </div>
        </div>

        {/* Base URL Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Backend API Base URL (VITE_API_BASE_URL)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="http://localhost:8080"
              className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => checkConnection()}
              disabled={isChecking}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              Test Ping
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Save URL
            </button>
          </div>
          {saveSuccess && (
            <p className="text-xs text-emerald-400">API Base URL updated and tested.</p>
          )}
        </form>

        {/* Security & Auth State */}
        <div className="border-t border-neutral-800 pt-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            JWT Authentication State
          </h4>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Authenticated User:</span>
              <span className="text-neutral-200">{user?.email || 'Guest / None'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">JWT Token:</span>
              <span className="text-neutral-300 truncate max-w-[260px]">
                {token ? `${token.substring(0, 18)}...` : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Header Format:</span>
              <span className="text-neutral-400">Authorization: Bearer &lt;token&gt;</span>
            </div>
          </div>
        </div>

        {/* Reset Mock Data for Testing */}
        <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-neutral-200 text-xs">Reset Demo Dataset</div>
            <div className="text-xs text-neutral-500">Restores initial sample expenses for testing</div>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors"
          >
            {resetSuccess ? 'Reset Complete!' : 'Reset Demo Data'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
