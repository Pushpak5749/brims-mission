import React from 'react';
import { Outlet } from 'react-router-dom';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <AnimatePresence mode="wait">
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <BottomNavBar />
    </div>
  );
}
