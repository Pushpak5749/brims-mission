import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function HirerOnboarding() {
  const { currentUser, updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    industryType: '',
    gstNumber: '',
    companyEmail: '',
    website: '',
    address: '',
    hrContact: '',
    logoUrl: '' // In a real app, this would be a file upload to Firebase Storage
  });

  // If they already did onboarding, send them to dashboard
  useEffect(() => {
    if (currentUser?.verificationStatus) {
      navigate('/hirer/dashboard');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedData = {
        ...formData,
        displayName: formData.companyName, // Override display name with company name
        verificationStatus: 'pending',
        status: 'hiring', // Ensure status is set
        accountType: 'hirer',
        role: formData.industryType
      };
      
      await updateDoc(userRef, updatedData);
      
      // Update local context manually if onAuthStateChanged doesn't trigger immediately
      if (updateProfileInfo) {
         // Assuming updateProfileInfo exists or we just rely on navigation
      }

      navigate('/hirer/dashboard');
    } catch (error) {
      console.error("Error saving company profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-28 md:pb-12 max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="text-center mb-10">
        <h1 className="font-display-md text-primary mb-2">Company Registration</h1>
        <p className="text-body-lg text-on-surface-variant">Tell us about your company to start hiring top talent.</p>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">Company Name *</label>
              <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">Industry Type *</label>
              <input required type="text" name="industryType" value={formData.industryType} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="Software, Finance, Design..." />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">Company Email *</label>
              <input required type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="hr@acmecorp.com" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">HR Contact Number *</label>
              <input required type="text" name="hrContact" value={formData.hrContact} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">GST Number (Optional)</label>
              <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="e.g. 22AAAAA0000A1Z5" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-2">Website URL</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors" placeholder="https://acmecorp.com" />
            </div>
          </div>
          
          <div>
            <label className="block font-label-md text-on-surface-variant mb-2">Company Address *</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:outline-none focus:border-primary transition-colors custom-scrollbar" placeholder="Full Head Office Address..."></textarea>
          </div>

          <div className="bg-surface-container p-4 rounded-xl flex gap-4 items-center">
            <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
            <p className="text-body-sm text-on-surface-variant">Your company profile will go through a quick verification process to ensure authenticity. You can start posting jobs immediately, but they will be marked as "Unverified" until approved.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-full font-label-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Profile...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
