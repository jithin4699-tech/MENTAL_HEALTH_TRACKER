import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../context/UserContext';

interface HeaderProps {
  onLoginClick: () => void;
  onChatClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onChatClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLoginClick();
    setIsMobileMenuOpen(false);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onChatClick();
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0.5 bg-gray-900 rounded-md flex items-center justify-center text-white font-bold text-xl">E</div>
            </div>
            <span className="text-white text-xl font-bold">Elite Coders</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              } transition-colors`}
            >
              <FontAwesomeIcon icon="home" className="mr-2" />
              Home
            </Link>
            <Link 
              to="/gemini-assistant" 
              className={`px-4 py-2 rounded-full ${
                isActive('/gemini-assistant') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-r from-blue-800 to-indigo-900 text-white hover:from-blue-700 hover:to-indigo-800'
              } transition-colors`}
            >
              <FontAwesomeIcon icon="brain" className="mr-2" />
              <span className="font-semibold">Gemini AI</span>
            </Link>
            <Link 
              to="/health-dashboard" 
              className={`px-4 py-2 rounded-full ${
                isActive('/health-dashboard') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              } transition-colors`}
            >
              <FontAwesomeIcon icon="heartbeat" className="mr-2" />
              Health
            </Link>
            <Link 
              to="/journal" 
              className={`px-4 py-2 rounded-full ${
                isActive('/journal') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              } transition-colors`}
            >
              <FontAwesomeIcon icon="book" className="mr-2" />
              Journal
            </Link>
            
            {/* More dropdown menu */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 flex items-center">
                <FontAwesomeIcon icon="ellipsis-h" className="mr-2" />
                More
                <FontAwesomeIcon icon="chevron-down" className="ml-2 text-xs" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link 
                  to="/assessment" 
                  className={`block px-4 py-2 text-sm ${
                    isActive('/assessment') 
                      ? 'text-blue-400 bg-gray-700' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon="clipboard-list" className="mr-2" />
                  Assessment
                </Link>
                <Link 
                  to="/ai-tools" 
                  className={`block px-4 py-2 text-sm ${
                    isActive('/ai-tools') 
                      ? 'text-blue-400 bg-gray-700' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon="robot" className="mr-2" />
                  AI Tools
                </Link>
                <Link 
                  to="/resources" 
                  className={`block px-4 py-2 text-sm ${
                    isActive('/resources') 
                      ? 'text-blue-400 bg-gray-700' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon="book-open" className="mr-2" />
                  Resources
                </Link>
                <Link 
                  to="/community" 
                  className={`block px-4 py-2 text-sm ${
                    isActive('/community') 
                      ? 'text-blue-400 bg-gray-700' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon="users" className="mr-2" />
                  Community
                </Link>
                {user && (
                  <Link 
                    to="/profile" 
                    className={`block px-4 py-2 text-sm ${
                      isActive('/profile') 
                        ? 'text-blue-400 bg-gray-700' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon="user" className="mr-2" />
                    Profile
                  </Link>
                )}
              </div>
            </div>
          </nav>
          
          {/* User Actions / Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* ChatAI Button */}
            <button
              onClick={handleChatClick}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
              title="Chat with AI Assistant"
            >
              <FontAwesomeIcon icon="robot" className="text-lg" />
            </button>

            {user ? (
              <div className="flex items-center">
                <div className="mr-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-lg font-semibold">{user.name.charAt(0)}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                      <FontAwesomeIcon icon="user" className="mr-2" />
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                      <FontAwesomeIcon icon="cog" className="mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
              >
                <FontAwesomeIcon icon="user" className="mr-2" />
                Sign In
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile ChatAI Button */}
            <button
              onClick={handleChatClick}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white"
              title="Chat with AI Assistant"
            >
              <FontAwesomeIcon icon="robot" className="text-lg" />
            </button>

            <button 
              className="focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FontAwesomeIcon icon="times" className="text-2xl" />
              ) : (
                <FontAwesomeIcon icon="bars" className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-gray-900 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className={`px-4 py-3 rounded-md ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon="home" className="mr-3" />
              Home
            </Link>
            <Link 
              to="/gemini-assistant" 
              className={`px-4 py-3 rounded-md ${
                isActive('/gemini-assistant') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-r from-blue-800 to-indigo-900 text-white'
              } flex items-center`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="bg-blue-700 rounded-full p-1.5 mr-2">
                <FontAwesomeIcon icon="brain" className="text-white" />
              </div>
              <span className="font-semibold">Gemini AI</span>
              <span className="ml-auto bg-blue-600 text-xs px-2 py-0.5 rounded-full text-white">New</span>
            </Link>
            <Link 
              to="/health-dashboard" 
              className={`px-4 py-3 rounded-md ${
                isActive('/health-dashboard') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon="heartbeat" className="mr-3" />
              Health Dashboard
            </Link>
            <Link 
              to="/journal" 
              className={`px-4 py-3 rounded-md ${
                isActive('/journal') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon="book" className="mr-3" />
              Journal
            </Link>
            
            {/* More section in mobile */}
            <div className="border-t border-gray-800 pt-2 mt-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-400">More Features</div>
              
              <Link 
                to="/assessment" 
                className={`px-4 py-3 rounded-md ${
                  isActive('/assessment') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon="clipboard-list" className="mr-3" />
                Assessment
              </Link>
              <Link 
                to="/ai-tools" 
                className={`px-4 py-3 rounded-md ${
                  isActive('/ai-tools') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon="robot" className="mr-3" />
                AI Tools
              </Link>
              <Link 
                to="/resources" 
                className={`px-4 py-3 rounded-md ${
                  isActive('/resources') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon="book-open" className="mr-3" />
                Resources
              </Link>
              <Link 
                to="/community" 
                className={`px-4 py-3 rounded-md ${
                  isActive('/community') 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon="users" className="mr-3" />
                Community
              </Link>
              {user && (
                <Link 
                  to="/profile" 
                  className={`px-4 py-3 rounded-md ${
                    isActive('/profile') 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  Profile
                </Link>
              )}
            </div>
            
            {/* Mobile User Actions */}
            {user ? (
              <>
                <div className="px-4 py-3 border-t border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                      <span className="text-lg font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md flex items-center"
                >
                  <FontAwesomeIcon icon="sign-out-alt" className="mr-3" />
                  Sign out
                </button>
              </>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
              >
                <FontAwesomeIcon icon="user" className="mr-3" />
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 