import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlobalSearch from './GlobalSearch';

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

  let homeLink = "/";
  if (currentUser) {
    if (currentUser.status === 'hiring') {
      homeLink = currentUser.verificationStatus ? "/hirer/dashboard" : "/hirer/onboarding";
    } else if (currentUser.status === 'searching') {
      homeLink = currentUser.onboardingComplete ? "/student/dashboard" : "/student/onboarding";
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 gap-2">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <Link to={homeLink} className="shrink-0">
          <h1 className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight hidden sm:block">Brims Mission</h1>
          <h1 className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight sm:hidden text-xl">BM</h1>
        </Link>
        {currentUser && <GlobalSearch />}
      </div>

      {currentUser ? (
        <div className="hidden md:flex items-center gap-8">
          <Link to="/discover" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Discover</Link>
          <Link to="/network" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Network</Link>
          <Link to="/jobs" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Jobs</Link>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">About</Link>
          <Link to="/jobs" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Jobs</Link>
          <Link to="/internships" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Internships</Link>
          <Link to="/companies" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Companies</Link>
          <Link to="/training" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Training</Link>
          <Link to="/contact" className="text-on-surface-variant hover:text-primary font-bold font-label-md text-label-md transition-colors">Contact</Link>
        </div>
      )}


      
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
                  <div className="border-t border-outline-variant my-1"></div>
                  <div className="px-4 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Explore</div>
                  <Link 
                    to="/internships" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors block"
                  >
                    Internships Portal
                  </Link>
                  <Link 
                    to="/companies" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors block"
                  >
                    Company Directory
                  </Link>
                  <Link 
                    to="/training" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors block"
                  >
                    Career Training
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low rounded-lg transition-colors block mb-1"
                  >
                    About Us
                  </Link>
                  <div className="border-t border-outline-variant my-1"></div>
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
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 rounded-full border border-primary text-primary font-label-md font-bold hover:bg-primary/5 transition-colors hidden sm:block">
              Login
            </Link>
            <Link to="/login" className="px-5 py-2 rounded-full bg-[#f1654c] text-white font-label-md font-bold hover:bg-[#d85842] transition-colors shadow-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
