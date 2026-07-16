import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function HirerCandidates() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'applications'), where('recruiterId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const appsList = [];
        querySnapshot.forEach((doc) => {
          appsList.push({ id: doc.id, ...doc.data() });
        });
        appsList.sort((a, b) => b.appliedAt - a.appliedAt);
        setApplications(appsList);
      } catch (error) {
        console.error("Error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentUser]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const appRef = doc(db, 'applications', appId);
      await updateDoc(appRef, { status: newStatus });
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider">Shortlisted</span>;
      case 'interview': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">Interview Scheduled</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold uppercase tracking-wider">Applied</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-on-surface">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display-sm">Applicant Tracking</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">group_off</span>
          <h3 className="font-title-lg font-bold text-on-surface mb-2">No applicants yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">When candidates apply to your jobs, their applications will appear here.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap">Candidate</th>
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap">Job Title</th>
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap">Applied Date</th>
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap">Resume</th>
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap">Status</th>
                  <th className="p-4 font-label-lg text-on-surface-variant whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={app.applicantPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName)}`} alt="" className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                        <div>
                          <p className="font-label-lg font-bold text-on-surface">{app.applicantName}</p>
                          <a href={`/profile/view/${app.applicantId}`} target="_blank" rel="noreferrer" className="text-[12px] text-primary hover:underline flex items-center gap-1">
                            View Profile <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-body-md font-bold text-on-surface">{app.jobTitle}</td>
                    <td className="p-4 text-body-sm text-on-surface-variant">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline text-body-sm font-bold">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                          Download
                        </a>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant italic">No Resume</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block group">
                        <button className="p-2 hover:bg-surface-container rounded-full transition-colors flex items-center gap-1 text-body-sm font-bold text-on-surface-variant">
                          Change Status <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col overflow-hidden">
                          <button onClick={() => handleStatusChange(app.id, 'shortlisted')} className="px-4 py-3 text-left text-body-sm hover:bg-surface-container-low transition-colors font-medium">Shortlist Candidate</button>
                          <button onClick={() => handleStatusChange(app.id, 'interview')} className="px-4 py-3 text-left text-body-sm hover:bg-surface-container-low transition-colors font-medium">Schedule Interview</button>
                          <button onClick={() => handleStatusChange(app.id, 'rejected')} className="px-4 py-3 text-left text-body-sm hover:bg-red-50 text-red-600 transition-colors font-medium">Reject</button>
                          <div className="border-t border-outline-variant"></div>
                          <button onClick={() => handleStatusChange(app.id, 'applied')} className="px-4 py-3 text-left text-body-sm hover:bg-surface-container-low transition-colors font-medium">Reset to 'Applied'</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
