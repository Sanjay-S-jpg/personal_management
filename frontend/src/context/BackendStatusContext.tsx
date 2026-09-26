import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl } from '../services/apiClient';
import { expenseService } from '../services/expenseService';

interface BackendStatusContextType {
  baseUrl: string;
  isBackendConnected: boolean;
  isChecking: boolean;
  updateBaseUrl: (newUrl: string) => Promise<boolean>;
  checkConnection: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(undefined);

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseUrl, setBaseUrlState] = useState<string>(getApiBaseUrl());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkConnection = async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const ok = await expenseService.testBackendConnection();
      setIsBackendConnected(ok);
      setIsChecking(false);
      return ok;
    } catch {
      setIsBackendConnected(false);
      setIsChecking(false);
      return false;
    }
  };

  const updateBaseUrl = async (newUrl: string): Promise<boolean> => {
    setApiBaseUrl(newUrl);
    setBaseUrlState(newUrl);
    return await checkConnection();
  };

  useEffect(() => {
    // Initial silent check
    checkConnection();
  }, []);

  return (
    <BackendStatusContext.Provider
      value={{
        baseUrl,
        isBackendConnected,
        isChecking,
        updateBaseUrl,
        checkConnection,
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = (): BackendStatusContextType => {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error('useBackendStatus must be used within BackendStatusProvider');
  }
  return context;
};
