import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MiniProfileCard from '../components/MiniProfileCard';

export default function Network() {
  const navigate = useNavigate();
  const recruiters = [
    { id: 201, name: "Sarah Jenkins", role: "Technical Recruiter at Google", tags: ["Hiring", "SWE"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw7Efg7WTWWLmN8YiVV_DQZ344LHMxzK1MDiSxPjjscbQd2XIWj8Ed-LWBU1jPTYDO9Md2WAPtRA-a86a84fc5xPZIAJLjJ_drVZadhWdLj4YX24wKEcv4K7rKmtAFlsNpVfiKmXX_5CdKexfUgo-NvwJyku4MUneuTlxn5Tmli_xbPsX_X4FGyMwMhxZk9MMhFuthshEe-vBrsZg84K4adeh2zCu-ZSuvD2_WQeuQJrjdbqp1jR9Q69eNRG78qXN4oBxkzGqX9tc" },
    { id: 202, name: "Marcus Thorne", role: "Lead Recruiter at InnovateX", tags: ["Startups", "Design"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsLV3CsZrZwNiWagtgzQA7X523CD5wi196eDWJBENNuX2artD2isZIe0M_-aShWvJMoTUTfIEpLTRhKsAVFVn7GnYrotcsFhJyaWxKF3iVikvIW3q0SzPjeicwvoD9-7pceypVh1tlZ1DRgZpHaPRra8Zgj547JXrt0AlH6gLwX1ZdqmUCZJwPWU2xilXRNUl0iVP8ALmXuxONQJIMKC3FihdPqKuWH1oBHJtVZiN42DqB2d91JYUUTDZX5pxe7ug1Eu9jtYj7_io" },
    { id: 203, name: "Lydia Song", role: "Talent Acquisition at Stripe", tags: ["Fintech", "Remote"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO9xF-Wry-E1qF2M7pxGrSHrOJcLgItiT5MbnNQTLSQ6goVYNNFgT5JbyeLhRGASAPH8chC3WdneKaJ3jkhjIyU7JTgVLAbSJDI3jb6EIFNHT4AcAaRJ3FPGS8tZyYQ8d8wNgM806y2FTCj0WGcnlytGax-8-qDz9BsgtAjb4X6gs2egzvgRmOLpOOMqoG2t6vq-3wlX-hIHc_nJBp3yzYRC_qEdCrPhSI6VFBysMfutx3dGe6_6hIxe2n4zNNySYMqun_CEYbBSg" },
    { id: 204, name: "James Wilson", role: "HR Manager at TechFlow", tags: ["Hiring", "Frontend"], img: "https://ui-avatars.com/api/?name=James+Wilson&background=43A047&color=fff" }
  ];

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
                  <img className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm mb-2" src={recruiter.img} alt={recruiter.name} />
                  <h4 className="font-label-md font-bold text-gray-900 text-center">{recruiter.name}</h4>
                  <p className="font-body-sm text-gray-500 text-center line-clamp-1">{recruiter.role}</p>
                </div>
                
                <div className="grow mb-4 flex justify-center">
                  <div className="flex gap-1 flex-wrap justify-center">
                    {recruiter.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full py-1.5 border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-colors">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
