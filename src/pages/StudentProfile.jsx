import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import StudentProfileEditor from '../components/StudentProfileEditor';
import ProfilePhotoModal from '../components/ProfilePhotoModal';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData({ uid: currentUser.uid, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSaveProfileInfo = async (updatedData) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, updatedData);
      setProfileData(updatedData);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-on-surface">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display-sm">Profile Management</h1>
        <a 
          href={`/profile/view/${currentUser.uid}`} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-full text-primary hover:bg-surface-container-low transition-colors font-label-md font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          View Public Profile
        </a>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <div 
            className="relative group shrink-0 cursor-pointer"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            <img 
              src={currentUser?.photoURL || profileData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || 'User')}`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-md"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display-sm mb-1">{profileData?.name}</h2>
            <p className="text-body-lg text-on-surface-variant mb-3">{profileData?.email}</p>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full">
              Job Searcher
            </div>
          </div>
        </div>

        <h3 className="font-title-lg font-bold mb-4 border-t border-outline-variant pt-6">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Full Name</p>
            <p className="font-label-lg font-bold">{profileData?.name}</p>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
            <p className="font-label-lg font-bold">{profileData?.email}</p>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Mobile</p>
            <p className="font-label-lg font-bold">{profileData?.mobile || 'Not set'}</p>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Location</p>
            <p className="font-label-lg font-bold">{profileData?.address || 'Not set'}</p>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">LinkedIn</p>
            <p className="font-label-lg font-bold text-primary truncate hover:underline cursor-pointer">
              {profileData?.linkedin || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Portfolio</p>
            <p className="font-label-lg font-bold text-primary truncate hover:underline cursor-pointer">
              {profileData?.portfolio || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <StudentProfileEditor 
          profileData={profileData} 
          handleSaveProfileInfo={handleSaveProfileInfo} 
        />
      </div>
      
      <ProfilePhotoModal 
        isOpen={isPhotoModalOpen} 
        onClose={() => setIsPhotoModalOpen(false)} 
      />
    </div>
  );
}
