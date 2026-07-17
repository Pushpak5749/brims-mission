import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-6xl mx-auto py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="font-display-lg font-bold mb-4">Contact Us</h1>
          <p className="text-body-lg text-on-surface-variant mb-8">
            Have questions or need support? We'd love to hear from you. Fill out the form or reach out via our contact details.
          </p>
          
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h4 className="font-bold">Email Support</h4>
                <p className="text-body-sm text-on-surface-variant">support@brimsmission.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h4 className="font-bold">Phone</h4>
                <p className="text-body-sm text-on-surface-variant">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="font-bold">Headquarters</h4>
                <p className="text-body-sm text-on-surface-variant">123 Innovation Drive<br />Tech City, TC 90210</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 className="font-title-lg font-bold mb-6">Send a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Full Name</label>
              <input type="text" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Email Address</label>
              <input type="email" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Message</label>
              <textarea rows="4" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
