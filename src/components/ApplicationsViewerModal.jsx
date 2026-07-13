import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function ApplicationsViewerModal({ job, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, 'applications'),
          where('jobId', '==', job.id || 'legacy-job'),
          // Cannot use orderBy with where without an index, so we sort client-side
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort descending by appliedAt
        apps.sort((a, b) => b.appliedAt - a.appliedAt);
        setApplications(apps);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [job.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10">
          <div>
            <h2 className="font-headline-sm font-bold text-on-surface">Applications</h2>
            <p className="text-body-sm text-on-surface-variant">for {job.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-surface flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-2">autorenew</span>
              <p className="text-on-surface-variant font-label-md">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-outline text-5xl mb-3">inbox</span>
              <h3 className="font-title-lg font-bold text-on-surface">No applications yet</h3>
              <p className="text-body-md text-on-surface-variant mt-2">When students apply to this job, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(app => (
                <div key={app.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-low border border-outline-variant shrink-0">
                        <img src={app.applicantPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName)}`} alt={app.applicantName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-title-md font-bold text-on-surface">{app.applicantName}</h3>
                        <p className="text-body-sm text-on-surface-variant">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link to={`/profile/view/${app.applicantId}`} className="text-primary font-label-sm font-bold hover:underline">
                      View Profile
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-label-md font-bold text-on-surface mb-1">Why do they want this profile?</h4>
                      <p className="text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg leading-relaxed whitespace-pre-line">
                        {app.whyWantProfile}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-label-md font-bold text-on-surface mb-1">Why are they best suited?</h4>
                      <p className="text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg leading-relaxed whitespace-pre-line">
                        {app.whyBestSuited}
                      </p>
                    </div>
                    {app.resumeUrl && (
                      <div className="pt-2 border-t border-outline-variant mt-4">
                        <a 
                          href={app.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-4 py-2 rounded-full font-label-sm font-bold hover:bg-[#004182] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
