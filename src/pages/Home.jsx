import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16">
      
      {/* Hero Section */}
      <section className="relative px-margin-mobile md:px-margin-desktop py-20 lg:py-32 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-primary/5 -z-10 rounded-b-[3rem]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary-container text-on-primary-container font-label-md font-bold mb-6">Welcome to Brims Mission</span>
          <h1 className="font-display-lg md:font-display-xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
            Empowering Your Career Journey.
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Connect with top companies, discover tailored internships, and access the tools you need to build a stellar professional profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-primary text-white rounded-full font-label-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
              Get Started Now
            </Link>
            <Link to="/jobs" className="px-8 py-4 bg-surface-container text-on-surface rounded-full font-label-lg font-bold hover:bg-surface-container-high transition-colors w-full sm:w-auto border border-outline-variant">
              Browse Jobs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About BRIM Mission Summary */}
      <section className="px-margin-mobile md:px-margin-desktop py-20 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display-sm font-bold text-on-surface mb-6">About BRIM Mission</h2>
            <p className="text-body-lg text-on-surface-variant mb-6">
              Brims Mission is an innovative talent platform designed to bridge the gap between emerging professionals and forward-thinking companies. We go beyond traditional job boards by offering comprehensive career services and a dedicated internship portal.
            </p>
            <Link to="/about" className="font-bold text-primary flex items-center gap-1 hover:underline">
              Read our full story <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
              <h3 className="font-display-md font-bold text-primary mb-2">10k+</h3>
              <p className="text-body-sm text-on-surface-variant font-medium uppercase tracking-wider">Active Users</p>
            </div>
            <div className="text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
              <h3 className="font-display-md font-bold text-primary mb-2">5k+</h3>
              <p className="text-body-sm text-on-surface-variant font-medium uppercase tracking-wider">Jobs Posted</p>
            </div>
            <div className="text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
              <h3 className="font-display-md font-bold text-primary mb-2">500+</h3>
              <p className="text-body-sm text-on-surface-variant font-medium uppercase tracking-wider">Companies</p>
            </div>
            <div className="text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
              <h3 className="font-display-md font-bold text-primary mb-2">24/7</h3>
              <p className="text-body-sm text-on-surface-variant font-medium uppercase tracking-wider">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-margin-mobile md:px-margin-desktop py-20 bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display-sm font-bold text-on-surface mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">person_add</span>
              </div>
              <h3 className="font-title-lg font-bold mb-3">1. Create a Profile</h3>
              <p className="text-body-md text-on-surface-variant">Sign up and build a comprehensive portfolio showcasing your skills, education, and experience.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">search</span>
              </div>
              <h3 className="font-title-lg font-bold mb-3">2. Discover Opportunities</h3>
              <p className="text-body-md text-on-surface-variant">Browse our extensive directory of jobs, internships, and top-tier companies tailored to you.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">send</span>
              </div>
              <h3 className="font-title-lg font-bold mb-3">3. Apply & Connect</h3>
              <p className="text-body-md text-on-surface-variant">Easily apply to roles with one click and communicate directly with recruiters via our messaging platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-surface-container border-t border-outline-variant pt-16 pb-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-headline-md font-extrabold text-primary tracking-tight mb-4">Brims Mission</h2>
            <p className="text-body-sm text-on-surface-variant max-w-sm mb-6">
              Bridging the gap between talent and opportunity. Your ultimate platform for career growth, networking, and professional development.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined">link</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-title-md font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/jobs" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Job Listings</Link></li>
              <li><Link to="/internships" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Internship Portal</Link></li>
              <li><Link to="/companies" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Company Directory</Link></li>
              <li><Link to="/training" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Training Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-title-md font-bold mb-4">Support & Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/legal" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} Brims Mission. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
