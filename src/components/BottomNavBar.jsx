import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNavBar() {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const navItems = currentUser 
    ? [
        { path: currentUser.status === 'hiring' ? '/hirer/dashboard' : (currentUser.status === 'searching' ? '/student/dashboard' : '/'), icon: 'dashboard', label: 'Dashboard' },
        { path: '/discover', icon: 'explore', label: 'Discover' },
        { path: '/network', icon: 'group', label: 'Network' },
        { path: '/jobs', icon: 'work', label: 'Jobs' }
      ]
    : [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/jobs', icon: 'work', label: 'Jobs' },
        { path: '/internships', icon: 'school', label: 'Interns' },
        { path: '/companies', icon: 'domain', label: 'Companies' }
      ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant shadow-lg flex justify-around items-center h-20 md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.label}
            to={item.path} 
            className={`flex flex-col items-center justify-center rounded-full px-2 py-1 active:scale-95 transition-all duration-200 ${
              isActive 
                ? 'bg-primary-container text-on-primary-container' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
