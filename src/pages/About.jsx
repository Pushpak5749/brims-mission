import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-24 px-margin-mobile md:px-margin-desktop text-on-surface">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="font-display-lg font-bold mb-8">About Brims Mission</h1>
        <p className="text-body-lg text-on-surface-variant mb-6">
          Brims Mission is dedicated to transforming the way emerging talent connects with opportunities. We believe that everyone deserves access to the right career paths, regardless of their background.
        </p>
        
        <h2 className="font-title-lg font-bold mt-12 mb-4">Our Mission & Vision</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          Our mission is to empower professionals by providing them with a comprehensive suite of career services, internship opportunities, and a direct line to forward-thinking companies. Our vision is a world where talent and opportunity meet seamlessly.
        </p>
        
        <h2 className="font-title-lg font-bold mt-12 mb-4">Message from the Founder</h2>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant italic text-on-surface-variant">
          "We started Brims Mission because we saw a gap in the market. Job boards are too transactional. We wanted to build a community where career growth is continuous, supported by training, networking, and real human connection."
        </div>

        <h2 className="font-title-lg font-bold mt-12 mb-4">Our Team & Partners</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          We are backed by a diverse team of industry veterans, tech innovators, and HR specialists. We proudly collaborate with universities and top-tier corporations to bring exclusive opportunities to our users.
        </p>
      </div>
    </div>
  );
}
