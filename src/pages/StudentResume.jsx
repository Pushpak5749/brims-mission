import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function StudentResume() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [certName, setCertName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData({ uid: currentUser.uid, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'resume' && file.type !== 'application/pdf' && !file.type.includes('document')) {
      alert('Please upload a PDF or DOC file for your resume.');
      return;
    }
    
    if (type === 'certificate' && !certName.trim()) {
      alert('Please enter a certificate name first.');
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration is missing.");
      return;
    }

    if (type === 'resume') setIsUploadingResume(true);
    else setIsUploadingCert(true);
    
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', type === 'resume' ? 'resumes' : 'certificates');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          let updatedData = {};
          
          if (type === 'resume') {
            updatedData = {
              resumeUrl: response.secure_url,
              resumeName: file.name
            };
          } else {
            const currentCerts = profileData.certificates || [];
            updatedData = {
              certificates: [...currentCerts, { name: certName, url: response.secure_url }]
            };
            setCertName('');
          }
          
          await updateDoc(docRef, updatedData);
          setProfileData(prev => ({ ...prev, ...updatedData }));
          
        } catch (err) {
          console.error("Error updating document", err);
        }
      } else {
        alert('Upload failed.');
      }
      setIsUploadingResume(false);
      setIsUploadingCert(false);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const deleteCertificate = async (index) => {
    try {
      const currentCerts = [...(profileData.certificates || [])];
      currentCerts.splice(index, 1);
      
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, { certificates: currentCerts });
      setProfileData(prev => ({ ...prev, certificates: currentCerts }));
    } catch (error) {
      console.error("Error deleting certificate", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-on-surface">
      <h1 className="font-display-sm mb-6">Resume & Certificates</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Section */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">description</span>
            <h2 className="font-title-lg font-bold">My Resume</h2>
          </div>

          {profileData?.resumeUrl ? (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                <span className="font-label-md font-bold truncate">{profileData.resumeName || 'Resume.pdf'}</span>
              </div>
              <a href={profileData.resumeUrl} target="_blank" rel="noreferrer" className="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center">
                <span className="material-symbols-outlined">download</span>
              </a>
            </div>
          ) : (
            <div className="bg-surface-container border border-outline-variant border-dashed rounded-xl p-8 text-center mb-6">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">upload_file</span>
              <p className="font-label-md text-on-surface-variant">No resume uploaded yet.</p>
            </div>
          )}

          <div className="relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={(e) => handleFileUpload(e, 'resume')} 
              disabled={isUploadingResume}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
            />
            <button disabled={isUploadingResume} className="w-full py-3 bg-primary text-white rounded-xl font-label-md font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              {isUploadingResume ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">upload</span>
                  {profileData?.resumeUrl ? 'Upload New Resume' : 'Upload Resume'}
                </>
              )}
            </button>
          </div>
          <p className="text-[12px] text-on-surface-variant mt-2 text-center">Supported formats: PDF, DOC, DOCX. Max size: 5MB.</p>
        </div>

        {/* Certificates Section */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-yellow-600">workspace_premium</span>
            <h2 className="font-title-lg font-bold">Certifications</h2>
          </div>

          <div className="space-y-3 mb-8">
            {(!profileData?.certificates || profileData.certificates.length === 0) ? (
              <p className="text-body-sm text-on-surface-variant italic">No certificates added yet.</p>
            ) : (
              profileData.certificates.map((cert, index) => (
                <div key={index} className="bg-surface-container border border-outline-variant rounded-xl p-3 flex justify-between items-center hover:border-primary transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-600">workspace_premium</span>
                    <a href={cert.url} target="_blank" rel="noreferrer" className="font-label-md font-bold hover:underline text-on-surface truncate max-w-[200px]">
                      {cert.name}
                    </a>
                  </div>
                  <button onClick={() => deleteCertificate(index)} className="text-outline-variant hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-outline-variant pt-6">
            <h3 className="font-label-md font-bold mb-3">Add New Certificate</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Certificate Name (e.g. AWS Certified Solutions Architect)" 
                value={certName}
                onChange={e => setCertName(e.target.value)}
                className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileUpload(e, 'certificate')} 
                  disabled={isUploadingCert || !certName.trim()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button disabled={isUploadingCert || !certName.trim()} className="w-full py-3 border border-primary text-primary rounded-xl font-label-md font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:border-outline disabled:text-outline-variant">
                  {isUploadingCert ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      Upload Certificate File
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
