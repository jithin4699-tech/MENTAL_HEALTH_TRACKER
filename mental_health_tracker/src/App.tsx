import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import AIToolsPage from './pages/AIToolsPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import JournalPage from './pages/JournalPage';
import HealthDashboardPage from './pages/HealthDashboardPage';
import AIAssistantPage from './pages/AIAssistantPage';
import GeminiAssistantPage from './pages/GeminiAssistantPage';
import LoginModal from './components/modals/LoginModal';
import ChatbotModal from './components/modals/ChatbotModal';

// Context
import { UserProvider } from './context/UserContext';
import { HealthMetricsProvider } from './context/HealthMetricsContext';

// Add FontAwesome icons to library
library.add(fas, fab);

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleChatClick = () => {
    setShowChatbotModal(true);
  };

  return (
    <UserProvider>
      <HealthMetricsProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Header onLoginClick={handleLoginClick} onChatClick={handleChatClick} />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage onChatClick={handleChatClick} />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/ai-tools" element={<AIToolsPage onChatClick={handleChatClick} />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/gemini-assistant" element={<GeminiAssistantPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/:id" element={<ResourceDetailPage onChatClick={handleChatClick} />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/health-dashboard" element={<HealthDashboardPage />} />
              </Routes>
            </main>
            
            <Footer />
            
            {/* Modals */}
            <LoginModal 
              isOpen={showLoginModal} 
              onClose={() => setShowLoginModal(false)} 
            />
            
            <ChatbotModal 
              isOpen={showChatbotModal} 
              onClose={() => setShowChatbotModal(false)} 
            />
          </div>
        </Router>
      </HealthMetricsProvider>
    </UserProvider>
  );
}

export default App;
