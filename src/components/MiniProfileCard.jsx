import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function MiniProfileCard({ extraLinks = null }) {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: 'Demo User',
    role: 'Aspiring Professional',
    role: 'Aspiring Professional',
    university: 'University',
  });
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    
    // Listen for live profile views
    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfileViews(docSnap.data().profileViews || 0);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const portfolios = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
      const userPortfolio = portfolios.find(p => p.name === currentUser.displayName);
      
      if (userPortfolio) {
        setProfileData({
          name: userPortfolio.name,
          role: userPortfolio.role,
          university: 'VIT Bhopal University',
        });
      } else {
        setProfileData({
          name: currentUser.displayName || 'Demo User',
          role: 'Aspiring Professional',
          university: 'VIT Bhopal University',
        });
      }
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      {/* Identity Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm relative text-center">
        <div className="h-16 bg-gradient-to-r from-primary via-[#005582] to-secondary"></div>
        <Link to="/">
          <div className="w-16 h-16 rounded-full border-2 border-surface-container-lowest overflow-hidden bg-surface mx-auto -mt-10 mb-3 cursor-pointer">
            <img 
              className="w-full h-full object-cover" 
              src={currentUser.photoURL || "https://ui-avatars.com/api/?name=User"} 
              alt="Profile" 
            />
          </div>
        </Link>
        <div className="px-4 pb-4">
          <Link to="/" className="hover:underline">
            <h2 className="font-label-md font-bold text-on-surface">{profileData.name}</h2>
          </Link>
          <p className="text-[12px] text-outline mt-1 line-clamp-2">{profileData.role} || {profileData.university}</p>
        </div>
        <div className="border-t border-outline-variant py-3 px-4 text-left">
          <div className="flex justify-between items-center text-[12px] font-bold text-on-surface-variant mb-1 hover:bg-surface-container-low cursor-pointer p-1 -mx-1 rounded transition-colors">
            <span>Profile viewers</span>
            <span className="text-primary">{profileViews}</span>
          </div>
        </div>
      </div>
      
      {/* Optional extra sidebar links injected per-page (e.g., Jobs page) */}
      {extraLinks && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm p-2">
          {extraLinks}
        </div>
      )}
    </div>
  );
}
