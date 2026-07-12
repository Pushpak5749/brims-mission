import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MiniProfileCard from '../components/MiniProfileCard';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Network() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'hiring'));
        const querySnapshot = await getDocs(q);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        
        setRecruiters(usersList);
      } catch (error) {
        console.error("Error fetching network profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <MiniProfileCard />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="font-display-sm text-gray-900 mb-2">Connect with Recruiters</h1>
            <p className="text-body-sm text-gray-600">Find people who are actively hiring and looking for talent like you.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
          ) : recruiters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recruiters.map((recruiter, i) => (
                <motion.div 
                  key={recruiter.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="bg-white border border-outline-variant rounded-xl flex flex-col p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/profile/view/${recruiter.id}`)}
                >
                  <div className="flex flex-col items-center mb-3 relative">
                    <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                      HIRING
                    </div>
                    <img className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm mb-2" src={recruiter.photoURL || "https://ui-avatars.com/api/?name=User"} alt={recruiter.displayName} />
                    <h4 className="font-label-md font-bold text-gray-900 text-center">{recruiter.displayName}</h4>
                    <p className="font-body-sm text-gray-500 text-center line-clamp-1">{recruiter.role}</p>
                  </div>
                  
                  <div className="grow mb-4 flex justify-center">
                    <div className="flex gap-1 flex-wrap justify-center">
                      {(recruiter.skills || []).slice(0,3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full py-1.5 border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-colors">
                    View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-12 text-center border border-outline-variant border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="material-symbols-outlined text-3xl text-gray-400">work_history</span>
              </div>
              <h3 className="font-label-lg font-bold text-gray-900 mb-2">No recruiters found</h3>
              <p className="text-body-md text-gray-600 max-w-sm mx-auto">
                No users have set their status to "Hiring" yet. When they do, they will appear right here!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
