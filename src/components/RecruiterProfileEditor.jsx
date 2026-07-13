import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationsViewerModal from './ApplicationsViewerModal';

export default function RecruiterProfileEditor({ profileData, handleSaveProfileInfo }) {
  const [editingSection, setEditingSection] = useState(null);
  const [viewingApplicationsJob, setViewingApplicationsJob] = useState(null);
  
  // Local state for edits
  const [about, setAbout] = useState(profileData.about || '');
  const [jobPosts, setJobPosts] = useState(profileData.jobPosts || []);

  // Form states for new items
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Full-time', description: '', applyLink: '' });

  const saveAbout = () => {
    handleSaveProfileInfo({ ...profileData, about });
    setEditingSection(null);
  };

  const addJobPost = () => {
    if (!newJob.title || !newJob.company) return;
    const newPost = { ...newJob, id: crypto.randomUUID(), createdAt: Date.now() };
    const updated = [...jobPosts, newPost];
    setJobPosts(updated);
    handleSaveProfileInfo({ ...profileData, jobPosts: updated });
    setNewJob({ title: '', company: '', location: '', type: 'Full-time', description: '', applyLink: '' });
    setEditingSection(null);
  };

  const deleteJobPost = (index) => {
    const updated = jobPosts.filter((_, i) => i !== index);
    setJobPosts(updated);
    handleSaveProfileInfo({ ...profileData, jobPosts: updated });
  };

  const renderModal = () => {
    if (!editingSection) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10">
            <h2 className="font-headline-sm font-bold text-on-surface">
              {editingSection === 'about' && 'Edit Recruiter Bio'}
              {editingSection === 'jobPosts' && 'Post a New Job'}
            </h2>
            <button onClick={() => setEditingSection(null)} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {editingSection === 'about' && (
              <div className="space-y-4">
                <label className="block font-label-md text-on-surface-variant">About You & Your Company</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary h-32"
                  value={about} onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell students about yourself and the company culture..."
                />
                <button onClick={saveAbout} className="w-full bg-primary text-white py-2 rounded-full font-bold hover:bg-primary/90 transition-colors">Save</button>
              </div>
            )}

            {editingSection === 'jobPosts' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Job Title *</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Junior Frontend Developer" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Company Name *</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} placeholder="Google" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-label-md text-on-surface-variant mb-1">Location</label>
                    <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="Remote / On-site" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-label-md text-on-surface-variant mb-1">Type</label>
                    <select className="w-full p-2 rounded border border-outline focus:border-primary" value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Application Link (Optional)</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newJob.applyLink} onChange={e => setNewJob({...newJob, applyLink: e.target.value})} placeholder="https://..." />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Job Description</label>
                  <textarea className="w-full p-2 rounded border border-outline focus:border-primary h-24" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="What are the responsibilities?" />
                </div>
                <button onClick={addJobPost} className="w-full bg-[#2E7D32] text-white py-2 rounded-full font-bold hover:bg-[#1B5E20] transition-colors">Post Job</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* About Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Recruiter Bio</h2>
          <button onClick={() => setEditingSection('about')} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <p className="text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">
          {profileData.about || "Add a summary to highlight your role and what kind of talent you're looking for."}
        </p>
      </motion.div>

      {/* Job Postings Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Active Job Postings</h2>
          <button onClick={() => setEditingSection('jobPosts')} className="p-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1 font-label-md">
            <span className="material-symbols-outlined text-sm">add</span> Add Job
          </button>
        </div>
        
        {jobPosts.length === 0 ? (
          <p className="text-body-md text-outline text-center py-6">You haven't posted any jobs yet. Students will not see an empty list.</p>
        ) : (
          <div className="space-y-6">
            {jobPosts.map((job, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 relative group border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-surface-container-low">
                <div className="w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center shrink-0 border border-outline-variant">
                  <span className="material-symbols-outlined text-primary">work</span>
                </div>
                <div className="grow">
                  <h3 className="font-title-md font-bold text-on-surface">{job.title}</h3>
                  <p className="font-body-md text-on-surface font-medium mt-1">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {job.type || 'Full-time'}</span>
                  </div>
                  {job.applyLink && (
                    <a href={job.applyLink.startsWith('http') ? job.applyLink : `https://${job.applyLink}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-label-sm block mt-1 break-all">
                      {job.applyLink}
                    </a>
                  )}
                  {job.description && <p className="mt-2 text-body-sm text-on-surface-variant whitespace-pre-line leading-relaxed">{job.description}</p>}
                  
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setViewingApplicationsJob(job)}
                      className="bg-primary/10 text-primary font-label-sm px-4 py-1.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      View Applications
                    </button>
                  </div>
                  
                  <button onClick={() => deleteJobPost(index)} className="absolute right-2 top-2 p-2 rounded-full hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {renderModal()}
      
      {viewingApplicationsJob && (
        <ApplicationsViewerModal 
          job={viewingApplicationsJob} 
          onClose={() => setViewingApplicationsJob(null)} 
        />
      )}
    </div>
  );
}
