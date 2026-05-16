"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'zh' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries = {
  zh: {
    'search.placeholder': '搜索...',
    'search.internal': '站内搜索',
    'admin.login': '管理员登录',
    'admin.dashboard': '控制台',
    'admin.username': '用户名',
    'admin.password': '密码',
    'admin.submit': '登录',
  },
  en: {
    'search.placeholder': 'Search...',
    'search.internal': 'Internal Search',
    'admin.login': 'Admin Login',
    'admin.dashboard': 'Dashboard',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.submit': 'Login',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let val: any = dictionaries[language];
    for (const k of keys) {
      if (val === undefined) break;
      val = val[k];
    }
    return val || key; // Fallback to key if not found
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
