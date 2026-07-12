import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  
  const [skills, setSkills] = useState(['UI Design', 'Python']);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  const [experiences, setExperiences] = useState([
    { id: 1, title: '', company: '', duration: '', description: '' }
  ]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: '', company: '', duration: '', description: '' }]);
  };

  const handlePublish = () => {
    if (!fullName.trim() || !headline.trim()) {
      alert("Please fill out your Full Name and Headline before publishing!");
      return;
    }
    
    const newPortfolio = {
      name: fullName,
      role: headline,
      tags: skills.slice(0, 3), // Show top 3 skills on card
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAQqMhSeEdtunAhQq_OT0BfqkD-AI0iHEt_r9MRfROcNyR6aDuBX1s3JQaWuxwyiF1hG5tFWWJU75lVPITssCppVVdCvAwypLZ0TVeSbEd5QsTjIDHxs5TDeMMz_WnqOQiyR0crSlkeitn-F5OfLmF6lmHxpcQ-cZaLKGmucKuQU5hbGCId1HaqP2ykpbs4MEuPslKWdOaLZU4kdhh9pfGU6heG4gVR00qFxYLiJeI8DtcNtf5U4SYuBsXoV0pZyS62GmH6P2XlKA" // Default profile img
    };

    const existing = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
    localStorage.setItem('custom_portfolios', JSON.stringify([newPortfolio, ...existing]));
    
    navigate('/discover');
  };

  const handleSaveDraft = () => {
    alert("Draft saved to local storage!");
  };

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">Build Your Portfolio</h1>
          <p className="font-body-md text-on-surface-variant">Showcase your skills, experience, and projects to stand out to recruiters.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button onClick={handleSaveDraft} className="px-6 py-2 border border-primary text-primary font-label-md rounded-lg hover:bg-primary/5 transition-colors">Save Draft</button>
          <button onClick={handlePublish} className="px-6 py-2 bg-primary text-white font-label-md rounded-lg hover:opacity-90 transition-opacity">Publish</button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm"
        >
          <h2 className="font-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">person</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-label-md text-on-surface-variant">Full Name *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="e.g. Alex Chen" className="w-full px-4 py-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block font-label-md text-on-surface-variant">Headline / Desired Role *</label>
              <input value={headline} onChange={e => setHeadline(e.target.value)} type="text" placeholder="e.g. Aspiring Product Designer" className="w-full px-4 py-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block font-label-md text-on-surface-variant">University</label>
              <input type="text" placeholder="e.g. University of Excellence" className="w-full px-4 py-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block font-label-md text-on-surface-variant">Expected Graduation</label>
              <input type="text" placeholder="e.g. May 2025" className="w-full px-4 py-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            </div>
          </div>
        </motion.section>

        {/* About Me */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm"
        >
          <h2 className="font-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">edit_note</span>
            About Me
          </h2>
          <textarea 
            rows="4" 
            placeholder="Tell your story. What are you passionate about? What makes you unique?"
            className="w-full px-4 py-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none resize-none"
          ></textarea>
        </motion.section>

        {/* Skills */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm"
        >
          <h2 className="font-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">bolt</span>
            Skills & Keywords
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary text-label-md rounded-full border border-primary/20">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="material-symbols-outlined text-[16px] hover:text-error transition-colors">close</button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter (e.g. React, Data Analysis)" 
              className="w-full px-4 py-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" 
            />
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">work</span>
              Experience
            </h2>
            <button onClick={addExperience} className="flex items-center gap-1 text-primary font-label-md hover:underline">
              <span className="material-symbols-outlined text-sm">add</span> Add
            </button>
          </div>
          
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-surface-container rounded-lg border border-outline-variant relative group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-label-sm text-on-surface-variant">Role Title</label>
                    <input type="text" placeholder="e.g. Software Engineering Intern" className="w-full px-3 py-1.5 rounded-md border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-sm text-on-surface-variant">Company / Organization</label>
                    <input type="text" placeholder="e.g. TechCorp" className="w-full px-3 py-1.5 rounded-md border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-sm text-on-surface-variant">Duration</label>
                    <input type="text" placeholder="e.g. May 2023 - Aug 2023" className="w-full px-3 py-1.5 rounded-md border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-label-sm text-on-surface-variant">Description</label>
                    <textarea rows="2" placeholder="Describe your responsibilities and achievements..." className="w-full px-3 py-1.5 rounded-md border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CV Upload */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm"
        >
          <h2 className="font-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">upload_file</span>
            Resume / CV
          </h2>
          <label htmlFor="resume-upload" className="block border-2 border-dashed border-outline rounded-xl p-8 text-center hover:bg-surface-container transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors mb-2">
              {resumeFile ? 'task' : 'cloud_upload'}
            </span>
            <p className="font-label-md text-on-surface">
              {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
            </p>
            {!resumeFile && <p className="text-body-sm text-on-surface-variant mt-1">PDF or DOCX (MAX. 5MB)</p>}
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setResumeFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </motion.section>
      </div>

      <div className="mt-8 flex md:hidden flex-col gap-3">
        <button onClick={handlePublish} className="w-full py-3 bg-primary text-white font-label-md rounded-lg shadow-md active:scale-95 transition-transform">Publish Portfolio</button>
        <button onClick={handleSaveDraft} className="w-full py-3 border border-primary text-primary font-label-md rounded-lg active:scale-95 transition-transform">Save Draft</button>
      </div>
    </div>
  );
}
