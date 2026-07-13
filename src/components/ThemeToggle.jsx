import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/30"
      aria-label="Toggle Dark Mode"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-2xl"
        >
          {isDarkMode ? 'dark_mode' : 'light_mode'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
