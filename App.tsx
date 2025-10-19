
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';
import { FilterProvider } from './context/FilterContext.tsx';

import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import BottomNavBar from './components/BottomNavBar.tsx';

import HomePage from './pages/HomePage.tsx';
import WatchPage from './pages/WatchPage.tsx';
import LeaderboardPage from './pages/LeaderboardPage.tsx';
import SubmitPage from './pages/SubmitPage.tsx';
import JudgePage from './pages/JudgePage.tsx';
import FinalSubmitPage from './pages/FinalSubmitPage.tsx';


const App: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-text-secondary mt-2">This page has not been implemented yet.</p>
    </div>
  );

  return (
    <AuthProvider>
      <ProjectProvider>
        <FilterProvider>
          <Router>
            <div className="bg-background text-text-primary min-h-screen font-sans">
              <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />
              <div className={`pt-16 bg-background transition-all duration-300 ease-in-out md:pb-0 pb-16 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <Header isSidebarCollapsed={isSidebarCollapsed} />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/watch/:projectId" element={<WatchPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/submit" element={<SubmitPage />} />
                    <Route path="/judge" element={<JudgePage />} />
                    <Route path="/following" element={<PlaceholderPage title="Following" />} />
                    <Route path="/final-submit" element={<FinalSubmitPage />} />
                    {/* Redirect any unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
              <BottomNavBar />
            </div>
          </Router>
        </FilterProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;