import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = Theme | 'system';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('themeMode') as ThemeMode) || 'system';
  });

  const resolveTheme = (m: ThemeMode): Theme => {
    if (m === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return m;
  };

  const [theme, setTheme] = useState<Theme>(() => resolveTheme(mode));

  useEffect(() => {
    if (mode === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mql.addEventListener('change', handler);
      setTheme(mql.matches ? 'dark' : 'light');
      return () => mql.removeEventListener('change', handler);
    } else {
      setTheme(mode);
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return {
    theme,
    mode,
    toggleTheme,
    isDark: theme === 'dark'
  };
}