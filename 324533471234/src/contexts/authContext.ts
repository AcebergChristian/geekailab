import { createContext } from "react";

// Types
export type Theme = 'light' | 'dark';
export type Language = 'zh' | 'en';

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
});

// Translation interface
export interface TranslationDictionary {[key: string]: {
    [key: string]: string;
  };
}