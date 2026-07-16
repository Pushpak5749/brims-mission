import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MiniProfileCard from '../components/MiniProfileCard';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Discover() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'searching'));
        const querySnapshot = await getDocs(q);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        
        // Also fetch users who might not have the status field yet (default to searching)
        if (usersList.length === 0) {
           const allQ = query(collection(db, 'users'));
           const allSnap = await getDocs(allQ);
           allSnap.forEach((doc) => {
             const data = doc.data();
             if (!data.status || data.status === 'searching') {
               usersList.push({ id: doc.id, ...data });
             }
           });
        }
        // Sort users by profile views in descending order
        usersList.sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0));
        
        setPortfolios(usersList);
      } catch (error) {
        console.error("Error fetching discover profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
            <h1 className="font-display-sm text-on-surface mb-2">Discover Students & Peers</h1>
            <p className="text-body-sm text-on-surface-variant">Connect with students and early professionals showcasing high-impact projects.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
          ) : portfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {portfolios.map((portfolio, i) => (
                <motion.div 
                  key={portfolio.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/profile/view/${portfolio.id}`)}
                >
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-blue-200">
                    OPEN TO WORK
                  </div>
                  <div className="flex flex-col items-center mb-3 mt-2">
                    <img className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm mb-2" src={portfolio.photoURL || "https://ui-avatars.com/api/?name=User"} alt={portfolio.displayName} />
                    <h4 className="font-label-md font-bold text-on-surface text-center">{portfolio.displayName}</h4>
                    <p className="font-body-sm text-outline text-center line-clamp-1">{portfolio.role}</p>
                  </div>
                  
                  <div className="grow mb-4 flex justify-center">
                    <div className="flex gap-1 flex-wrap justify-center">
                      {(portfolio.skills || []).slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant text-[10px] rounded">{tag}</span>
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
              <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="material-symbols-outlined text-3xl text-outline-variant">group_off</span>
              </div>
              <h3 className="font-label-lg font-bold text-on-surface mb-2">No students found</h3>
              <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">
                Be the first to join the network! Head over to your profile and set your status to "Searching for Job".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
