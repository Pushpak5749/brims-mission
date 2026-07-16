import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';
import Discover from './pages/Discover';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Search from './pages/Search';
import Login from './pages/Login';
import CreatePortfolio from './pages/CreatePortfolio';
import { MessagingProvider } from './context/MessagingContext';

import HirerLayout from './components/HirerLayout';
import HirerOverview from './pages/HirerOverview';
import HirerProfile from './pages/HirerProfile';
import HirerJobs from './pages/HirerJobs';
import HirerCandidates from './pages/HirerCandidates';
import HirerOnboarding from './pages/HirerOnboarding';

import StudentLayout from './components/StudentLayout';
import StudentOnboarding from './pages/StudentOnboarding';
import StudentOverview from './pages/StudentOverview';
import StudentProfile from './pages/StudentProfile';
import StudentApplications from './pages/StudentApplications';
import StudentSavedJobs from './pages/StudentSavedJobs';
import StudentResume from './pages/StudentResume';

function App() {
  return (
    <>
      <MessagingProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Profile />} />
          <Route path="profile/view/:id" element={<ViewProfile />} />
          <Route path="discover" element={<Discover />} />
          <Route path="network" element={<Network />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="search" element={<Search />} />
          <Route path="portfolio/create" element={<CreatePortfolio />} />
          <Route path="hirer/onboarding" element={<HirerOnboarding />} />
        </Route>
        
        {/* Dedicated Hirer Dashboard Routes */}
        <Route path="/hirer" element={<HirerLayout />}>
          <Route path="dashboard" element={<HirerOverview />} />
          <Route path="profile" element={<HirerProfile />} />
          <Route path="jobs" element={<HirerJobs />} />
          <Route path="candidates" element={<HirerCandidates />} />
        </Route>

        {/* Dedicated Student Dashboard Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentOverview />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="saved" element={<StudentSavedJobs />} />
          <Route path="resume" element={<StudentResume />} />
        </Route>
        
        {/* Onboarding outside of specific layouts to keep it clean */}
        <Route path="/student/onboarding" element={<StudentOnboarding />} />
      </Routes>
    </BrowserRouter>
    </MessagingProvider>
    </>
  );
}

export default App;
