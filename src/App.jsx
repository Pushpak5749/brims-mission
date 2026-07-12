import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import ViewProfile from './pages/ViewProfile';
import Discover from './pages/Discover';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import CreatePortfolio from './pages/CreatePortfolio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Profile />} />
          <Route path="profile/view/:id" element={<ViewProfile />} />
          <Route path="discover" element={<Discover />} />
          <Route path="network" element={<Network />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="portfolio/create" element={<CreatePortfolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
