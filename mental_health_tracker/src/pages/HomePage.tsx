import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, 
  faRobot, 
  faChartLine, 
  faUsers, 
  faBook, 
  faShieldAlt,
  faClipboardList,
  faCommentDots,
  faPhone,
  faHospital,
  faStar,
  faHeartbeat,
  faMobileAlt
} from '@fortawesome/free-solid-svg-icons';

interface HomePageProps {
  onChatClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onChatClick }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: faHeartbeat,
      emoji: "⌚",
      title: 'Smart Watch Integration',
      description: 'Connect your smart watch to get personalized recommendations based on your real-time health metrics.',
      gradient: 'from-cyan-500 to-blue-500',
      glowColor: 'rgba(14, 165, 233, 0.5)'
    },
    {
      icon: faBrain,
      emoji: "🧠",
      title: 'AI Assessment',
      description: 'Get personalized insights with our advanced mental health screening tool.',
      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    {
      icon: faRobot,
      emoji: "🤖",
      title: '24/7 AI Support',
      description: 'Access immediate support through our empathetic AI therapy assistant.',
      gradient: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.5)'
    },
    {
      icon: faChartLine,
      emoji: "📈",
      title: 'Progress Tracking',
      description: 'Monitor your emotional well-being with interactive mood tracking tools.',
      gradient: 'from-green-500 to-teal-500',
      glowColor: 'rgba(16, 185, 129, 0.5)'
    },
    {
      icon: faUsers,
      emoji: "👥",
      title: 'Safe Community',
      description: 'Connect with others in a supportive, anonymous environment.',
      gradient: 'from-orange-500 to-yellow-500',
      glowColor: 'rgba(249, 115, 22, 0.5)'
    },
    {
      icon: faBook,
      emoji: "📚",
      title: 'Resource Library',
      description: 'Access curated mental health resources and guided exercises.',
      gradient: 'from-red-500 to-pink-500',
      glowColor: 'rgba(239, 68, 68, 0.5)'
    },
    {
      icon: faShieldAlt,
      emoji: "🛡️",
      title: 'Privacy First',
      description: 'Your data is encrypted and your privacy is our top priority.',
      gradient: 'from-indigo-500 to-blue-500',
      glowColor: 'rgba(99, 102, 241, 0.5)'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-10 -left-10 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute w-96 h-96 -top-10 -right-10 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute w-96 h-96 bottom-32 left-1/2 transform -translate-x-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Your Mental Wellness Journey Starts Here
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
              Experience the future of mental health support with AI-powered tools, personalized guidance, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/assessment" 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
                Start Assessment
              </Link>
              <Link 
                to="/health-dashboard" 
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <FontAwesomeIcon icon="heartbeat" className="mr-3" />
                Health Dashboard
              </Link>
              <button 
                onClick={onChatClick} 
                className="px-8 py-4 bg-gray-800 rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 border border-gray-700 hover:border-purple-500"
              >
                <FontAwesomeIcon icon={faCommentDots} className="mr-3" />
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Enhanced 3D Glass Cards */}
      <section className="py-20 relative overflow-hidden">
        {/* Subtle moving background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center space-x-2 mb-6">
              <span className="text-4xl">✨</span>
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
                Empowering Your Mental Health Journey
              </h2>
              <span className="text-4xl">✨</span>
            </div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Our innovative tools blend cutting-edge AI with evidence-based therapeutic techniques to support your unique path to wellbeing.
            </p>
            <div className="flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gray-800 bg-opacity-30 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transform transition-all duration-500 shadow-xl hover:shadow-2xl border border-gray-700 hover:border-opacity-0 overflow-hidden"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                  boxShadow: hoveredCard === index ? `0 0 30px ${feature.glowColor}` : 'none'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated gradient background that reveals on hover */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientBG 8s ease infinite'
                  }}
                ></div>
                
                {/* Floating particles */}
                {hoveredCard === index && (
                  <>
                    <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-2000"></div>
                    <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-white rounded-full animate-ping animation-delay-4000"></div>
                  </>
                )}
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 h-20 w-20 bg-white opacity-5 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 h-16 w-16 bg-white opacity-5 rounded-tr-full"></div>
                
                <div className="relative z-10">
                  {/* Enhanced 3D icon container with orbit effect and emoji */}
                  <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 blur-sm rounded-2xl transform rotate-12"></div>
                    <div className={`relative flex items-center justify-center w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:translate-y-1 transform ${hoveredCard === index ? 'animate-pulse' : ''}`}>
                      <div className={`absolute inset-0.5 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
                      
                      {/* Orbit effect */}
                      {hoveredCard === index && (
                        <>
                          <div className="absolute w-28 h-28 border border-gray-500 rounded-full opacity-30 animate-spin" style={{animationDuration: '8s'}}></div>
                          <div className="absolute w-4 h-4 bg-white rounded-full opacity-70 animate-orbit" style={{left: '50%', marginLeft: '-4px'}}></div>
                        </>
                      )}
                      
                      <div className="flex flex-col items-center justify-center">
                        <FontAwesomeIcon 
                          icon={feature.icon} 
                          className={`text-3xl bg-clip-text text-transparent bg-gradient-to-br ${feature.gradient} ${hoveredCard === index ? 'animate-bounce-subtle' : ''}`}
                        />
                        <span className="text-3xl mt-2" aria-hidden="true">{feature.emoji}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with improved typography */}
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-center group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                    {hoveredCard === index && (
                      <FontAwesomeIcon icon={faStar} className="ml-2 text-yellow-400 text-sm animate-pulse" />
                    )}
                  </h3>
                  <p className="text-gray-400 text-center leading-relaxed">{feature.description}</p>
                  
                  {/* Enhanced action indicator */}
                  <div className="mt-6 text-center">
                    <div className={`px-4 py-2 rounded-lg bg-gray-700 bg-opacity-40 inline-block ${hoveredCard === index ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                      <span className="text-xs uppercase tracking-widest font-semibold text-gray-300 flex items-center">
                        <span className="mr-2">Explore</span>
                        <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 opacity-50"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to Begin Your Journey? 🚀</h2>
            <p className="text-xl text-gray-300 mb-12">
              Take the first step towards better mental health with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/assessment" 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-3" />
                Start Free Assessment
              </Link>
              <Link 
                to="/resources" 
                className="px-8 py-4 bg-gray-800 rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 border border-gray-700 hover:border-purple-500"
              >
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="py-12 bg-gray-800 bg-opacity-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-6">Need Immediate Support? ❤️</h3>
            <p className="text-gray-300 mb-8">
              If you're experiencing a mental health crisis, please reach out for professional help:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-900 rounded-xl">
                <FontAwesomeIcon icon={faPhone} className="text-2xl text-green-500 mb-4" />
                <h4 className="font-semibold mb-2">Crisis Hotline</h4>
                <p className="text-gray-400">988</p>
              </div>
              <div className="p-6 bg-gray-900 rounded-xl">
                <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-blue-500 mb-4" />
                <h4 className="font-semibold mb-2">Text Support</h4>
                <p className="text-gray-400">Text HOME to 741741</p>
              </div>
              <div className="p-6 bg-gray-900 rounded-xl">
                <FontAwesomeIcon icon={faHospital} className="text-2xl text-red-500 mb-4" />
                <h4 className="font-semibold mb-2">Emergency</h4>
                <p className="text-gray-400">Call 911</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 