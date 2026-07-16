import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function StudentSavedJobs() {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const savedIds = userDoc.data()?.savedJobs || [];
        
        if (savedIds.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }

        const q = query(collection(db, 'jobs'));
        const querySnapshot = await getDocs(q);
        const allJobs = [];
        querySnapshot.forEach((doc) => {
          allJobs.push({ id: doc.id, ...doc.data() });
        });

        const filtered = allJobs.filter(job => savedIds.includes(job.id));
        setSavedJobs(filtered);
      } catch (error) {
        console.error("Error fetching saved jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [currentUser]);

  const handleRemoveSaved = async (jobId) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      let currentSaved = userDoc.data()?.savedJobs || [];
      currentSaved = currentSaved.filter(id => id !== jobId);
      
      await updateDoc(userRef, { savedJobs: currentSaved });
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error("Error removing saved job", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-on-surface">
      <h1 className="font-display-sm mb-6">Saved Jobs</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant shadow-sm text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">bookmark_border</span>
          <h3 className="font-title-lg font-bold text-on-surface mb-2">No saved jobs</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">You haven't bookmarked any jobs yet. Browse the job board and save jobs you're interested in.</p>
          <a href="/jobs" className="px-6 py-3 bg-primary text-white rounded-full font-label-md hover:bg-primary/90 transition-colors">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map(job => (
            <div key={job.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-surface-container-low transition-colors">
              <div className="flex gap-4 items-center">
                <img src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'JOB')}`} alt="" className="w-16 h-16 rounded-xl object-cover border border-outline-variant" />
                <div>
                  <h3 className="font-title-md font-bold text-primary hover:underline cursor-pointer">{job.title}</h3>
                  <p className="text-body-md text-on-surface font-bold">{job.company}</p>
                  <p className="text-body-sm text-on-surface-variant">{job.location} {job.salary && `• ${job.salary}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none px-6 py-2 bg-primary text-white rounded-full font-label-md hover:bg-primary/90 transition-colors">
                  Apply Now
                </button>
                <button onClick={() => handleRemoveSaved(job.id)} className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
