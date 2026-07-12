import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileInfoModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    university: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || '',
        location: initialData.location || '',
        university: initialData.university || ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h2 className="font-headline-sm font-bold text-gray-900">Edit Intro</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-gray-600">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-body-sm text-gray-500 mb-6">* Indicates required</p>
              
              <form id="profileInfoForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-label-md font-bold text-gray-700 mb-1 block">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                  />
                </div>
                
                <div>
                  <label className="text-label-md font-bold text-gray-700 mb-1 block">Headline *</label>
                  <textarea 
                    name="role"
                    required
                    rows="3"
                    value={formData.role} 
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                  ></textarea>
                </div>

                <div>
                  <label className="text-label-md font-bold text-gray-700 mb-1 block">Current University / Company</label>
                  <input 
                    type="text" 
                    name="university"
                    value={formData.university} 
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                  />
                </div>

                <div>
                  <label className="text-label-md font-bold text-gray-700 mb-1 block">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location} 
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded-md p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-outline-variant bg-surface flex justify-end gap-2">
              <button onClick={onClose} className="font-label-md px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                Cancel
              </button>
              <button type="submit" form="profileInfoForm" className="bg-primary text-white font-label-md px-6 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
