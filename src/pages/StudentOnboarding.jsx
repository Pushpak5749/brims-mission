import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function StudentOnboarding() {
  const { currentUser, updateProfileInfo } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    mobile: '',
    address: '',
    education: '',
    skills: '',
    linkedin: '',
    portfolio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      await updateProfileInfo({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        onboardingComplete: true
      });
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant shadow-lg">
        <h1 className="font-display-sm text-primary mb-2 text-center">Complete Your Job Searcher Profile</h1>
        <p className="text-body-lg text-on-surface-variant text-center mb-8">This helps employers find you and matches you with the best opportunities.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">Mobile Number</label>
              <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">Current Address</label>
              <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-on-surface font-bold mb-2">Highest Education</label>
            <input required type="text" placeholder="e.g. B.Tech in Computer Science, 2024" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          
          <div>
            <label className="block font-label-md text-on-surface font-bold mb-2">Skills (comma separated)</label>
            <input required type="text" placeholder="e.g. React, Node.js, Design" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">LinkedIn Profile URL</label>
              <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block font-label-md text-on-surface font-bold mb-2">Portfolio / GitHub URL</label>
              <input type="url" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-label-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Complete Setup & Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
