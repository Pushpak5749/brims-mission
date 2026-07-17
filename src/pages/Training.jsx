import React from 'react';

export default function Training() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-6xl mx-auto py-12 w-full text-center">
        <h1 className="font-display-lg font-bold mb-4">Training & Career Services</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-16">
          Level up your career with our exclusive resources, ranging from resume building to interview prep and skill development.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">description</span>
            </div>
            <h3 className="font-title-lg font-bold mb-3">Resume Building</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Create a standout resume with our smart templates designed by HR experts.</p>
            <button className="mt-auto px-6 py-2 bg-surface-container border border-outline-variant rounded-full font-bold hover:bg-surface-container-high transition-colors text-sm">Coming Soon</button>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">record_voice_over</span>
            </div>
            <h3 className="font-title-lg font-bold mb-3">Interview Prep</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Practice with AI-driven mock interviews and get actionable feedback.</p>
            <button className="mt-auto px-6 py-2 bg-surface-container border border-outline-variant rounded-full font-bold hover:bg-surface-container-high transition-colors text-sm">Coming Soon</button>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">lightbulb</span>
            </div>
            <h3 className="font-title-lg font-bold mb-3">Skill Courses</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Enroll in micro-courses designed to teach you the most in-demand skills.</p>
            <button className="mt-auto px-6 py-2 bg-surface-container border border-outline-variant rounded-full font-bold hover:bg-surface-container-high transition-colors text-sm">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}
