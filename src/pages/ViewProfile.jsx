import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'searching' && !data.statusLastUpdated) {
            data.status = '';
          }
          setProfileData(data);
        } else {
          setProfileData(null); // User not found
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="pt-20 pb-24 min-h-screen container mx-auto flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">person_off</span>
        <h2 className="font-headline-sm text-gray-900 mb-2">Profile not found</h2>
        <p className="text-body-md text-gray-600 mb-6">This user does not exist or has deleted their account.</p>
        <button onClick={() => navigate(-1)} className="bg-primary text-white px-6 py-2 rounded-full font-label-md">
          Go Back
        </button>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="pt-20 pb-24 md:pb-8 min-h-screen container mx-auto max-w-[1000px] px-margin-mobile md:px-margin-desktop">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 font-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Profile Column */}
        <div className="lg:col-span-8 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm"
          >
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 relative">
            </div>
            
            {/* Profile Header Details */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-start">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-surface shadow-md -mt-16 relative">
                  <img 
                    className="w-full h-full object-cover" 
                    src={profileData.photoURL || "https://ui-avatars.com/api/?name=User"} 
                    alt="Profile" 
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="font-headline-md text-headline-md font-bold text-gray-900 flex items-center gap-2">
                    {profileData.displayName}
                    <span className="text-body-sm font-normal text-on-surface-variant px-2 bg-surface-container rounded-full">He/Him</span>
                  </h1>
                  <p className="font-body-lg text-gray-800 mt-1 max-w-md">{profileData.role}</p>
                  <p className="font-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                    {profileData.location || "Earth"} <span className="font-bold text-primary mx-1">·</span> 
                    <a href="#" className="font-bold text-primary hover:underline">Contact info</a>
                  </p>
                  <p className="font-label-md text-primary mt-2 font-bold hover:underline cursor-pointer">500+ connections</p>
                </div>
                
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex items-center gap-2 text-on-surface hover:text-primary hover:underline cursor-pointer">
                    <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">school</span>
                    </div>
                    <span className="font-label-sm font-bold">{profileData.university || "University"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button className="bg-primary text-white font-label-md px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Connect
                </button>
                <button className="bg-surface border border-primary text-primary font-label-md px-4 py-1.5 rounded-full hover:bg-surface-container-low transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Message
                </button>
                <button className="p-1.5 rounded-full border border-outline hover:bg-surface-container-low text-on-surface-variant transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
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
              <p className="text-body-sm text-gray-800">Greater Delhi Area · On-site · Hybrid · Remote</p>
            </motion.div>
          )}

          {/* About Section */}
          {(profileData.about || profileData.status === 'searching') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <h2 className="font-title-lg font-bold text-gray-900 mb-4">About</h2>
              <p className="text-body-md text-gray-700 leading-relaxed whitespace-pre-line">
                {profileData.about || "This user hasn't added an about section yet."}
              </p>
            </motion.div>
          )}

          {/* Experience Section */}
          {profileData.experience && profileData.experience.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <h2 className="font-title-lg font-bold text-gray-900 mb-4 border-b border-outline-variant pb-3">Experience</h2>
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4 border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center shrink-0 border border-outline-variant shadow-sm">
                      <span className="material-symbols-outlined text-gray-400">domain</span>
                    </div>
                    <div>
                      <h3 className="font-label-lg font-bold text-gray-900">{exp.title}</h3>
                      <p className="font-body-md text-gray-800">{exp.company}</p>
                      <p className="font-body-sm text-gray-500">{exp.duration}</p>
                      {exp.description && <p className="mt-2 text-body-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Section */}
          {profileData.projects && profileData.projects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
              className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <h2 className="font-title-lg font-bold text-gray-900 mb-4 border-b border-outline-variant pb-3">Projects</h2>
              <div className="space-y-6">
                {profileData.projects.map((proj, index) => (
                  <div key={index} className="border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-label-lg font-bold text-gray-900">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-primary hover:underline font-label-sm break-all">
                        {proj.link}
                      </a>
                    )}
                    {proj.description && <p className="mt-2 text-body-sm text-gray-700 whitespace-pre-line leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills Section */}
          {profileData.skills && profileData.skills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <h2 className="font-title-lg font-bold text-gray-900 mb-4 border-b border-outline-variant pb-3">Top Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="px-3 py-1.5 bg-surface-container rounded-lg border border-outline-variant text-body-sm font-medium text-gray-800 flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="hidden lg:block lg:col-span-4 space-y-gutter">
          <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm">
            <h3 className="font-label-lg font-bold text-gray-900 mb-4">People also viewed</h3>
            <div className="space-y-4">
              {/* Mock suggestions */}
              <div className="flex gap-3">
                <img src="https://ui-avatars.com/api/?name=Alex&background=random" alt="Alex" className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
                <div>
                  <h4 className="font-label-md font-bold text-gray-900 hover:text-primary cursor-pointer hover:underline">Alex Chen</h4>
                  <p className="text-body-sm text-gray-500 line-clamp-2">Software Engineer at TechCorp | React & Node.js</p>
                  <button className="mt-1 px-3 py-1 rounded-full border border-gray-400 text-gray-600 font-label-sm hover:bg-gray-50 hover:border-gray-600 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="https://ui-avatars.com/api/?name=Sam&background=random" alt="Sam" className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
                <div>
                  <h4 className="font-label-md font-bold text-gray-900 hover:text-primary cursor-pointer hover:underline">Sam Taylor</h4>
                  <p className="text-body-sm text-gray-500 line-clamp-2">Product Designer | Creating intuitive experiences</p>
                  <button className="mt-1 px-3 py-1 rounded-full border border-gray-400 text-gray-600 font-label-sm hover:bg-gray-50 hover:border-gray-600 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
