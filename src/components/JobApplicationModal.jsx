import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function JobApplicationModal({ job, recruiterId, onClose }) {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    whyWantProfile: '',
    whyBestSuited: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hasResume = !!currentUser?.resumeUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasResume) {
      setError('You must upload a resume to your profile before applying.');
      return;
    }

    if (!formData.name || !formData.whyWantProfile || !formData.whyBestSuited) {
      setError('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'applications'), {
        jobId: job.id || 'legacy-job',
        jobTitle: job.title,
        recruiterId,
        applicantId: currentUser.uid,
        applicantName: formData.name,
        applicantPhoto: currentUser.photoURL,
        whyWantProfile: formData.whyWantProfile,
        whyBestSuited: formData.whyBestSuited,
        resumeUrl: currentUser.resumeUrl,
        appliedAt: Date.now()
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10">
          <h2 className="font-headline-sm font-bold text-on-surface">Apply for {job.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              </div>
              <h3 className="font-title-lg font-bold text-on-surface mb-2">Application Submitted!</h3>
              <p className="text-body-md text-on-surface-variant mb-6">Your application has been successfully sent to the recruiter.</p>
              <button onClick={onClose} className="bg-primary text-white font-label-md px-6 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!hasResume && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-3 items-start">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <div>
                    <p className="font-bold mb-1">Resume Required</p>
                    <p>You need to upload your resume before you can apply. Please go to your profile to upload it.</p>
                    <Link to="/profile" className="inline-block mt-2 font-bold underline hover:text-red-800">Go to My Profile</Link>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm font-label-sm">{error}</p>}

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Why do you want this profile?</label>
                <textarea 
                  value={formData.whyWantProfile} 
                  onChange={(e) => setFormData({...formData, whyWantProfile: e.target.value})}
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-surface h-24 resize-none"
                  placeholder="Explain your interest in this specific role..."
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Why do you think you are best suited for the job?</label>
                <textarea 
                  value={formData.whyBestSuited} 
                  onChange={(e) => setFormData({...formData, whyBestSuited: e.target.value})}
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-surface h-24 resize-none"
                  placeholder="Highlight your skills and experiences that match..."
                  required
                />
              </div>
              
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl">description</span>
                  <div>
                    <p className="font-label-md text-on-surface">Your Resume</p>
                    <p className="text-body-sm text-on-surface-variant">Will be attached automatically</p>
                  </div>
                </div>
                {hasResume ? (
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-red-500">cancel</span>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface-container-lowest">
                <button type="button" onClick={onClose} className="px-5 py-2 rounded-full font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !hasResume}
                  className="bg-primary text-white px-6 py-2 rounded-full font-label-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
