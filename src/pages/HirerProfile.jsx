import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HirerProfile() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-on-surface">
      <h1 className="font-display-sm mb-6">Company Profile</h1>
      
      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden">
        
        {/* Verification Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {profileData?.verificationStatus === 'verified' ? (
            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">verified</span> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">pending</span> Pending Verification
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-2xl bg-surface-container-high border border-outline flex items-center justify-center shrink-0">
            {profileData?.logoUrl ? (
              <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-outline-variant">domain</span>
            )}
          </div>
          
          <div className="flex-1 w-full">
            <h2 className="font-display-sm text-primary mb-1">{profileData?.companyName || 'Company Name'}</h2>
            <p className="text-body-lg text-on-surface-variant font-medium mb-6">{profileData?.industryType || 'Industry'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Company Email</p>
                <p className="font-body-md text-on-surface">{profileData?.companyEmail || '-'}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">HR Contact</p>
                <p className="font-body-md text-on-surface">{profileData?.hrContact || '-'}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Website</p>
                <p className="font-body-md text-primary hover:underline">
                  <a href={profileData?.website} target="_blank" rel="noreferrer">{profileData?.website || '-'}</a>
                </p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">GST Number</p>
                <p className="font-body-md text-on-surface">{profileData?.gstNumber || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Registered Address</p>
                <p className="font-body-md text-on-surface">{profileData?.address || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant flex justify-end">
          <button className="px-6 py-2 border border-outline-variant rounded-full font-label-md hover:bg-surface-container-low transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
