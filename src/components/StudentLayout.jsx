import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import TopAppBar from './TopAppBar';
import MessagingOverlay from './MessagingOverlay';
import BottomNavBar from './BottomNavBar';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
    { name: 'My Profile', path: '/student/profile', icon: 'person' },
    { name: 'My Applications', path: '/student/applications', icon: 'work_history' },
    { name: 'Saved Jobs', path: '/student/saved', icon: 'bookmark' },
    { name: 'Resume & Certs', path: '/student/resume', icon: 'description' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar />
      
      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface-container-lowest border-r border-outline-variant h-[calc(100vh-64px)] sticky top-16 z-10">
          <div className="p-6 pb-2">
            <h2 className="font-title-sm font-bold text-on-surface-variant uppercase tracking-wider">Student Portal</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label-md font-bold">{link.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-[150px] right-4 z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-[100] bg-black/50 flex">
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="w-64 bg-surface-container-lowest h-full shadow-2xl flex flex-col"
              >
                <div className="p-4 flex justify-between items-center border-b border-outline-variant">
                  <h2 className="font-title-sm font-bold text-on-surface-variant uppercase tracking-wider">Student Portal</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-container-low">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === link.path
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined">{link.icon}</span>
                      <span className="font-label-md font-bold">{link.name}</span>
                    </Link>
                  ))}
                </nav>
              </motion.aside>
              <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 md:p-8 pb-32 md:pb-8"
              className="p-4 md:p-8 pb-24 md:pb-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <MessagingOverlay />
      <BottomNavBar />
    </div>
  );
}
