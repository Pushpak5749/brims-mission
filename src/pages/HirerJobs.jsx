import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import JobPostingModal from '../components/JobPostingModal';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function HirerJobs() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'jobs'), where('companyId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const jobsList = [];
        querySnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending locally
        jobsList.sort((a, b) => b.createdAt - a.createdAt);
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentUser]);

  const handleSaveJob = async (jobData) => {
    if (!currentUser) return;
    
    const jobId = crypto.randomUUID();
    const newJob = {
      ...jobData,
      id: jobId,
      createdAt: Date.now(),
      company: currentUser.displayName,
      companyId: currentUser.uid,
      companyLogo: currentUser.photoURL,
      verificationStatus: currentUser.verificationStatus || 'unverified'
    };

    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    setIsModalOpen(false);

    try {
      await setDoc(doc(db, 'jobs', jobId), newJob);
    } catch (error) {
      console.error("Error saving job", error);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    const updatedJobs = jobs.filter(j => j.id !== jobId);
    setJobs(updatedJobs);

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
    } catch (error) {
      console.error("Error deleting job", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto text-on-surface">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display-sm">Job Postings</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-primary text-white rounded-full font-label-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          + Post New Job
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant shadow-sm text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">work_off</span>
          <h3 className="font-title-lg font-bold text-on-surface mb-2">No jobs posted yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">Create your first job listing to start receiving applications from top talent.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-colors"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-title-lg font-bold text-on-surface">{job.title}</h3>
                  <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">
                    {job.type}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-4">{job.location} • {job.salary || 'Salary Undisclosed'}</p>
                <div className="flex gap-2 flex-wrap">
                  {job.skills?.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-surface-container text-on-surface-variant text-[11px] rounded font-medium">
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 4 && (
                    <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[11px] rounded font-medium">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex md:flex-col items-center justify-between md:items-end md:justify-start gap-3 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6">
                <div className="text-center md:text-right">
                  <p className="text-display-sm text-primary font-bold">0</p>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Applicants</p>
                </div>
                <button 
                  onClick={() => deleteJob(job.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                  title="Delete Job"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobPostingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
      />
    </div>
  );
}
