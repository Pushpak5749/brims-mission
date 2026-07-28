import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'));
        const querySnapshot = await getDocs(q);
        const jobsList = [];
        querySnapshot.forEach((doc) => {
          jobsList.push({ id: doc.id, ...doc.data() });
        });
        jobsList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesLocation = !locationTerm || 
      (job.location && job.location.toLowerCase().includes(locationTerm.toLowerCase()));

    return matchesSearch && matchesLocation;
  });

  const displayedJobs = filteredJobs.slice(0, 6);

  const handleJobClick = () => {
    // Force users to login to view/apply for jobs if they are clicking from the public homepage
    navigate('/login');
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (locationTerm) params.append('location', locationTerm);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16">
      
      {/* Hero Section */}
      <section className="relative px-margin-mobile md:px-margin-desktop py-20 lg:py-32 overflow-hidden flex flex-col items-center text-center">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-surface">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1 }} transition={{ duration: 1.5 }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-secondary blur-[100px]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-primary blur-[100px]"
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl z-10"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary-container text-on-primary-container font-label-md font-bold mb-6">Welcome to Brims Mission</span>
          <h1 className="font-display-lg md:font-display-xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
            Empowering Your Career Journey.
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Find the best job near you. Discover tailored internships and access the tools you need to build a stellar professional profile.
          </p>
          
          {/* Main Search Bar */}
          <div className="bg-surface p-2 md:p-3 rounded-full shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-outline-variant items-center w-full">
            <div className="flex-1 flex items-center px-4 py-2 bg-surface-container-lowest rounded-full md:border-r border-outline-variant md:rounded-r-none w-full">
              <span className="material-symbols-outlined text-outline mr-3">search</span>
              <input 
                type="text" 
                placeholder="Search Job Title, Role" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent focus:outline-none text-body-lg text-on-surface placeholder:text-outline"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 bg-surface-container-lowest rounded-full md:rounded-l-none w-full">
              <span className="material-symbols-outlined text-outline mr-3">location_on</span>
              <select 
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent focus:outline-none text-body-lg text-on-surface appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Noida">Noida</option>
                <option value="Remote">Remote</option>
              </select>
              <span className="material-symbols-outlined text-outline ml-2 pointer-events-none">expand_more</span>
            </div>
            <button 
              onClick={handleSearchClick}
              className="bg-primary text-white font-label-lg font-bold px-10 py-4 rounded-full hover:bg-primary/90 transition-colors w-full md:w-auto shadow-sm"
            >
              SEARCH
            </button>
          </div>
          <div className="mt-6 text-on-surface-variant font-medium">
            <span className="text-primary font-bold">{jobs.length}+</span> active job vacancies to grab
          </div>
        </motion.div>
      </section>

      {/* Featured Jobs Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-4">
            <div className="flex gap-8">
              <h2 className="font-title-lg font-bold text-primary border-b-2 border-primary pb-4 -mb-[18px]">Top Job Roles</h2>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant">No jobs found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayedJobs.map(job => (
                <div 
                  key={job.id} 
                  onClick={handleJobClick}
                  className="bg-surface border border-outline-variant rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mb-4 shadow-sm border border-outline-variant overflow-hidden p-2 group-hover:scale-110 transition-transform">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-primary">work</span>
                    )}
                  </div>
                  <h3 className="font-title-sm font-bold text-on-surface mb-1 line-clamp-2">{job.title}</h3>
                  <p className="text-label-sm text-on-surface-variant">{job.company}</p>
                </div>
              ))}
              
              {filteredJobs.length > 6 && (
                <Link to="/jobs" className="bg-primary border border-primary rounded-2xl p-6 text-center flex flex-col items-center justify-center hover:bg-primary/90 transition-all text-white group">
                  <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">grid_view</span>
                  <h3 className="font-title-sm font-bold mb-1">View All</h3>
                  <p className="text-label-sm text-primary-container">{filteredJobs.length} Active Jobs</p>
                </Link>
              )}
            </div>
          )}
        </div>
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
