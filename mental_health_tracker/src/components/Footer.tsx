import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top Section with Logo and Nav */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xl mr-3">
                M
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Elite Coders
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Empowering mental wellness through technology, community, and resources.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                <FontAwesomeIcon icon={['fab', 'twitter']} size="lg" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <FontAwesomeIcon icon={['fab', 'facebook-f']} size="lg" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <FontAwesomeIcon icon={['fab', 'instagram']} size="lg" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                <FontAwesomeIcon icon={['fab', 'linkedin-in']} size="lg" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gemini-assistant" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                  <FontAwesomeIcon icon="brain" className="mr-2 text-blue-500" />
                  Gemini AI
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="text-gray-400 hover:text-primary transition-colors">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="text-gray-400 hover:text-primary transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-primary transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/resources/articles" className="text-gray-400 hover:text-primary transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/resources/guides" className="text-gray-400 hover:text-primary transition-colors">
                  Self-Help Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/videos" className="text-gray-400 hover:text-primary transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/resources/podcasts" className="text-gray-400 hover:text-primary transition-colors">
                  Podcasts
                </Link>
              </li>
              <li>
                <Link to="/resources/therapists" className="text-gray-400 hover:text-primary transition-colors">
                  Find Therapists
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FontAwesomeIcon icon="envelope" className="text-primary mt-1 mr-3" />
                <span className="text-gray-400">support@elitecoders.dev</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon="phone" className="text-primary mt-1 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon="map-marker-alt" className="text-primary mt-1 mr-3" />
                <span className="text-gray-400">123 Wellness Ave, Mental Health District, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Emergency Support Section */}
        <div className="py-6 px-6 bg-gray-800 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-2 text-white">Need immediate help?</h3>
          <p className="text-gray-400 mb-4">
            If you're experiencing a mental health crisis, please reach out to these resources:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon="phone" className="text-primary mr-3" />
              <div>
                <p className="font-medium text-white">Crisis Hotline</p>
                <p className="text-gray-400">988</p>
              </div>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon="comment-dots" className="text-primary mr-3" />
              <div>
                <p className="font-medium text-white">Text Support</p>
                <p className="text-gray-400">Text HOME to 741741</p>
              </div>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon="ambulance" className="text-primary mr-3" />
              <div>
                <p className="font-medium text-white">Emergency Services</p>
                <p className="text-gray-400">911</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-white">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for the latest mental health resources and tips.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                />
                <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mt-12 text-center">
            © {new Date().getFullYear()} Elite Coders. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Cookie Policy
            </Link>
            <Link to="/accessibility" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 