import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';

const translations = { en, ar };

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type Language = 'en' | 'ar';

interface AppContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = useCallback((keyPath: string) => {
    const keys = keyPath.split('.');
    let value: any = translations[language];
    for (const key of keys) {
      if (value[key] === undefined) return keyPath;
      value = value[key];
    }
    return value as string;
  }, [language]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      activeModule,
      setActiveModule,
      toasts,
      addToast,
      removeToast,
      sidebarOpen,
      setSidebarOpen,
      language,
      setLanguage,
      t,
      dir,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
