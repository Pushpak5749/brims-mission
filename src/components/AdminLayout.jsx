import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, true = yes, false = no
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [currentUser]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-error text-5xl">refresh</span>
      </div>
    );
  }

  if (!isAdmin) {
    // Kick them out to admin login if they aren't authorized
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-outline-variant p-6 flex flex-col shrink-0 min-h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-error/10 text-error rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <h1 className="font-title-md font-bold text-on-surface">Admin Console</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => navigate('/admin/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 bg-error text-white rounded-xl font-bold transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container rounded-xl font-bold text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">group</span>
            Manage Users
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container rounded-xl font-bold text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">work</span>
            Manage Jobs
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container rounded-xl font-bold text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">gavel</span>
            Disputes & Reports
          </button>
        </nav>
        
        <div className="mt-auto border-t border-outline-variant pt-6">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 border border-error text-error rounded-xl font-bold hover:bg-error/5 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
