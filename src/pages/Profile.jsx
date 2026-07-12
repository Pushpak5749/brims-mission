import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import ProfileInfoModal from '../components/ProfileInfoModal';

export default function Profile() {
  const { currentUser, updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    location: '',
    university: '',
    skills: []
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [statusError, setStatusError] = useState("");

  // Calculate cooldown
  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  let isOnCooldown = false;
  let cooldownDays = 0;
  
  if (currentUser && currentUser.statusLastUpdated) {
    const timeSinceUpdate = now - currentUser.statusLastUpdated;
    if (timeSinceUpdate < oneWeekMs) {
      isOnCooldown = true;
      cooldownDays = Math.ceil((oneWeekMs - timeSinceUpdate) / (1000 * 60 * 60 * 24));
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (newStatus === profileData.status) return; // No change
    
    if (isOnCooldown) {
      setStatusError(`You can change your status again in ${cooldownDays} day(s).`);
      return;
    }
    
    setStatusError("");
    try {
      await handleSaveProfileInfo({ ...profileData, status: newStatus });
    } catch (e) {
      if (e.message === "COOLDOWN_ACTIVE") {
        setStatusError("You can only change your status once a week.");
      }
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setProfileData({
      name: currentUser.displayName || 'Demo User',
      role: currentUser.role || 'Aspiring Professional',
      location: currentUser.location || 'United States',
      university: currentUser.university || 'University',
      skills: currentUser.skills || ['Communication', 'Teamwork'],
      status: currentUser.status || 'searching'
    });
  }, [currentUser, navigate]);

  const handleSaveProfileInfo = (newData) => {
    // 1. Update local state for immediate re-render
    setProfileData(prev => ({ ...prev, ...newData }));
    // 2. Persist using Context method
    updateProfileInfo(newData);
  };

  if (!currentUser) return null;

  return (
    <div className="pt-20 pb-24 md:pb-8 min-h-screen container mx-auto max-w-[1000px] px-margin-mobile md:px-margin-desktop">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Main Profile Column */}
        <div className="lg:col-span-8 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm"
          >
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary via-[#005582] to-secondary relative">
              <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            
            {/* Profile Header Details */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-start">
                <div 
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-surface shadow-md -mt-16 relative group cursor-pointer"
                >
                  <img 
                    className="w-full h-full object-cover" 
                    src={currentUser.photoURL || "https://ui-avatars.com/api/?name=User"} 
                    alt="Profile" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="font-headline-md text-headline-md font-bold text-gray-900 flex items-center gap-2">
                    {profileData.name}
                    <span className="text-body-sm font-normal text-on-surface-variant px-2 bg-surface-container rounded-full">He/Him</span>
                  </h1>
                  <p className="font-body-lg text-gray-800 mt-1 max-w-md">{profileData.role}</p>
                  <p className="font-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                    {profileData.location} <span className="font-bold text-primary mx-1">·</span> 
                    <a href="#" className="font-bold text-primary hover:underline">Contact info</a>
                  </p>
                  <p className="font-label-md text-primary mt-2 font-bold hover:underline cursor-pointer">500+ connections</p>
                </div>
                
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex items-center gap-2 text-on-surface hover:text-primary hover:underline cursor-pointer">
                    <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">school</span>
                    </div>
                    <span className="font-label-sm font-bold">{profileData.university}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleStatusChange('searching')}
                    className={`font-label-md px-5 py-2 rounded-full transition-colors shadow-sm flex items-center gap-2 ${profileData.status === 'searching' ? 'bg-primary text-white border-2 border-primary' : 'bg-surface border-2 border-outline text-on-surface-variant hover:bg-surface-container-low'} ${isOnCooldown && profileData.status !== 'searching' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Searching for Job
                  </button>
                  <button 
                    onClick={() => handleStatusChange('hiring')}
                    className={`font-label-md px-5 py-2 rounded-full transition-colors shadow-sm flex items-center gap-2 ${profileData.status === 'hiring' ? 'bg-[#2E7D32] text-white border-2 border-[#2E7D32]' : 'bg-surface border-2 border-outline text-on-surface-variant hover:bg-surface-container-low'} ${isOnCooldown && profileData.status !== 'hiring' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">work</span>
                    I am Hiring
                  </button>
                </div>
                {statusError && (
                  <p className="text-[12px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {statusError}
                  </p>
                )}
                {isOnCooldown && !statusError && (
                  <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Status locked for {cooldownDays} more day(s)
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className={`border rounded-xl p-6 shadow-sm relative overflow-hidden group ${profileData.status === 'searching' ? 'bg-blue-50/50 border-primary/20' : 'bg-green-50/50 border-green-600/20'}`}
          >
            <h2 className={`font-label-lg font-bold mb-1 ${profileData.status === 'searching' ? 'text-primary' : 'text-[#2E7D32]'}`}>
              {profileData.status === 'searching' ? 'Open to work' : 'Actively Hiring'}
            </h2>
            <p className="text-body-sm text-gray-800">
              {profileData.status === 'searching' 
                ? 'Your profile will be shown in the Discover page to recruiters.' 
                : 'Your profile will be shown in the Network page for students to find.'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
          >
            <h2 className="font-headline-sm font-bold text-gray-900 mb-4">Suggested for you</h2>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mb-4">
              <span className="material-symbols-outlined text-[16px]">visibility</span> Private to you
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-outline-variant rounded-lg p-4 flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-secondary text-2xl">stars</span>
                </div>
                <div>
                  <h3 className="font-label-md font-bold text-gray-900">Stand out to employers</h3>
                  <p className="text-body-sm text-gray-600 mt-1">Enhance your profile, craft standout messages, and assess job fit.</p>
                </div>
              </div>
              <div className="border border-outline-variant rounded-lg p-4 flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary text-2xl">magnet</span>
                </div>
                <div>
                  <h3 className="font-label-md font-bold text-gray-900">Connect with people</h3>
                  <p className="text-body-sm text-gray-600 mt-1">Connect with alumni to achieve your career goals faster.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Right Column */}
        <div className="hidden lg:block lg:col-span-4 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
              <h3 className="font-label-md font-bold text-gray-900">Profile Language</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">edit</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
              <div>
                <h3 className="font-label-md font-bold text-gray-900">Public profile & URL</h3>
                <p className="text-body-sm text-on-surface-variant mt-1 truncate max-w-[200px]">www.brimsmission.com/in/{profileData.name.toLowerCase().replace(/\s+/g, '-')}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">edit</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm"
          >
            <h3 className="font-headline-sm font-bold text-gray-900 mb-4">Who your viewers also viewed</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff" alt="User" />
                </div>
                <div>
                  <h4 className="font-label-md font-bold text-gray-900 hover:text-primary hover:underline cursor-pointer">Jane Doe</h4>
                  <p className="text-body-sm text-gray-600 line-clamp-2">Founder in the IT Services and IT Consulting industry...</p>
                  <button className="mt-2 border border-outline-variant text-gray-700 font-label-md px-4 py-1 rounded-full hover:bg-surface-container-low transition-colors">
                    View
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Sam+Smith&background=E53935&color=fff" alt="User" />
                </div>
                <div>
                  <h4 className="font-label-md font-bold text-gray-900 hover:text-primary hover:underline cursor-pointer">Sam Smith</h4>
                  <p className="text-body-sm text-gray-600 line-clamp-2">Someone in the Graphic Design industry from...</p>
                  <button className="mt-2 border border-outline-variant text-gray-700 font-label-md px-4 py-1 rounded-full hover:bg-surface-container-low transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
      
      <ProfilePhotoModal 
        isOpen={isPhotoModalOpen} 
        onClose={() => setIsPhotoModalOpen(false)} 
      />

      <ProfileInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)}
        initialData={profileData}
        onSave={handleSaveProfileInfo}
      />
    </div>
  );
}
