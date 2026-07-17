import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('jobType', '==', 'internship'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInternships(results);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-6xl mx-auto py-12 w-full">
        <h1 className="font-display-lg font-bold mb-4">Internship Portal</h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Kickstart your career with our curated list of internships. Gain real-world experience, build your network, and earn a stipend.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">school</span>
            <h2 className="font-title-lg font-bold mb-2">No Internships Available</h2>
            <p className="text-body-md text-on-surface-variant">Check back later for new internship opportunities.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {internships.map((job, i) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="p-5 border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors flex gap-4 cursor-pointer group"
              >
                <img src={job.companyLogo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(job.company || 'JOB')} alt={job.company} className="w-14 h-14 object-cover rounded-md border border-outline-variant" />
                <div className="grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-label-lg font-bold text-primary group-hover:underline">{job.title}</h3>
                    <div className="flex gap-2 items-center">
                      <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">
                        Internship
                      </span>
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
                      className="flex items-center gap-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[13px] font-bold rounded-full transition-colors w-full sm:w-auto justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">work</span> View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
