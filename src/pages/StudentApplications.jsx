import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function StudentApplications() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'applications'), where('applicantId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const appsList = [];
        
        // Fetch company logos for the jobs
        for (const applicationDoc of querySnapshot.docs) {
          const appData = applicationDoc.data();
          let companyLogo = '';
          
          try {
            // Get the job doc to get company logo (or from the app if we saved it)
            if (appData.jobId) {
              const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
              if (jobDoc.exists()) {
                companyLogo = jobDoc.data().companyLogo;
              }
            }
          } catch (e) {
            console.error("Error fetching job info", e);
          }
          
          appsList.push({
            id: applicationDoc.id,
            companyLogo,
            ...appData
          });
        }
        
        appsList.sort((a, b) => (b.appliedAt || 0) - (a.appliedAt || 0));
        setApplications(appsList);
      } catch (error) {
        console.error("Error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentUser]);

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'shortlisted': return { text: 'Shortlisted', color: 'bg-green-100 text-green-800 border-green-200', icon: 'thumb_up' };
      case 'interview': return { text: 'Interview Scheduled', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'event' };
      case 'rejected': return { text: 'Not Selected', color: 'bg-red-100 text-red-800 border-red-200', icon: 'cancel' };
      default: return { text: 'Application Sent', color: 'bg-surface-container-high text-on-surface-variant border-outline-variant', icon: 'send' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-on-surface">
      <h1 className="font-display-sm mb-6">Application Tracker</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant shadow-sm text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">work_off</span>
          <h3 className="font-title-lg font-bold text-on-surface mb-2">No applications yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">You haven't applied to any jobs yet. Your applications will appear here.</p>
          <a href="/jobs" className="px-6 py-3 bg-primary text-white rounded-full font-label-md hover:bg-primary/90 transition-colors">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const statusInfo = getStatusDisplay(app.status);
            return (
              <div key={app.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-4 items-start md:items-center">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
                    {app.companyLogo ? (
                      <img src={app.companyLogo} alt="Company" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant">domain</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-title-md font-bold text-primary">{app.jobTitle}</h3>
                    <p className="text-body-sm text-on-surface-variant mb-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    
                    <div className="hidden md:block">
                      <p className="text-body-sm italic text-on-surface-variant line-clamp-1">"{app.whyBestSuited}"</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.color} font-bold text-sm justify-center md:justify-start w-full md:w-auto`}>
                    <span className="material-symbols-outlined text-[18px]">{statusInfo.icon}</span>
                    {statusInfo.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
