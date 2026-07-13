import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function StudentProfileEditor({ profileData, handleSaveProfileInfo }) {
  const [editingSection, setEditingSection] = useState(null);
  
  // Local state for edits
  const [about, setAbout] = useState(profileData.about || '');
  const [skills, setSkills] = useState((profileData.skills || []).join(', '));
  const [experience, setExperience] = useState(profileData.experience || []);
  const [projects, setProjects] = useState(profileData.projects || []);

  // Form states for new items
  // Form states for new items
  const [newExp, setNewExp] = useState({ title: '', company: '', duration: '', description: '' });
  const [newProj, setNewProj] = useState({ title: '', link: '', description: '' });

  const { currentUser } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('document')) {
      alert('Please upload a PDF or DOC file.');
      return;
    }

    if (!currentUser) return;

    const storageRef = ref(storage, `resumes/${currentUser.uid}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Resume upload failed:", error);
        alert('Upload failed. Please try again.');
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        handleSaveProfileInfo({ 
          ...profileData, 
          resumeUrl: downloadURL,
          resumeName: file.name
        });
        setIsUploading(false);
        setUploadProgress(0);
      }
    );
  };

  const saveAbout = () => {
    handleSaveProfileInfo({ ...profileData, about });
    setEditingSection(null);
  };

  const saveSkills = () => {
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== '');
    handleSaveProfileInfo({ ...profileData, skills: skillsArray });
    setEditingSection(null);
  };

  const addExperience = () => {
    if (!newExp.title || !newExp.company) return;
    const updated = [...experience, newExp];
    setExperience(updated);
    handleSaveProfileInfo({ ...profileData, experience: updated });
    setNewExp({ title: '', company: '', duration: '', description: '' });
    setEditingSection(null);
  };

  const deleteExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    setExperience(updated);
    handleSaveProfileInfo({ ...profileData, experience: updated });
  };

  const addProject = () => {
    if (!newProj.title) return;
    const updated = [...projects, newProj];
    setProjects(updated);
    handleSaveProfileInfo({ ...profileData, projects: updated });
    setNewProj({ title: '', link: '', description: '' });
    setEditingSection(null);
  };

  const deleteProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    handleSaveProfileInfo({ ...profileData, projects: updated });
  };

  const renderModal = () => {
    if (!editingSection) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0">
            <h2 className="font-headline-sm font-bold text-on-surface">
              {editingSection === 'about' && 'Edit About'}
              {editingSection === 'skills' && 'Edit Skills'}
              {editingSection === 'experience' && 'Add Experience'}
              {editingSection === 'projects' && 'Add Project'}
            </h2>
            <button onClick={() => setEditingSection(null)} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {editingSection === 'about' && (
              <div className="space-y-4">
                <label className="block font-label-md text-on-surface-variant">About You</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary h-32"
                  value={about} onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <button onClick={saveAbout} className="w-full bg-primary text-white py-2 rounded-full font-bold hover:bg-primary/90 transition-colors">Save</button>
              </div>
            )}

            {editingSection === 'skills' && (
              <div className="space-y-4">
                <label className="block font-label-md text-on-surface-variant">Skills (Comma Separated)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary h-24"
                  value={skills} onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, JavaScript, Node.js"
                />
                <button onClick={saveSkills} className="w-full bg-primary text-white py-2 rounded-full font-bold hover:bg-primary/90 transition-colors">Save</button>
              </div>
            )}

            {editingSection === 'experience' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Title *</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} placeholder="Software Engineer Intern" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Company *</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} placeholder="Google" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Duration</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newExp.duration} onChange={e => setNewExp({...newExp, duration: e.target.value})} placeholder="Jun 2023 - Aug 2023" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Description</label>
                  <textarea className="w-full p-2 rounded border border-outline focus:border-primary" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} placeholder="What did you do?" />
                </div>
                <button onClick={addExperience} className="w-full bg-primary text-white py-2 rounded-full font-bold hover:bg-primary/90 transition-colors">Add Experience</button>
              </div>
            )}

            {editingSection === 'projects' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Project Title *</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} placeholder="E-commerce App" />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Link</label>
                  <input type="text" className="w-full p-2 rounded border border-outline focus:border-primary" value={newProj.link} onChange={e => setNewProj({...newProj, link: e.target.value})} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">Description</label>
                  <textarea className="w-full p-2 rounded border border-outline focus:border-primary" value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} placeholder="What is this project?" />
                </div>
                <button onClick={addProject} className="w-full bg-primary text-white py-2 rounded-full font-bold hover:bg-primary/90 transition-colors">Add Project</button>
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
          <h2 className="font-title-lg font-bold text-on-surface">About</h2>
          <button onClick={() => setEditingSection('about')} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <p className="text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">
          {profileData.about || "Add a summary to highlight your personality or work experience."}
        </p>
      </motion.div>

      {/* Resume Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Resume</h2>
          <div>
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResumeUpload}
              disabled={isUploading}
            />
            <label htmlFor="resume-upload" className="cursor-pointer bg-primary text-white font-label-md px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              {profileData.resumeUrl ? 'Update Resume' : 'Upload Resume'}
            </label>
          </div>
        </div>
        
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-label-sm text-on-surface-variant mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {profileData.resumeUrl ? (
          <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">picture_as_pdf</span>
              <div>
                <p className="font-label-md text-on-surface">{profileData.resumeName || 'Resume.pdf'}</p>
                <a href={profileData.resumeUrl} target="_blank" rel="noreferrer" className="text-body-sm text-primary hover:underline">View Document</a>
              </div>
            </div>
            <button 
              onClick={() => handleSaveProfileInfo({ ...profileData, resumeUrl: null, resumeName: null })}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Resume"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        ) : (
          <p className="text-body-md text-outline">No resume uploaded. Upload a PDF or DOC file to quickly apply for jobs.</p>
        )}
      </motion.div>

      {/* Experience Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Experience</h2>
          <button onClick={() => setEditingSection('experience')} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        
        {experience.length === 0 ? (
          <p className="text-body-md text-outline">No experience added yet.</p>
        ) : (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="flex gap-4 relative group border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center shrink-0 border border-outline-variant shadow-sm">
                  <span className="material-symbols-outlined text-outline-variant">domain</span>
                </div>
                <div className="grow">
                  <h3 className="font-label-lg font-bold text-on-surface">{exp.title}</h3>
                  <p className="font-body-md text-on-surface">{exp.company}</p>
                  <p className="font-body-sm text-outline">{exp.duration}</p>
                  {exp.description && <p className="mt-2 text-body-sm text-on-surface-variant whitespace-pre-line leading-relaxed">{exp.description}</p>}
                </div>
                <button onClick={() => deleteExperience(index)} className="absolute right-0 top-0 p-2 rounded-full hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Projects Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Projects</h2>
          <button onClick={() => setEditingSection('projects')} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        
        {projects.length === 0 ? (
          <p className="text-body-md text-outline">No projects added yet.</p>
        ) : (
          <div className="space-y-6">
            {projects.map((proj, index) => (
              <div key={index} className="relative group border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
                <h3 className="font-label-lg font-bold text-on-surface">{proj.title}</h3>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-primary hover:underline font-label-sm break-all">
                    {proj.link}
                  </a>
                )}
                {proj.description && <p className="mt-2 text-body-sm text-on-surface-variant whitespace-pre-line leading-relaxed">{proj.description}</p>}
                
                <button onClick={() => deleteProject(index)} className="absolute right-0 top-0 p-2 rounded-full hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Skills Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
          <h2 className="font-title-lg font-bold text-on-surface">Skills</h2>
          <button onClick={() => setEditingSection('skills')} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        
        {profileData.skills && profileData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1.5 bg-surface border border-outline-variant rounded-full font-label-md text-on-surface shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-body-md text-outline">No skills added yet.</p>
        )}
      </motion.div>

      {renderModal()}
    </div>
  );
}
