import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MiniProfileCard from '../components/MiniProfileCard';
import { db } from '../firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import JobApplicationModal from '../components/JobApplicationModal';

export default function Jobs() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterJobType, setFilterJobType] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesLocation = !filterLocation || 
      (job.location && job.location.toLowerCase().includes(filterLocation.toLowerCase()));
      
    const matchesType = !filterJobType || 
      (job.type && job.type.toLowerCase() === filterJobType.toLowerCase());

    const matchesIndustry = !filterIndustry || 
      (job.industry && job.industry.toLowerCase() === filterIndustry.toLowerCase());

    return matchesSearch && matchesLocation && matchesType && matchesIndustry;
  });

  const filterSidebar = (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm mt-4 lg:mt-0">
      <h3 className="font-label-lg font-bold mb-4">Filter Jobs</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Search Keywords</label>
          <input 
            type="text" 
            placeholder="Job title, company..." 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Location</label>
          <input 
            type="text" 
            placeholder="City, state, or Remote" 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Job Type</label>
          <select 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={filterJobType}
            onChange={e => setFilterJobType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Industry</label>
          <input 
            type="text" 
            placeholder="e.g. Technology, Finance" 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {
            setSearchTerm('');
            setFilterLocation('');
            setFilterJobType('');
            setFilterIndustry('');
          }}
          className="w-full py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-lg font-bold text-sm transition-colors mt-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          {currentUser && <MiniProfileCard />}
          {filterSidebar}
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
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, i) => (
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
                    
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!currentUser) {
                            alert("Please login to apply.");
                            return;
                          }
                          setSelectedJob(job);
                          setIsApplyModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[13px] font-bold rounded-full transition-colors w-full sm:w-auto justify-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">work</span> Easy Apply
                      </button>
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
      
      {isApplyModalOpen && selectedJob && (
        <JobApplicationModal 
          job={selectedJob} 
          recruiterId={selectedJob.companyId}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }} 
        />
      )}
    </div>
  );
}
