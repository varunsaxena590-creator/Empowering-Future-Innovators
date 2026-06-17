/**
 * @file context/ThemeContext.js
 * @description Dark/Light theme toggle context.
 *
 * Provides:
 *   - theme       — Current theme string ('dark' or 'light')
 *   - toggleTheme  — Switch between dark and light mode
 *   - isDark       — Boolean shortcut
 *
 * Persists to localStorage key 'zorvex-theme'. Default: dark.
 * Sets data-theme attribute on <html> for CSS variable switching.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('zorvex-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zorvex-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
