import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../context/UserContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, signup, error, isLoading } = useContext(UserContext);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setLocalError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Common validation
    if (!email || !password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (isLogin) {
      // Login with existing credentials
      try {
        await login(email, password);
        // If we reach here, login was successful
        onClose();
        resetForm();
      } catch (err) {
        // Error is handled by the context
      }
    } else {
      // Additional validation for signup
      if (!name) {
        setLocalError('Please enter your name');
        return;
      }

      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }

      // Register new user
      try {
        await signup(name, email, password);
        // If we reach here, signup was successful
        onClose();
        resetForm();
      } catch (err) {
        // Error is handled by the context
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-md p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{isLogin ? 'Login' : 'Create Account'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <FontAwesomeIcon icon="times" size="lg" />
          </button>
        </div>

        {(localError || error) && (
          <div className="bg-red-900/30 text-red-300 border border-red-800 p-3 rounded-md mb-4">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Your password" : "Minimum 8 characters"}
            />
            {isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Demo credentials: john@example.com / password123
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                {isLogin ? 'Logging in...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
          
          <div className="mt-4 text-center">
            {isLogin ? (
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                  onClick={toggleMode}
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                  onClick={toggleMode}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 