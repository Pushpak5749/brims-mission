import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('status', '==', 'hiring')
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter out companies that haven't completed onboarding or don't have a name
        const validCompanies = results.filter(c => c.companyName || c.displayName);
        setCompanies(validCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-6xl mx-auto py-12 w-full">
        <h1 className="font-display-lg font-bold mb-4">Company Directory</h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Discover and connect with top organizations hiring on Brims Mission.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">domain_disabled</span>
            <h2 className="font-title-lg font-bold mb-2">No Companies Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {companies.map(company => (
              <Link to={`/profile/view/${company.id}`} key={company.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant mb-4 bg-surface flex items-center justify-center">
                  {company.photoURL ? (
                    <img src={company.photoURL} alt={company.companyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">domain</span>
                  )}
                </div>
                <h3 className="font-title-md font-bold mb-1 truncate w-full">{company.companyName || company.displayName}</h3>
                <p className="text-label-sm text-on-surface-variant mb-3">{company.industry || 'Tech & IT'}</p>
                <div className="mt-auto px-4 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-full">
                  View Profile
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
