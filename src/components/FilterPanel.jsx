import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAINS = ['CSE', 'Carpenter', 'LAW', 'MBA', 'BBA', 'Design', 'IT'];

export default function FilterPanel({ portfolios, selectedDomains, setSelectedDomains, selectedSkills, setSelectedSkills }) {
  const [isDomainsOpen, setIsDomainsOpen] = useState(true);
  const [isSkillsOpen, setIsSkillsOpen] = useState(true);

  // Extract all unique skills from all fetched portfolios
  const allSkills = Array.from(
    new Set(portfolios.flatMap(p => p.skills || []))
  ).filter(Boolean).sort();

  const handleDomainToggle = (domain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const clearFilters = () => {
    setSelectedDomains([]);
    setSelectedSkills([]);
  };

  const hasFilters = selectedDomains.length > 0 || selectedSkills.length > 0;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-title-md font-bold text-on-surface">Filters</h3>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-label-sm font-bold text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Domains Filter */}
      <div className="mb-4">
        <button 
          onClick={() => setIsDomainsOpen(!isDomainsOpen)}
          className="flex justify-between items-center w-full font-label-md font-bold text-on-surface mb-2"
        >
          <span>Domains</span>
          <span className="material-symbols-outlined text-[18px]">
            {isDomainsOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        <AnimatePresence>
          {isDomainsOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2"
            >
              {DOMAINS.map(domain => (
                <label key={domain} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedDomains.includes(domain)}
                    onChange={() => handleDomainToggle(domain)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {domain}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <hr className="border-outline-variant my-4" />

      {/* Skills Filter */}
      <div>
        <button 
          onClick={() => setIsSkillsOpen(!isSkillsOpen)}
          className="flex justify-between items-center w-full font-label-md font-bold text-on-surface mb-2"
        >
          <span>Skills</span>
          <span className="material-symbols-outlined text-[18px]">
            {isSkillsOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        <AnimatePresence>
          {isSkillsOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {allSkills.length > 0 ? (
                allSkills.map(skill => (
                  <label key={skill} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors line-clamp-1">
                      {skill}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-body-sm text-outline">No skills available.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
