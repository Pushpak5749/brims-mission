import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function TopAppBar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16">
      <div className="flex items-center gap-4">
        <Link to="/">
          <h1 className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">Brims Mission</h1>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/discover" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Discover</Link>
        <Link to="/network" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Network</Link>
        <Link to="/jobs" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Jobs</Link>
      </div>


      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus:outline-none flex items-center justify-center"
          aria-label="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDarkMode ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-3 relative ml-1" ref={menuRef}>
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="font-label-md text-on-surface font-medium leading-tight">{currentUser.displayName}</span>
              <span className="text-[10px] uppercase font-bold text-primary mt-0.5">
                {!currentUser.status || currentUser.status === 'searching' ? 'OPEN TO WORK' : 'HIRING'}
              </span>
            </div>
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity cursor-pointer relative"
            >
              <img 
                className="w-full h-full object-cover" 
                src={currentUser.photoURL || "https://ui-avatars.com/api/?name=User"}
                alt="Profile" 
              />
            </div>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-14 right-0 bg-surface-container-lowest shadow-lg border border-outline-variant rounded-xl p-2 z-[100] min-w-[150px]"
                >
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors block mb-1"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }} 
                    className="w-full text-left px-4 py-2 text-label-md text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link to="/login" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity bg-surface-container-high flex items-center justify-center ml-2" title="Go to Login Page">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </Link>
        )}
      </div>
    </header>
  );
}
