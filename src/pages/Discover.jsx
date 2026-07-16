import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MiniProfileCard from '../components/MiniProfileCard';
import FilterPanel from '../components/FilterPanel';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Discover() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Apply filters
  const filteredPortfolios = portfolios.filter(user => {
    let domainMatch = true;
    let skillMatch = true;

    if (selectedDomains.length > 0) {
      domainMatch = selectedDomains.some(domain => {
        const d = domain.toLowerCase();
        const role = (user.role || '').toLowerCase();
        const about = (user.about || '').toLowerCase();
        const skillsStr = (user.skills || []).join(' ').toLowerCase();
        return role.includes(d) || about.includes(d) || skillsStr.includes(d);
      });
    }

    if (selectedSkills.length > 0) {
      skillMatch = selectedSkills.some(skill => (user.skills || []).includes(skill));
    }

    return domainMatch && skillMatch;
  });

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2 pb-10">
          <MiniProfileCard />
          <FilterPanel 
            portfolios={portfolios}
            selectedDomains={selectedDomains}
            setSelectedDomains={setSelectedDomains}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
          />
        </div>

        {/* Mobile Filter Toggle & Overlay */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <h1 className="font-display-sm text-on-surface">Discover</h1>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-full text-label-md font-bold hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters {(selectedDomains.length + selectedSkills.length) > 0 && `(${selectedDomains.length + selectedSkills.length})`}
          </button>
        </div>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-[300px] h-full bg-surface-container-lowest p-6 overflow-y-auto custom-scrollbar relative"
            >
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="mt-8">
                <MiniProfileCard />
                <FilterPanel 
                  portfolios={portfolios}
                  selectedDomains={selectedDomains}
                  setSelectedDomains={setSelectedDomains}
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 hidden lg:block">
            <h1 className="font-display-sm text-on-surface mb-2">Discover Students & Peers</h1>
            <p className="text-body-sm text-on-surface-variant">Connect with students and early professionals showcasing high-impact projects.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
            </div>
          ) : filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPortfolios.map((portfolio, i) => (
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
