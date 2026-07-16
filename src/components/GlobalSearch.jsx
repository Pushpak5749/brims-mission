import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all users once when the search is first focused
  const fetchUsers = async () => {
    if (users.length > 0) return; // already fetched
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users for search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    fetchUsers();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Filter users based on query
  const filteredUsers = query.trim() ? users.filter(user => {
    const q = query.toLowerCase();
    const nameMatch = (user.displayName || user.name || '').toLowerCase().includes(q);
    const roleMatch = (user.role || '').toLowerCase().includes(q);
    const skillsMatch = (user.skills || []).some(skill => skill.toLowerCase().includes(q));
    return nameMatch || roleMatch || skillsMatch;
  }).slice(0, 5) : []; // limit to 5 results for dropdown

  return (
    <div className="relative flex-1 max-w-[400px] ml-2 md:ml-4" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search users or skills..."
          className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
        />
      </form>

      {/* Live Dropdown */}
      <AnimatePresence>
        {isFocused && query.trim() && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl overflow-hidden z-[100]"
          >
            {loading ? (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">
                <span className="material-symbols-outlined animate-spin">refresh</span>
              </div>
            ) : filteredUsers.length > 0 ? (
              <>
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => {
                      setIsFocused(false);
                      setQuery('');
                      navigate(`/profile/view/${user.id}`);
                    }}
                    className="p-3 border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img 
                      src={user.photoURL || "https://ui-avatars.com/api/?name=User"} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-label-md font-bold text-on-surface truncate">{user.displayName || user.name}</h4>
                      <p className="text-body-sm text-on-surface-variant truncate">{user.role || 'Member'}</p>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={handleSearchSubmit}
                  className="p-3 text-center text-primary font-label-md hover:bg-surface-container-low cursor-pointer transition-colors"
                >
                  See all results
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">
                No users found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
