import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Mock user directory
    const mockUsers = {
      // Students
      101: { name: "Jordan Ellis", role: "Aspiring Product Designer", university: "University of Design", location: "San Francisco, CA", tags: ["Figma", "UI Design"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfQW9NyDHZDwDB_rJGh4v8cxeAyY2kdacpDockkX7kLAMqF1XM-vKA6FHUx9_liD2CUEdXrIDFMZX-LfHXKwntcWNwZ3X1Kx4EXC7d_4PXOjkIew2DikVq-jVkmwXEHeewCNH2WbRJvcuAZTygk-_XZNSd3TVCcDVo6Lt3hGK29GNf2g46M54qBNAx7c5RouzZDvXyg5l8h3asTTBtr1cFMZer4ldwDcd8IHMesEJOyvc8z1P62a0eeQiZTL3fTl3VkybEXEsUL1Y" },
      102: { name: "Leo Zhang", role: "Full-stack Developer", university: "Tech Institute", location: "Seattle, WA", tags: ["React", "Node.js"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAezh7peIpaHThLsII_3zwmBWn_cmaxhqyji0xBaDqUBUj3Hyfje-uYe2OrFh1qcn4zTZQXi8n92PCBynwkT8NIOzjTuRQvPQcnoQDojyByMDi1t6jqsnvH4CKqKQTrFWwD_JwFzRdzA5XRGfsa714o3MfzGZvmtCdOZE97S33apIZyyPKkrSrLx-oasDKHPsaB9nyjwO2UpJWk4aDP4_85AcgHTBRpQ1tFu7t989hclWi8AIiBz-88ArMkuh9-lk0NQ4fxaT1KwKI" },
      103: { name: "Elena Rossi", role: "AI Ethics Researcher", university: "Global University", location: "London, UK", tags: ["Python", "NLP"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9xho0VQE4Js80y6okUyuMgimPqXHQZlN3EYUWRZxp1-WLBJOol1s9b3Yjh-Czhw_o1GeJ8eiTi1TreRvJB1G6s7GE4Vv8lxJ2KJuyxUejPus1F-yjbvLcMmJIPzmbvhWkul89YNQb6PP7VS0R_8dTnquoKDgFTbrO-xmMC8irchOOavOhhCK-XRWWeLUIE6q_Tw8gKl7NjkOD1qDXV2r5sV2e3Osc48LsHBAty4qv-qhyu83w0scxo9kg4scNXsMeJFTpzPCuh2g" },
      104: { name: "David Kim", role: "Financial Analyst", university: "Business School", location: "New York, NY", tags: ["SQL", "Modeling"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYDUBCqMEqMu4jJegXQASiGbPp2pHZof05u0VS0LaGGM3O_l8VfneWoCsoh9AKK7Dk1FxFRlYS99UypldCzZ2Ahb_H69VDDwe6JXyFmo8PhJ6QMaVKUdkCKHmZcDDcpLfr7nIpnuG2YOMP2RmiriT_qXAruYe-YrMl27DDCma0K0g3ny66cn_CHyOtJuS-Pif0j7WdJpMEjmNYTAs-3capeavHAmOetEeekc83vJSHs8W0dinMB8RSFpLcGT2oJC-i6DYR-b7pzb4" },
      // Recruiters
      201: { name: "Sarah Jenkins", role: "Technical Recruiter at Google", university: "Google", location: "Mountain View, CA", tags: ["Hiring", "SWE"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw7Efg7WTWWLmN8YiVV_DQZ344LHMxzK1MDiSxPjjscbQd2XIWj8Ed-LWBU1jPTYDO9Md2WAPtRA-a86a84fc5xPZIAJLjJ_drVZadhWdLj4YX24wKEcv4K7rKmtAFlsNpVfiKmXX_5CdKexfUgo-NvwJyku4MUneuTlxn5Tmli_xbPsX_X4FGyMwMhxZk9MMhFuthshEe-vBrsZg84K4adeh2zCu-ZSuvD2_WQeuQJrjdbqp1jR9Q69eNRG78qXN4oBxkzGqX9tc" },
      202: { name: "Marcus Thorne", role: "Lead Recruiter at InnovateX", university: "InnovateX", location: "Austin, TX", tags: ["Startups", "Design"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsLV3CsZrZwNiWagtgzQA7X523CD5wi196eDWJBENNuX2artD2isZIe0M_-aShWvJMoTUTfIEpLTRhKsAVFVn7GnYrotcsFhJyaWxKF3iVikvIW3q0SzPjeicwvoD9-7pceypVh1tlZ1DRgZpHaPRra8Zgj547JXrt0AlH6gLwX1ZdqmUCZJwPWU2xilXRNUl0iVP8ALmXuxONQJIMKC3FihdPqKuWH1oBHJtVZiN42DqB2d91JYUUTDZX5pxe7ug1Eu9jtYj7_io" },
    };

    const user = mockUsers[id];
    if (user) {
      setProfileData(user);
    } else {
      // Fallback
      setProfileData({
        name: "Unknown User", role: "Member", university: "Platform", location: "Earth", tags: [], img: "https://ui-avatars.com/api/?name=User"
      });
    }
  }, [id]);

  if (!profileData) return null;

  return (
    <div className="pt-20 pb-24 md:pb-8 min-h-screen container mx-auto max-w-[1000px] px-margin-mobile md:px-margin-desktop">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 font-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Profile Column */}
        <div className="lg:col-span-8 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm"
          >
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 relative">
            </div>
            
            {/* Profile Header Details */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-start">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-surface shadow-md -mt-16 relative">
                  <img className="w-full h-full object-cover" src={profileData.img} alt="Profile" />
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="font-headline-md text-headline-md font-bold text-gray-900 flex items-center gap-2">
                    {profileData.name}
                  </h1>
                  <p className="font-body-lg text-gray-800 mt-1 max-w-md">{profileData.role}</p>
                  <p className="font-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                    {profileData.location} <span className="font-bold text-primary mx-1">·</span> 
                    <a href="#" className="font-bold text-primary hover:underline">Contact info</a>
                  </p>
                  <p className="font-label-md text-primary mt-2 font-bold hover:underline cursor-pointer">500+ connections</p>
                </div>
                
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex items-center gap-2 text-on-surface hover:text-primary hover:underline cursor-pointer">
                    <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">business</span>
                    </div>
                    <span className="font-label-sm font-bold">{profileData.university}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button className="bg-primary text-white font-label-md px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">person_add</span> Connect
                </button>
                <button className="border border-primary text-primary font-label-md px-4 py-1.5 rounded-full hover:bg-primary/5 transition-colors">
                  Message
                </button>
                <button className="border border-outline text-on-surface w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-lg">more_horiz</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm"
          >
            <h2 className="font-headline-sm font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex gap-2 flex-wrap">
              {profileData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-label-md text-gray-700 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Right Column */}
        <div className="hidden lg:block lg:col-span-4 space-y-gutter">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm"
          >
            <h3 className="font-headline-sm font-bold text-gray-900 mb-4">People also viewed</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff" alt="User" />
                </div>
                <div>
                  <h4 className="font-label-md font-bold text-gray-900 hover:text-primary hover:underline cursor-pointer">Jane Doe</h4>
                  <p className="text-body-sm text-gray-600 line-clamp-2">Founder in the IT Services and IT Consulting industry...</p>
                  <button className="mt-2 border border-outline-variant text-gray-700 font-label-md px-4 py-1 rounded-full hover:bg-surface-container-low transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
