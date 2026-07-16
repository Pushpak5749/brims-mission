import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MiniProfileCard from '../components/MiniProfileCard';
import { db } from '../firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchUserSavedJobs = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setSavedJobs(userDoc.data()?.savedJobs || []);
        } catch (error) {
          console.error("Error fetching saved jobs", error);
        }
      }
    };
    fetchUserSavedJobs();
  }, [currentUser]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'));
        const querySnapshot = await getDocs(q);
        const jobsList = [];
        querySnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort jobs by newest first
        jobsList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleToggleSaveJob = async (jobId) => {
    if (!currentUser) {
      alert("Please login to save jobs.");
      return;
    }
    try {
      const isSaved = savedJobs.includes(jobId);
      let updatedSaved = [...savedJobs];
      
      if (isSaved) {
        updatedSaved = updatedSaved.filter(id => id !== jobId);
      } else {
        updatedSaved.push(jobId);
      }
      
      setSavedJobs(updatedSaved);
      await updateDoc(doc(db, 'users', currentUser.uid), { savedJobs: updatedSaved });
    } catch (error) {
      console.error("Error saving job", error);
    }
  };

  const extraSidebarLinks = (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-on-surface-variant">list</span>
        <span className="font-label-md text-on-surface font-bold">Preferences</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
        <span className="font-label-md text-on-surface font-bold">Job tracker</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-yellow-600">insights</span>
        <span className="font-label-md text-on-surface font-bold">My Career Insights</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors">
        <span className="material-symbols-outlined text-primary">edit_square</span>
        <span className="font-label-md text-primary font-bold">Post a free job</span>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <MiniProfileCard extraContent={extraSidebarLinks} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-4">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-label-lg font-bold text-on-surface">Jobs based on your preferences</h2>
                <p className="text-body-sm text-on-surface-variant">Full-time Founder, on-site or hybrid or remote in Greater Delhi Area</p>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container-low flex items-center justify-center transition-colors border border-outline">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
              </button>
            </div>

            <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-3 flex justify-between items-center mb-2">
              <p className="text-body-sm text-[#2E7D32]">
                <strong>New:</strong> Edit preferences to include industries, skills and more to see more relevant jobs
              </p>
              <button className="text-[#2E7D32] hover:bg-[#C8E6C9] rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </motion.div>

          {/* Job Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job, i) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-5 border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors flex gap-4 cursor-pointer group"
                >
                  <img src={job.companyLogo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(job.company || 'JOB')} alt={job.company} className="w-14 h-14 object-cover rounded-md" />
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-label-lg font-bold text-primary group-hover:underline">{job.title}</h3>
                      <div className="flex gap-2 items-center">
                        {job.verificationStatus === 'unverified' && (
                          <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold uppercase tracking-wider">Unverified</span>
                        )}
                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">
                          {job.type || 'Full-time'}
                        </span>
                        <button onClick={() => handleToggleSaveJob(job.id)} className={`transition-opacity ${savedJobs.includes(job.id) ? 'text-primary opacity-100' : 'text-outline-variant hover:text-on-surface-variant opacity-0 group-hover:opacity-100'}`}>
                          <span className={savedJobs.includes(job.id) ? "material-symbols-icons" : "material-symbols-outlined"}>bookmark</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-body-sm text-on-surface font-bold">{job.company}</p>
                    <p className="text-body-sm text-on-surface-variant mb-1">{job.location} {job.salary && `• ${job.salary}`}</p>
                    
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex gap-2 mt-2 mb-2">
                        {job.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">{skill}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[12px] text-primary font-bold">
                        <span className="material-symbols-outlined text-[14px]">work</span> Easy Apply
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 border border-outline">
                  <span className="material-symbols-outlined text-3xl text-outline-variant">work_off</span>
                </div>
                <h3 className="font-label-lg font-bold text-on-surface mb-2">No jobs posted yet</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
                  Check back soon! When recruiters post new positions, they will show up right here in your feed.
                </p>
                <button className="bg-primary text-white font-label-md px-6 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                  Update Preferences
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
