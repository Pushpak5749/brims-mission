import React from 'react';
import { motion } from 'framer-motion';
import MiniProfileCard from '../components/MiniProfileCard';

export default function Jobs() {
  const extraSidebarLinks = (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-gray-600">list</span>
        <span className="font-label-md text-gray-900 font-bold">Preferences</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-gray-600">bookmark</span>
        <span className="font-label-md text-gray-900 font-bold">Job tracker</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/50">
        <span className="material-symbols-outlined text-yellow-600">insights</span>
        <span className="font-label-md text-gray-900 font-bold">My Career Insights</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors">
        <span className="material-symbols-outlined text-primary">edit_square</span>
        <span className="font-label-md text-primary font-bold">Post a free job</span>
      </div>
    </div>
  );

  const jobs = [
    {
      id: 1,
      title: "Co Founder",
      company: "THYNF",
      location: "India (Remote)",
      reviewing: true,
      promoted: true,
      logo: "https://ui-avatars.com/api/?name=TH&background=E8F5E9&color=2E7D32&font-size=0.4"
    },
    {
      id: 2,
      title: "Chief Business Officer - AI Consulting",
      company: "Stealth Indian Startup",
      location: "India (Remote)",
      reviewing: true,
      promoted: true,
      logo: "https://ui-avatars.com/api/?name=SI&background=212121&color=fff&font-size=0.4"
    },
    {
      id: 3,
      title: "Cofounder with Investment (Angel/Advisor)",
      company: "Zlosure AI",
      location: "Gurugram (Hybrid)",
      reviewing: true,
      promoted: false,
      logo: "https://ui-avatars.com/api/?name=ZA&background=F3E5F5&color=7B1FA2&font-size=0.4"
    }
  ];

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <MiniProfileCard extraLinks={extraSidebarLinks} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline-sm font-bold text-gray-900">Jobs based on your preferences</h2>
                <p className="text-body-sm text-gray-500">Full-time Founder, on-site or hybrid or remote in Greater Delhi Area</p>
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>

            <div className="bg-[#E8F3EB] border border-[#C5E1CE] p-3 rounded-lg flex items-start justify-between mb-6">
              <p className="text-body-sm text-gray-800"><span className="font-bold">New:</span> Edit preferences to include industries, skills and more to see more relevant jobs</p>
              <button className="text-gray-600 hover:bg-[#D5EADF] p-1 rounded transition-colors ml-2">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-0">
              {jobs.map((job, idx) => (
                <div key={job.id} className={`flex gap-4 py-4 ${idx !== jobs.length - 1 ? 'border-b border-outline-variant' : ''}`}>
                  <div className="w-14 h-14 bg-white border border-outline-variant rounded overflow-hidden shrink-0 mt-1">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-label-lg font-bold text-primary hover:underline cursor-pointer">{job.title}</h3>
                      <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors ml-2">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                    <p className="text-body-md text-gray-900">{job.company}</p>
                    <p className="text-body-sm text-gray-500">{job.location}</p>
                    
                    {job.reviewing && (
                      <div className="flex items-center gap-1 mt-1 text-green-700">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span className="text-[12px]">Actively reviewing applicants</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 mt-1 text-[12px] text-gray-500">
                      {job.promoted && <span>Promoted · </span>}
                      {!job.promoted && <span>5 days ago · </span>}
                      <span className="text-primary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">work</span> Easy Apply
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-outline-variant mt-2 pt-4 text-center">
              <button className="font-label-md font-bold text-gray-600 hover:text-gray-900 hover:underline">Show all →</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm p-6">
            <h2 className="font-headline-sm font-bold text-gray-900 mb-2">Jobs that match your profile</h2>
            <p className="text-body-sm text-gray-500 mb-4">Based on the job criteria and your profile</p>
            <div className="text-center py-8">
              <p className="text-body-md text-gray-600">More jobs will appear here as you update your profile.</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
