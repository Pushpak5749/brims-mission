import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HirerProfileEditor({ profileData, handleSaveProfileInfo, onClose }) {
  const [formData, setFormData] = useState({
    companyName: profileData?.companyName || '',
    industryType: profileData?.industryType || '',
    companyEmail: profileData?.companyEmail || '',
    hrContact: profileData?.hrContact || '',
    website: profileData?.website || '',
    gstNumber: profileData?.gstNumber || '',
    address: profileData?.address || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveProfileInfo(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10">
          <h2 className="font-headline-sm font-bold text-on-surface">Edit Company Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="hirer-profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Company Name</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Industry Type</label>
                <input required type="text" name="industryType" value={formData.industryType} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="e.g. Information Technology" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Company Email</label>
                <input required type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">HR Contact Name</label>
                <input required type="text" name="hrContact" value={formData.hrContact} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" placeholder="https://" />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">GST Number</label>
                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1">Registered Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary custom-scrollbar resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface sticky bottom-0 z-10 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-6 py-2 rounded-full font-label-md text-on-surface hover:bg-surface-container-low transition-colors">
            Cancel
          </button>
          <button type="submit" form="hirer-profile-form" className="px-6 py-2 rounded-full bg-primary text-white font-label-md hover:bg-primary/90 transition-colors shadow-sm">
            Save Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
