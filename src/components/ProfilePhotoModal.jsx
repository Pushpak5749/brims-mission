import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';
import { useAuth } from '../context/AuthContext';

export default function ProfilePhotoModal({ isOpen, onClose }) {
  const { currentUser, updateProfilePhoto } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [scale, setScale] = useState(1);
  const [filter, setFilter] = useState('none'); // none, grayscale, sepia, contrast
  const editorRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      // Returns a canvas element
      const canvas = editorRef.current.getImageScaledToCanvas();
      
      // Apply CSS filter directly to the canvas context before extracting data
      const ctx = canvas.getContext('2d');
      if (filter !== 'none') {
        const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Note: For a robust implementation, we would manipulate pixels directly or draw a new canvas.
        // For this mock, we will rely on a neat trick: draw it to an offscreen canvas and re-draw with filter.
        const offscreen = document.createElement('canvas');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const octx = offscreen.getContext('2d');
        octx.putImageData(originalData, 0, 0);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (filter === 'grayscale') ctx.filter = 'grayscale(100%)';
        if (filter === 'sepia') ctx.filter = 'sepia(100%)';
        if (filter === 'contrast') ctx.filter = 'contrast(150%)';
        
        ctx.drawImage(offscreen, 0, 0);
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      updateProfilePhoto(dataUrl);
      onClose();
      setImageFile(null); // Reset
      setFilter('none');
      setScale(1);
    }
  };

  const handleDelete = () => {
    if (currentUser) {
      const defaultUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.displayName) + "&background=800000&color=fff";
      updateProfilePhoto(defaultUrl);
      onClose();
    }
  };

  const currentImgSrc = currentUser?.photoURL;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-sm font-bold text-gray-900">Profile Photo</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-gray-600">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col items-center flex-grow bg-surface-container-lowest">
              {!imageFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 relative group">
                    <img src={currentImgSrc} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-body-sm text-gray-500 text-center mb-6">Your profile photo helps other professionals recognize you.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="border border-outline-variant rounded-lg overflow-hidden bg-gray-50 p-4 mb-4 flex justify-center w-full">
                    <AvatarEditor
                      ref={editorRef}
                      image={imageFile}
                      width={200}
                      height={200}
                      border={30}
                      color={[0, 0, 0, 0.4]}
                      scale={scale}
                      rotate={0}
                      borderRadius={100}
                      className={
                        filter === 'grayscale' ? 'grayscale' :
                        filter === 'sepia' ? 'sepia' :
                        filter === 'contrast' ? 'contrast-150' : ''
                      }
                    />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-label-sm font-bold text-gray-700 mb-1 block">Zoom</label>
                      <input 
                        type="range" 
                        min="1" max="3" step="0.01" 
                        value={scale} 
                        onChange={(e) => setScale(parseFloat(e.target.value))} 
                        className="w-full accent-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="text-label-sm font-bold text-gray-700 mb-2 block">Filters</label>
                      <div className="flex gap-2">
                        {['none', 'grayscale', 'sepia', 'contrast'].map(f => (
                          <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-[12px] font-bold capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-outline-variant bg-gray-50 flex justify-between items-center gap-2">
              {!imageFile ? (
                <>
                  <div className="flex gap-2">
                    <label className="bg-primary text-white font-label-md px-4 py-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      Update Photo
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <button onClick={handleDelete} className="border border-red-200 text-red-600 hover:bg-red-50 font-label-md px-4 py-2 rounded-full transition-colors">
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setImageFile(null)} className="font-label-md px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="bg-primary text-white font-label-md px-6 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                    Apply & Save
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
