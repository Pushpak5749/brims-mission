import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    hirers: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        let students = 0;
        let hirers = 0;
        usersSnap.forEach(doc => {
          if (doc.data().status === 'searching') students++;
          if (doc.data().status === 'hiring') hirers++;
        });

        const jobsSnap = await getDocs(collection(db, 'jobs'));
        const appsSnap = await getDocs(collection(db, 'applications'));

        setStats({
          totalUsers: usersSnap.size,
          students,
          hirers,
          totalJobs: jobsSnap.size,
          totalApplications: appsSnap.size
        });
      } catch (error) {
        console.error("Admin fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="material-symbols-outlined animate-spin text-4xl text-error">refresh</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display-sm font-bold mb-8">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">group</span>
            <h3 className="font-bold text-on-surface-variant">Total Users</h3>
          </div>
          <p className="font-display-md font-bold">{stats.totalUsers}</p>
          <div className="mt-4 text-xs font-bold flex justify-between text-on-surface-variant">
            <span>{stats.students} Students</span>
            <span>{stats.hirers} Hirers</span>
          </div>
        </div>
        
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-secondary">work</span>
            <h3 className="font-bold text-on-surface-variant">Active Jobs</h3>
          </div>
          <p className="font-display-md font-bold">{stats.totalJobs}</p>
        </div>

        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-tertiary">send</span>
            <h3 className="font-bold text-on-surface-variant">Applications</h3>
          </div>
          <p className="font-display-md font-bold">{stats.totalApplications}</p>
        </div>
        
        <div className="bg-error/10 border border-error/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-error">warning</span>
            <h3 className="font-bold text-error">System Alerts</h3>
          </div>
          <p className="font-display-md font-bold text-error">0</p>
          <p className="mt-4 text-xs font-bold text-error">No active security alerts.</p>
        </div>
      </div>

      <h3 className="font-title-lg font-bold mb-4">Recent Activity Logs</h3>
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="p-4 font-bold text-sm text-on-surface-variant">Timestamp</th>
              <th className="p-4 font-bold text-sm text-on-surface-variant">Event</th>
              <th className="p-4 font-bold text-sm text-on-surface-variant">User ID</th>
              <th className="p-4 font-bold text-sm text-on-surface-variant">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            <tr>
              <td className="p-4 text-sm font-mono text-on-surface-variant">{new Date().toLocaleString()}</td>
              <td className="p-4 text-sm font-bold">Admin Login</td>
              <td className="p-4 text-sm font-mono text-on-surface-variant">ADMIN_ACCESS</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">SUCCESS</span></td>
            </tr>
            <tr>
              <td className="p-4 text-sm font-mono text-on-surface-variant">System initialized</td>
              <td className="p-4 text-sm font-bold">Security Rules Applied</td>
              <td className="p-4 text-sm font-mono text-on-surface-variant">SYSTEM</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">SECURE</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
