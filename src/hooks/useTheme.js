import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('data-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    // Force style recalc
    document.documentElement.classList.add('recalc');
    setTimeout(() => document.documentElement.classList.remove('recalc'), 1);
  }, [theme]);

  const toggleTheme = (newTheme) => setTheme(newTheme);

  const themes = [
    { id: 'dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
  ];

  return { theme, toggleTheme, themes };
}