import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Post and comment interfaces
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string; // Using string instead of IconName to avoid type issues
  description: string;
  postsCount: number;
}

const CommunityPage: React.FC = () => {
  // Active category state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // New post modal state
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  // Categories
  const categories: Category[] = [
    {
      id: 'anxiety',
      name: 'Anxiety Support',
      icon: 'wind',
      description: 'Support and discussions for those dealing with anxiety disorders',
      postsCount: 342
    },
    {
      id: 'depression',
      name: 'Depression Support',
      icon: 'cloud-rain',
      description: 'A safe space to discuss depression and recovery strategies',
      postsCount: 287
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness & Meditation',
      icon: 'spa',
      description: 'Share experiences and tips on mindfulness practices',
      postsCount: 156
    },
    {
      id: 'stress',
      name: 'Stress Management',
      icon: 'battery-half',
      description: 'Discussions on coping with stress in daily life',
      postsCount: 203
    },
    {
      id: 'self-care',
      name: 'Self-Care Practices',
      icon: 'heart',
      description: 'Ideas and routines for taking care of your mental health',
      postsCount: 198
    },
    {
      id: 'success',
      name: 'Success Stories',
      icon: 'award',
      description: 'Share your mental health journey and victories',
      postsCount: 124
    },
  ];
  
  // Sample posts
  const posts: Post[] = [
    {
      id: '1',
      title: 'How I manage panic attacks at work',
      content: "I've been experiencing panic attacks at my workplace for the past few months, and I wanted to share some techniques that have helped me manage them when they occur...",
      author: 'Alex_J',
      timestamp: '2 hours ago',
      likes: 24,
      comments: [
        {
          id: 'c1',
          author: 'MindfulMary',
          content: "Thank you for sharing this. I've been struggling with similar issues and will definitely try your breathing technique!",
          timestamp: '1 hour ago',
          likes: 8
        },
        {
          id: 'c2',
          author: 'John_D',
          content: 'Have you tried speaking with your HR department? Many companies now have mental health resources available for employees.',
          timestamp: '45 minutes ago',
          likes: 5
        }
      ],
      tags: ['anxiety', 'workplace', 'coping-strategies']
    },
    {
      id: '2',
      title: 'Daily meditation has changed my life',
      content: "After 6 months of consistent meditation practice, I wanted to share the profound changes I've experienced. When I started, I could barely sit still for 5 minutes...",
      author: 'MindfulMary',
      timestamp: '1 day ago',
      likes: 87,
      comments: [
        {
          id: 'c3',
          author: 'BeginnerMind',
          content: "What meditation app or guide did you use when starting out? I'm finding it difficult to establish a routine.",
          timestamp: '18 hours ago',
          likes: 4
        },
        {
          id: 'c4',
          author: 'ZenMaster',
          content: 'Consistency is key! Even 5 minutes daily is better than an hour once a week.',
          timestamp: '12 hours ago',
          likes: 12
        },
        {
          id: 'c5',
          author: 'MindfulMary',
          content: 'I started with Headspace and then moved to Insight Timer once I got more comfortable with the practice. Happy to share my favorite guided meditations!',
          timestamp: '10 hours ago',
          likes: 9
        }
      ],
      tags: ['mindfulness', 'meditation', 'success-story']
    },
    {
      id: '3',
      title: 'Struggling with motivation during depression',
      content: "I've been dealing with a depressive episode for the past few weeks, and I'm finding it nearly impossible to stay motivated with basic tasks...",
      author: 'HopefulHeart',
      timestamp: '3 days ago',
      likes: 52,
      comments: [
        {
          id: 'c6',
          author: 'CareCoach',
          content: 'Try breaking tasks down into the smallest possible steps. Even getting out of bed and brushing your teeth is a win during depression.',
          timestamp: '2 days ago',
          likes: 18
        },
        {
          id: 'c7',
          author: 'RecoveryRoad',
          content: "I've been there. The 5-minute rule helped me - just commit to doing something for 5 minutes, and often you'll continue once you've started.",
          timestamp: '1 day ago',
          likes: 15
        }
      ],
      tags: ['depression', 'motivation', 'self-care']
    },
    {
      id: '4',
      title: 'How to support a partner with anxiety',
      content: 'My girlfriend was recently diagnosed with generalized anxiety disorder, and I want to be as supportive as possible. Looking for advice from people who...',
      author: 'SupportiveSpouse',
      timestamp: '5 days ago',
      likes: 61,
      comments: [
        {
          id: 'c8',
          author: 'AnxietyAware',
          content: 'As someone with anxiety, the most important thing my partner does is listen without immediately trying to "fix" everything. Sometimes we just need to be heard.',
          timestamp: '4 days ago',
          likes: 28
        },
        {
          id: 'c9',
          author: 'TherapistTom',
          content: "Consider attending a therapy session together if she's comfortable with that. It can help you understand her experience better and learn specific ways to help.",
          timestamp: '3 days ago',
          likes: 22
        }
      ],
      tags: ['anxiety', 'relationships', 'support']
    },
  ];
  
  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(activeCategory));
  
  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section with Background */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 opacity-80"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(101,163,182,0.2),transparent_70%)]"></div>
        </div>
        <div className="absolute inset-y-0 right-0 transform translate-x-1/3">
          <svg className="h-full opacity-20" viewBox="0 0 500 500" width="500" height="500">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="container relative pt-16 pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Elite Coders Community
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-100 mb-8">
              Connect with others on your mental wellness journey. Share experiences, ask questions, and offer support in a safe, anonymous environment.
            </p>
            <button 
              onClick={() => setShowNewPostModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <FontAwesomeIcon icon="feather" className="mr-2" />
              Share Your Story
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="rgb(17, 24, 39)" fillOpacity="1" d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,128C840,107,960,85,1080,85.3C1200,85,1320,107,1380,117.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container px-4 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-gray-800 backdrop-blur-md bg-opacity-50 rounded-xl shadow-xl p-5 sticky top-24 border border-gray-700 border-opacity-50">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center">
                <FontAwesomeIcon icon="layer-group" className="mr-2 text-primary" />
                Categories
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    activeCategory === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon="globe" 
                    className={`mr-3 ${activeCategory === 'all' ? 'text-white' : 'text-primary'}`} 
                  />
                  <div className="flex-1 text-left">
                    <span className="font-medium">All Topics</span>
                    <div className="text-xs opacity-80">{posts.length} posts</div>
                  </div>
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                      activeCategory === category.id 
                        ? 'bg-primary text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={category.icon as IconProp} 
                      className={`mr-3 ${activeCategory === category.id ? 'text-white' : 'text-primary'}`} 
                    />
                    <div className="flex-1 text-left">
                      <span className="font-medium">{category.name}</span>
                      <div className="text-xs opacity-80">{category.postsCount} posts</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Emergency Support Card */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-red-900 to-red-800 text-white shadow-lg border border-red-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FontAwesomeIcon icon="heartbeat" className="mr-2 text-red-400" />
                  Need Support Now?
                </h3>
                <p className="text-sm mb-4 text-gray-200">
                  If you're experiencing a crisis or need immediate assistance:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <FontAwesomeIcon icon="phone" className="mr-3 text-red-400" />
                    <span>Crisis Hotline: 988</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <FontAwesomeIcon icon="comment-dots" className="mr-3 text-red-400" />
                    <span>Text HOME to 741741</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <FontAwesomeIcon icon="hospital" className="mr-3 text-red-400" />
                    <span>Emergency: 911</span>
                  </li>
                </ul>
                <button className="w-full mt-4 bg-white text-red-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon="robot" className="mr-2" />
                  Chat with AI Assistant
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area - Posts */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="bg-gray-800 backdrop-blur-md bg-opacity-50 rounded-xl shadow-xl overflow-hidden mb-8 border border-gray-700 border-opacity-50">
              <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeCategory === 'all' ? 'bg-primary text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All Posts
                  </button>
                  
                  {categories.slice(0, 3).map(category => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        activeCategory === category.id ? 'bg-primary text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <FontAwesomeIcon icon={category.icon as IconProp} className="mr-2" />
                      {category.name}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowNewPostModal(true)}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg text-sm whitespace-nowrap flex items-center"
                >
                  <FontAwesomeIcon icon="plus" className="mr-2" />
                  Create Post
                </button>
              </div>
            </div>
            
            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="bg-gray-800 backdrop-blur-md bg-opacity-50 rounded-xl shadow-xl overflow-hidden border border-gray-700 border-opacity-50 hover:transform hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        <Link to={`/post/${post.id}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <div className="text-gray-400 text-sm">{post.timestamp}</div>
                    </div>
                    
                    <div className="mb-4 flex items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm mr-3">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-primary font-medium">@{post.author}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-gray-700 text-primary text-xs rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center text-gray-400 hover:text-pink-500 transition-colors">
                          <FontAwesomeIcon icon="heart" className="mr-2" />
                          <span>{post.likes}</span>
                        </button>
                        <Link to={`/post/${post.id}`} className="flex items-center text-gray-400 hover:text-primary transition-colors">
                          <FontAwesomeIcon icon="comment" className="mr-2" />
                          <span>{post.comments.length}</span>
                        </Link>
                      </div>
                      <Link 
                        to={`/post/${post.id}`} 
                        className="text-primary font-medium hover:text-primary-light transition-colors flex items-center"
                      >
                        Read More
                        <FontAwesomeIcon icon="arrow-right" className="ml-2 text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors">
                Load More Posts
                <FontAwesomeIcon icon="chevron-down" className="ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Support resources */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl"></div>
          <div className="relative bg-gray-800 backdrop-blur-md bg-opacity-50 rounded-2xl shadow-xl border border-gray-700 border-opacity-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="p-8 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Additional Support Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl p-6 border border-gray-700 border-opacity-50 shadow-lg hover:transform hover:scale-[1.02] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                    <FontAwesomeIcon icon="comment-dots" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Chat Assistant</h3>
                  <p className="text-gray-300 mb-4">Available 24/7 for immediate support and mental health guidance</p>
                  <Link 
                    to="/ai-tools" 
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Chat Now
                    <FontAwesomeIcon icon="arrow-right" className="ml-1 text-sm" />
                  </Link>
                </div>
                
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl p-6 border border-gray-700 border-opacity-50 shadow-lg hover:transform hover:scale-[1.02] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                    <FontAwesomeIcon icon="clipboard-list" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Mental Health Assessment</h3>
                  <p className="text-gray-300 mb-4">Get personalized insights and recommendations for your wellbeing</p>
                  <Link 
                    to="/assessment" 
                    className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Take Assessment
                    <FontAwesomeIcon icon="arrow-right" className="ml-1 text-sm" />
                  </Link>
                </div>
                
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl p-6 border border-gray-700 border-opacity-50 shadow-lg hover:transform hover:scale-[1.02] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
                    <FontAwesomeIcon icon="phone" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Crisis Hotline</h3>
                  <p className="text-gray-300 mb-4">Professional support available 24/7 for emergency situations</p>
                  <a 
                    href="tel:988" 
                    className="inline-flex items-center text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Call 988
                    <FontAwesomeIcon icon="arrow-right" className="ml-1 text-sm" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Create New Post</h3>
                <button 
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="post-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input 
                  type="text" 
                  id="post-title"
                  placeholder="Write a descriptive title for your post"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="post-content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea 
                  id="post-content"
                  rows={6}
                  placeholder="Share your thoughts, experiences, or questions..."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FontAwesomeIcon icon={category.icon as IconProp} className="mr-2 text-primary" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700 border-opacity-50">
                <div className="flex items-start">
                  <FontAwesomeIcon icon="shield-alt" className="text-primary mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium mb-1 text-white">Community Guidelines Reminder</h4>
                    <p className="text-sm text-gray-300">
                      Please be respectful and supportive. Don't share personal identifying information. 
                      We're here to help each other through our mental health journeys.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center">
                  <FontAwesomeIcon icon="paper-plane" className="mr-2" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 