import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function TopAppBar() {
  const { currentUser, logout } = useAuth();

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


      
      <div className="flex items-center gap-4">

        
        {currentUser ? (
          <div className="flex items-center gap-3 group relative ml-2">
            <span className="hidden md:block font-label-md text-on-surface font-medium">{currentUser.displayName}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                className="w-full h-full object-cover" 
                src={currentUser.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDAQqMhSeEdtunAhQq_OT0BfqkD-AI0iHEt_r9MRfROcNyR6aDuBX1s3JQaWuxwyiF1hG5tFWWJU75lVPITssCppVVdCvAwypLZ0TVeSbEd5QsTjIDHxs5TDeMMz_WnqOQiyR0crSlkeitn-F5OfLmF6lmHxpcQ-cZaLKGmucKuQU5hbGCId1HaqP2ykpbs4MEuPslKWdOaLZU4kdhh9pfGU6heG4gVR00qFxYLiJeI8DtcNtf5U4SYuBsXoV0pZyS62GmH6P2XlKA"}
                alt="Profile" 
              />
            </div>
            <button onClick={logout} className="absolute top-12 right-0 bg-surface shadow-md border border-outline p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-label-sm hover:text-primary whitespace-nowrap z-50">
              Sign Out
            </button>
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
