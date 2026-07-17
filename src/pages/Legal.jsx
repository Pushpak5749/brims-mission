import React, { useState } from 'react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-4xl mx-auto py-12 w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button onClick={() => setActiveTab('privacy')} className={`px-4 py-3 text-left rounded-xl font-bold transition-colors ${activeTab === 'privacy' ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'}`}>
            Privacy Policy
          </button>
          <button onClick={() => setActiveTab('terms')} className={`px-4 py-3 text-left rounded-xl font-bold transition-colors ${activeTab === 'terms' ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'}`}>
            Terms & Conditions
          </button>
          <button onClick={() => setActiveTab('refund')} className={`px-4 py-3 text-left rounded-xl font-bold transition-colors ${activeTab === 'refund' ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'}`}>
            Refund Policy
          </button>
          <button onClick={() => setActiveTab('cookie')} className={`px-4 py-3 text-left rounded-xl font-bold transition-colors ${activeTab === 'cookie' ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'}`}>
            Cookie Policy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
          {activeTab === 'privacy' && (
            <div>
              <h1 className="font-display-sm font-bold mb-6">Privacy Policy</h1>
              <div className="prose prose-sm max-w-none text-on-surface-variant space-y-4">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                <h3 className="font-bold text-on-surface mt-6 mb-2">1. The data we collect about you</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, and Profile Data.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'terms' && (
            <div>
              <h1 className="font-display-sm font-bold mb-6">Terms & Conditions</h1>
              <div className="prose prose-sm max-w-none text-on-surface-variant space-y-4">
                <p>Please read these terms and conditions carefully before using our service.</p>
                <h3 className="font-bold text-on-surface mt-6 mb-2">1. Acknowledgment</h3>
                <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company.</p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div>
              <h1 className="font-display-sm font-bold mb-6">Refund Policy</h1>
              <div className="prose prose-sm max-w-none text-on-surface-variant space-y-4">
                <p>Thank you for subscribing to our services at Brims Mission.</p>
                <p>We offer a full money-back guarantee for all purchases made on our website within the first 14 days of purchase. If you are not satisfied with the product that you have purchased from us, you can get your money back no questions asked.</p>
              </div>
            </div>
          )}

          {activeTab === 'cookie' && (
            <div>
              <h1 className="font-display-sm font-bold mb-6">Cookie Policy</h1>
              <div className="prose prose-sm max-w-none text-on-surface-variant space-y-4">
                <p>This Cookie Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use.</p>
                <h3 className="font-bold text-on-surface mt-6 mb-2">1. Use of Cookies</h3>
                <p>We use Cookies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
