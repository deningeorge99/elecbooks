import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    dark: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  colors: {
    primary: '#d7773e',
    secondary: '#f8f9fa',
    accent: '#343a40',
    light: '#ffffff',
    dark: '#212529',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
  },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    colors: {
      primary: '#d7773e',
      secondary: '#f8f9fa',
      accent: '#343a40',
      light: '#ffffff',
      dark: '#212529',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};