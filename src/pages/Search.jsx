import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter users
        const queryLower = q.toLowerCase();
        const filtered = allUsers.filter(user => {
          if (!queryLower) return true; // show all if no query
          const nameMatch = (user.displayName || user.name || '').toLowerCase().includes(queryLower);
          const roleMatch = (user.role || '').toLowerCase().includes(queryLower);
          const skillsMatch = (user.skills || []).some(skill => skill.toLowerCase().includes(queryLower));
          return nameMatch || roleMatch || skillsMatch;
        });

        setUsers(filtered);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [q]);

  return (
    <div className="pt-20 pb-24 md:pb-8 min-h-screen container mx-auto px-margin-mobile md:px-margin-desktop">
      <div className="mb-6">
        <h2 className="font-headline-md font-bold text-on-surface">Search Results</h2>
        <p className="text-body-md text-on-surface-variant">
          Showing results for <span className="font-bold">"{q}"</span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
          <h3 className="font-title-lg font-bold text-on-surface">No results found</h3>
          <p className="text-body-md text-on-surface-variant mt-2">Try adjusting your search terms or exploring the Discover page.</p>
          <button 
            onClick={() => navigate('/discover')}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-label-md hover:bg-primary/90 transition-colors"
          >
            Go to Discover
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => navigate(`/profile/view/${user.id}`)}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="h-24 bg-gradient-to-r from-primary to-secondary relative">
                {user.status && (
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    user.status === 'searching' ? 'bg-blue-100 text-primary' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.status === 'searching' ? 'Open to Work' : 'Hiring'}
                  </div>
                )}
              </div>
              
              <div className="px-5 pb-5 flex-1 flex flex-col relative">
                <img 
                  src={user.photoURL || "https://ui-avatars.com/api/?name=User"} 
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full border-4 border-surface-container-lowest absolute -top-8 bg-surface object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                
                <div className="pt-10 flex-1">
                  <h3 className="font-title-md font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {user.displayName || user.name}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {user.role}
                  </p>
                  
                  {user.location && (
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {user.location}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant flex flex-wrap gap-1">
                  {(user.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-surface-container text-on-surface rounded font-label-sm text-[10px]">
                      {skill}
                    </span>
                  ))}
                  {(user.skills || []).length > 3 && (
                    <span className="px-2 py-1 bg-surface-container text-on-surface rounded font-label-sm text-[10px]">
                      +{user.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
