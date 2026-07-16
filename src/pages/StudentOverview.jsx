import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function StudentOverview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    interviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      try {
        // Fetch applications
        const appsQ = query(collection(db, 'applications'), where('applicantId', '==', currentUser.uid));
        const appsSnap = await getDocs(appsQ);
        
        let interviewCount = 0;
        appsSnap.forEach(doc => {
          if (doc.data().status === 'interview') {
            interviewCount++;
          }
        });

        // Fetch saved jobs from user profile
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const savedJobs = userDoc.data()?.savedJobs || [];

        setStats({
          applied: appsSnap.size,
          interviews: interviewCount,
          saved: savedJobs.length
        });
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
          <h1 className="font-display-md text-on-surface">Welcome back, {currentUser?.displayName?.split(' ')[0]}!</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Here is a quick overview of your job search progress.</p>
        </div>
        <Link to="/jobs" className="px-6 py-3 bg-primary text-white rounded-full font-label-lg hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
          Find More Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">send</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Jobs Applied</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.applied}</p>}
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined">bookmark</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Saved Jobs</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.saved}</p>}
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">event</span>
            </div>
            <h3 className="font-label-lg text-on-surface-variant font-bold">Upcoming Interviews</h3>
          </div>
          {loading ? <div className="h-10 w-16 bg-surface-container animate-pulse rounded"></div> : <p className="font-display-lg text-on-surface">{stats.interviews}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h2 className="font-title-lg font-bold mb-4">Recent Applications</h2>
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">work_history</span>
            <p className="text-body-md text-on-surface-variant">View your full application history in the Tracker.</p>
            <Link to="/student/applications" className="inline-block mt-4 text-primary font-bold hover:underline">Go to Applications</Link>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h2 className="font-title-lg font-bold mb-4">Resume Tips</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-body-sm text-blue-900">Make sure your resume matches the job description. Highlight keywords that recruiters might search for, such as specific frameworks or software tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
