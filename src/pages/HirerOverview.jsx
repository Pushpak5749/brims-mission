import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function HirerOverview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    profileViews: currentUser?.profileViews || 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      try {
        const jobsQ = query(collection(db, 'jobs'), where('companyId', '==', currentUser.uid));
        const appsQ = query(collection(db, 'applications'), where('recruiterId', '==', currentUser.uid));
        
        const [jobsSnap, appsSnap] = await Promise.all([getDocs(jobsQ), getDocs(appsQ)]);
        
        setStats(prev => ({
          ...prev,
          activeJobs: jobsSnap.size,
          totalApplicants: appsSnap.size
        }));
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto text-on-surface">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display-md text-on-surface">Welcome back, {currentUser?.displayName || 'Company'}</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Here is what's happening with your job postings today.</p>
        </div>
        <Link to="/hirer/jobs" className="px-6 py-3 bg-primary text-white rounded-full font-label-lg hover:bg-primary/90 transition-colors shadow-sm">
          Post a New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">work</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Active Jobs</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.activeJobs}</p>}
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Total Applicants</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.totalApplicants}</p>}
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Company Profile Views</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.profileViews}</p>}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
        <h2 className="font-title-lg font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-10">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">history</span>
          <p className="text-body-md text-on-surface-variant">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
}
