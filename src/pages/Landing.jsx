import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const handleInteract = () => {
    navigate('/login');
  };

  const categories = [
    { icon: 'home_work', label: 'Remote' },
    { icon: 'apartment', label: 'MNC' },
    { icon: 'trending_up', label: 'Sales' },
    { icon: 'school', label: 'Internship' },
    { icon: 'analytics', label: 'Analytics' },
    { icon: 'rocket_launch', label: 'Startup' },
    { icon: 'groups', label: 'HR' },
    { icon: 'code', label: 'Software & IT' },
    { icon: 'engineering', label: 'Engineering' },
    { icon: 'local_shipping', label: 'Supply Chain' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center pt-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-4xl"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-3 tracking-tight leading-tight">
          Find your dream job now
        </h1>
        <p className="text-base md:text-xl text-on-surface-variant mb-8 md:mb-10">
          5 lakh+ jobs for you to explore
        </p>

        {/* Search Bar */}
        <div 
          onClick={handleInteract}
          className="bg-surface-container-lowest border border-outline-variant rounded-full shadow-lg p-1.5 md:p-3 flex items-center justify-between mx-auto w-full max-w-2xl cursor-pointer hover:shadow-xl hover:border-primary transition-all group"
        >
          <div className="flex items-center flex-grow px-3 md:px-4 opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant text-xl md:text-2xl mr-2 md:mr-3 shrink-0">search</span>
            <span className="text-on-surface-variant font-body-sm md:font-body-lg truncate">Enter skills / designations / companies</span>
          </div>
          <button className="bg-primary text-white font-label-md md:font-label-lg px-4 md:px-8 py-2 md:py-3 rounded-full hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap shrink-0">
            Search
          </button>
        </div>

        {/* Categories Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-4"
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={handleInteract}
              className="bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 md:px-5 md:py-3 flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors group shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px] md:text-[20px]">
                {cat.icon}
              </span>
              <span className="font-label-sm md:font-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                {cat.label}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[16px] md:text-[18px] ml-0.5">
                chevron_right
              </span>
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
