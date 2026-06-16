import { createContext, useContext } from 'react';
import { useTheme as useThemeHook } from '@/hooks/useTheme';

type Theme = 'light' | 'dark';
type ThemeMode = Theme | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  mode: 'system',
  toggleTheme: () => {},
  isDark: false
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, mode, toggleTheme, isDark } = useThemeHook();
  
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};