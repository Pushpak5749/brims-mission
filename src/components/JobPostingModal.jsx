import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobPostingModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time', // Job or Internship or Contract
    description: '',
    skills: '', // Comma separated
    salary: '',
    location: '',
    experience: '',
    vacancies: 1,
    deadline: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || '')
      });
    } else {
      setFormData({
        title: '', type: 'Full-time', description: '', skills: '', salary: '', location: '', experience: '', vacancies: 1, deadline: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setFormData({
      title: '', type: 'Full-time', description: '', skills: '', salary: '', location: '', experience: '', vacancies: 1, deadline: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10">
          <h2 className="font-headline-sm font-bold text-on-surface">{initialData ? 'Edit Job Posting' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Job Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="e.g. Senior React Developer" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Employment Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary appearance-none">
                  <option value="Full-time">Full-time Job</option>
                  <option value="Part-time">Part-time Job</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Location *</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="Remote, Hybrid, or City" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Salary Package</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="e.g. $80k - $100k / ₹12LPA" />
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Experience Required</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="e.g. 2-4 Years, Fresher" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Number of Vacancies</label>
                <input type="number" min="1" name="vacancies" value={formData.vacancies} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1">Application Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1">Required Skills (Comma separated) *</label>
              <input required type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="React, Node.js, TypeScript" />
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1">Job Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary custom-scrollbar" placeholder="Describe the role, responsibilities, and what you're looking for..."></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface sticky bottom-0 z-10 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-full font-label-md text-on-surface hover:bg-surface-container-low transition-colors">
            Cancel
          </button>
          <button type="submit" form="job-form" className="px-6 py-2 rounded-full bg-primary text-white font-label-md hover:bg-primary/90 transition-colors shadow-sm">
            {initialData ? 'Save Changes' : 'Post Job'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
