import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import MiniProfileCard from '../components/MiniProfileCard';

export default function Discover() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = React.useState([
    { id: 101, name: "Jordan Ellis", role: "Aspiring Product Designer", tags: ["Figma", "UI Design"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfQW9NyDHZDwDB_rJGh4v8cxeAyY2kdacpDockkX7kLAMqF1XM-vKA6FHUx9_liD2CUEdXrIDFMZX-LfHXKwntcWNwZ3X1Kx4EXC7d_4PXOjkIew2DikVq-jVkmwXEHeewCNH2WbRJvcuAZTygk-_XZNSd3TVCcDVo6Lt3hGK29GNf2g46M54qBNAx7c5RouzZDvXyg5l8h3asTTBtr1cFMZer4ldwDcd8IHMesEJOyvc8z1P62a0eeQiZTL3fTl3VkybEXEsUL1Y" },
    { id: 102, name: "Leo Zhang", role: "Full-stack Developer", tags: ["React", "Node.js"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAezh7peIpaHThLsII_3zwmBWn_cmaxhqyji0xBaDqUBUj3Hyfje-uYe2OrFh1qcn4zTZQXi8n92PCBynwkT8NIOzjTuRQvPQcnoQDojyByMDi1t6jqsnvH4CKqKQTrFWwD_JwFzRdzA5XRGfsa714o3MfzGZvmtCdOZE97S33apIZyyPKkrSrLx-oasDKHPsaB9nyjwO2UpJWk4aDP4_85AcgHTBRpQ1tFu7t989hclWi8AIiBz-88ArMkuh9-lk0NQ4fxaT1KwKI" },
    { id: 103, name: "Elena Rossi", role: "AI Ethics Researcher", tags: ["Python", "NLP"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9xho0VQE4Js80y6okUyuMgimPqXHQZlN3EYUWRZxp1-WLBJOol1s9b3Yjh-Czhw_o1GeJ8eiTi1TreRvJB1G6s7GE4Vv8lxJ2KJuyxUejPus1F-yjbvLcMmJIPzmbvhWkul89YNQb6PP7VS0R_8dTnquoKDgFTbrO-xmMC8irchOOavOhhCK-XRWWeLUIE6q_Tw8gKl7NjkOD1qDXV2r5sV2e3Osc48LsHBAty4qv-qhyu83w0scxo9kg4scNXsMeJFTpzPCuh2g" },
    { id: 104, name: "David Kim", role: "Financial Analyst", tags: ["SQL", "Modeling"], img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYDUBCqMEqMu4jJegXQASiGbPp2pHZof05u0VS0LaGGM3O_l8VfneWoCsoh9AKK7Dk1FxFRlYS99UypldCzZ2Ahb_H69VDDwe6JXyFmo8PhJ6QMaVKUdkCKHmZcDDcpLfr7nIpnuG2YOMP2RmiriT_qXAruYe-YrMl27DDCma0K0g3ny66cn_CHyOtJuS-Pif0j7WdJpMEjmNYTAs-3capeavHAmOetEeekc83vJSHs8W0dinMB8RSFpLcGT2oJC-i6DYR-b7pzb4" },
    { id: 105, name: "Anita Sharma", role: "Frontend Developer", tags: ["Vue", "CSS"], img: "https://ui-avatars.com/api/?name=Anita+Sharma&background=0D8ABC&color=fff" },
    { id: 106, name: "Mike Johnson", role: "Cloud Architect", tags: ["AWS", "Docker"], img: "https://ui-avatars.com/api/?name=Mike+Johnson&background=E53935&color=fff" }
  ]);

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
            <h1 className="font-display-sm text-gray-900 mb-2">Discover Students & Peers</h1>
            <p className="text-body-sm text-gray-600">Connect with students and early professionals showcasing high-impact projects.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolios.map((portfolio, i) => (
              <motion.div 
                key={portfolio.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-outline-variant rounded-xl flex flex-col p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/profile/view/${portfolio.id}`)}
              >
                <div className="flex flex-col items-center mb-3">
                  <img className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm mb-2" src={portfolio.img} alt={portfolio.name} />
                  <h4 className="font-label-md font-bold text-gray-900 text-center">{portfolio.name}</h4>
                  <p className="font-body-sm text-gray-500 text-center line-clamp-1">{portfolio.role}</p>
                </div>
                
                <div className="grow mb-4 flex justify-center">
                  <div className="flex gap-1 flex-wrap justify-center">
                    {portfolio.tags.map(tag => (
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
        </div>

      </div>
    </div>
  );
}
