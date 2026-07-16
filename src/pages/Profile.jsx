import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import ProfileInfoModal from '../components/ProfileInfoModal';
import StudentProfileEditor from '../components/StudentProfileEditor';
import RecruiterProfileEditor from '../components/RecruiterProfileEditor';
import Landing from './Landing';

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
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // Redirect hirers to their dashboard or onboarding
  useEffect(() => {
    if (currentUser) {
      if (currentUser.status === 'hiring') {
        if (!currentUser.verificationStatus) {
          navigate('/hirer/onboarding', { replace: true });
        } else {
          navigate('/hirer/dashboard', { replace: true });
        }
      } else if (currentUser.status === 'searching') {
        if (!currentUser.onboardingComplete) {
          navigate('/student/onboarding', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    }
  }, [currentUser, navigate]);

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

  const handleStatusChange = (newStatus) => {
    if (newStatus === profileData.status) return; // No change
    
    if (isOnCooldown) {
      setStatusError(`You can change your status again in ${cooldownDays} day(s).`);
      return;
    }
    
    setStatusError("");
    setPendingStatus(newStatus);
    setShowStatusConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    try {
      await handleSaveProfileInfo({ ...profileData, status: pendingStatus });
      setShowStatusConfirmModal(false);
      setPendingStatus(null);
    } catch (e) {
      if (e.message === "COOLDOWN_ACTIVE") {
        setStatusError("You can only change your status once a week.");
      }
      setShowStatusConfirmModal(false);
      setPendingStatus(null);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Fix for legacy default status: if it's 'searching' but they never explicitly updated it, reset it to '' locally
    const effectiveStatus = (currentUser.status === 'searching' && !currentUser.statusLastUpdated) 
      ? '' 
      : (currentUser.status || '');

    setProfileData({
      name: currentUser.displayName || 'Demo User',
      role: currentUser.role || 'Aspiring Professional',
      location: currentUser.location || 'United States',
      university: currentUser.university || 'University',
      skills: currentUser.skills || ['Communication', 'Teamwork'],
      jobPosts: currentUser.jobPosts || [],
      about: currentUser.about || '',
      experience: currentUser.experience || [],
      projects: currentUser.projects || [],
      resumeUrl: currentUser.resumeUrl || null,
      resumeName: currentUser.resumeName || null,
      status: effectiveStatus
    });
  }, [currentUser, navigate]);

  const handleSaveProfileInfo = async (newData) => {
    // 1. Update local state for immediate re-render
    setProfileData(prev => ({ ...prev, ...newData }));
    // 2. Persist using Context method
    await updateProfileInfo(newData);
  };

  if (!currentUser) {
    return <Landing />;
  }

  return (
    <div className="pt-20 pb-24 md:pb-8 min-h-screen container mx-auto max-w-[1000px] px-margin-mobile md:px-margin-desktop">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Main Profile Column */}
        <div className="lg:col-span-8 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm"
          >
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary via-[#005582] to-secondary relative">
              <button className="absolute top-4 right-4 bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            
            {/* Status Confirmation Modal */}
            <AnimatePresence>
              {showStatusConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
                  >
                    <div className="p-6">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="material-symbols-outlined text-2xl">warning</span>
                      </div>
                      <h2 className="font-headline-sm font-bold text-on-surface text-center mb-2">Confirm Status Change</h2>
                      <p className="text-body-md text-on-surface-variant text-center mb-6">
                        Are you sure you want to change your status to <strong>{pendingStatus === 'searching' ? 'Searching for Job' : 'Actively Hiring'}</strong>?<br/><br/>
                        Once confirmed, this status will be locked and you will not be able to change it again for <strong>7 days</strong>.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setShowStatusConfirmModal(false); setPendingStatus(null); }}
                          className="flex-1 px-4 py-2 rounded-full border border-outline font-label-md text-on-surface-variant hover:bg-surface-container-lowest transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={confirmStatusChange}
                          className="flex-1 px-4 py-2 rounded-full bg-primary font-label-md text-white hover:bg-primary/90 transition-colors"
                        >
                          Confirm & Lock
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            
            {/* Profile Header Details */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-start">
                <div 
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-surface shadow-md -mt-16 relative group cursor-pointer"
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
                  <h1 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    {profileData.name}
                    <span className="text-body-sm font-normal text-on-surface-variant px-2 bg-surface-container rounded-full">He/Him</span>
                  </h1>
                  <p className="font-body-lg text-on-surface mt-1 max-w-md">{profileData.role}</p>
                  <p className="font-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                    {profileData.location} <span className="font-bold text-primary mx-1">·</span> 
                    <a href="#" className="font-bold text-primary hover:underline">Contact info</a>
                  </p>
                  <p className="font-label-md text-primary mt-2 font-bold hover:underline cursor-pointer">
                    {profileData.connections?.length || 0} connection{profileData.connections?.length !== 1 ? 's' : ''}
                  </p>
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
                  <p className="text-[12px] text-outline mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Status locked for {cooldownDays} more day(s)
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {profileData.status && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className={`border rounded-xl p-6 shadow-sm relative overflow-hidden group ${profileData.status === 'searching' ? 'bg-blue-50/50 border-primary/20' : 'bg-green-50/50 border-green-600/20'}`}
            >
              <h2 className={`font-label-lg font-bold mb-1 ${profileData.status === 'searching' ? 'text-primary' : 'text-[#2E7D32]'}`}>
                {profileData.status === 'searching' ? 'Open to work' : 'Actively Hiring'}
              </h2>
              <p className="text-body-sm text-on-surface">
                {profileData.status === 'searching' 
                  ? 'Your profile will be shown in the Discover page to recruiters.' 
                  : 'Your profile will be shown in the Network page for students to find.'}
              </p>
            </motion.div>
          )}

          {profileData.status === 'searching' && (
            <StudentProfileEditor 
              profileData={profileData} 
              handleSaveProfileInfo={handleSaveProfileInfo} 
            />
          )}

          {profileData.status === 'hiring' && (
            <RecruiterProfileEditor
              profileData={profileData}
              handleSaveProfileInfo={handleSaveProfileInfo}
            />
          )}
        </div>

        {/* Sidebar Right Column */}
        <div className="hidden lg:block lg:col-span-4 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
              <h3 className="font-label-md font-bold text-on-surface">Profile Language</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">edit</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
              <div>
                <h3 className="font-label-md font-bold text-on-surface">Public profile & URL</h3>
                <p className="text-body-sm text-on-surface-variant mt-1 truncate max-w-[200px]">www.brimsmission.com/in/{profileData.name.toLowerCase().replace(/\s+/g, '-')}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">edit</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm"
          >
            <h3 className="font-headline-sm font-bold text-on-surface mb-4">Who your viewers also viewed</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff" alt="User" />
                </div>
                <div>
                  <h4 className="font-label-md font-bold text-on-surface hover:text-primary hover:underline cursor-pointer">Jane Doe</h4>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">Founder in the IT Services and IT Consulting industry...</p>
                  <button className="mt-2 border border-outline-variant text-on-surface-variant font-label-md px-4 py-1 rounded-full hover:bg-surface-container-low transition-colors">
                    View
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Sam+Smith&background=E53935&color=fff" alt="User" />
                </div>
                <div>
                  <h4 className="font-label-md font-bold text-on-surface hover:text-primary hover:underline cursor-pointer">Sam Smith</h4>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">Someone in the Graphic Design industry from...</p>
                  <button className="mt-2 border border-outline-variant text-on-surface-variant font-label-md px-4 py-1 rounded-full hover:bg-surface-container-low transition-colors">
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
