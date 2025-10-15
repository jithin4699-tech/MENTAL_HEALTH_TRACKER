import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { 
  faSearch, 
  faExternalLinkAlt,
  faFilter,
  faTimesCircle,
  faTag,
  faBrain,
  faVideo,
  faHandHolding
} from '@fortawesome/free-solid-svg-icons';

// Resource interfaces
interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'guide' | 'external';
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  externalUrl?: string;
  readTime?: string;
  content?: string;
}

const ResourcesPage: React.FC = () => {
  // Navigation hook for programmatic navigation
  const navigate = useNavigate();
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // All available tags
  const allTags = [
    'anxiety', 'depression', 'stress', 'self-care',
    'mindfulness', 'sleep', 'relationships', 'work-life',
    'trauma', 'breathing', 'meditation', 'exercise',
    'nutrition', 'therapy', 'cbt'
  ];
  
  // Sample resources
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: Signs, Causes and Management',
      description: 'Learn about the different types of anxiety disorders, common symptoms, and evidence-based strategies to manage and reduce anxiety.',
      category: 'article',
      tags: ['anxiety', 'self-care', 'cbt'],
      imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47',
      readTime: '8 min'
    },
    {
      id: '2',
      title: '5-Minute Guided Breathing Exercise',
      description: 'A quick breathing exercise you can do anywhere to immediately reduce stress and anxiety. Perfect for busy days or moments of overwhelm.',
      category: 'video',
      tags: ['anxiety', 'stress', 'breathing', 'meditation'],
      videoUrl: 'https://youtube.com/embed/qULTwquOuT4',
      readTime: '5 min'
    },
    {
      id: '3',
      title: 'The Science of Sleep and Mental Health',
      description: 'Explore the crucial connection between quality sleep and mental wellbeing. Learn practical tips to improve your sleep hygiene.',
      category: 'article',
      tags: ['sleep', 'self-care', 'stress'],
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
      readTime: '12 min'
    },
    {
      id: '4',
      title: 'Cognitive Behavioral Therapy Techniques for Depression',
      description: 'Learn effective CBT strategies that you can practice at home to manage depressive thoughts and behaviors.',
      category: 'guide',
      tags: ['depression', 'therapy', 'cbt'],
      imageUrl: 'https://images.unsplash.com/photo-1581595219315-a187dd60a7ae',
      readTime: '15 min'
    },
    {
      id: '5',
      title: '30-Day Mindfulness Challenge',
      description: 'A month-long program with daily exercises to build mindfulness habits that improve mental clarity and emotional regulation.',
      category: 'guide',
      tags: ['mindfulness', 'meditation', 'self-care'],
      imageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935',
      readTime: '30 days'
    },
    {
      id: '6',
      title: 'Understanding Trauma: A Path to Recovery',
      description: 'An informative guide about different types of trauma, their impact on mental health, and effective approaches to trauma recovery.',
      category: 'article',
      tags: ['trauma', 'therapy'],
      imageUrl: 'https://images.unsplash.com/photo-1536432069083-5a9a2506a8ca',
      readTime: '18 min'
    },
    {
      id: '7',
      title: 'Workplace Stress Management Strategies',
      description: 'Practical techniques to manage and reduce work-related stress. Learn to set boundaries and maintain wellbeing in your professional life.',
      category: 'article',
      tags: ['stress', 'work-life'],
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      readTime: '10 min'
    },
    {
      id: '8',
      title: 'Guided Body Scan Meditation',
      description: 'A 15-minute guided meditation focusing on progressive muscle relaxation and body awareness to reduce tension and promote relaxation.',
      category: 'video',
      tags: ['meditation', 'mindfulness', 'stress'],
      videoUrl: 'https://youtube.com/embed/ihO02wUzgkc',
      readTime: '15 min'
    },
    {
      id: '9',
      title: 'Building Healthy Relationships: Communication Skills',
      description: 'Learn effective communication techniques to foster healthier, more supportive relationships with partners, family members, and friends.',
      category: 'guide',
      tags: ['relationships', 'self-care'],
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      readTime: '14 min'
    },
    {
      id: '10',
      title: 'Mental Health Foundation',
      description: 'A leading UK mental health charity providing information, support and resources for various mental health conditions.',
      category: 'external',
      tags: ['anxiety', 'depression', 'stress', 'self-care'],
      externalUrl: 'https://www.mentalhealth.org.uk/',
      imageUrl: 'https://images.unsplash.com/photo-1526662092594-e98c1e356d6a'
    },
    {
      id: '11',
      title: 'National Alliance on Mental Illness',
      description: 'The largest grassroots mental health organization in the US dedicated to building better lives for Americans affected by mental illness.',
      category: 'external',
      tags: ['depression', 'anxiety', 'therapy'],
      externalUrl: 'https://www.nami.org/',
      imageUrl: 'https://images.unsplash.com/photo-1478061653917-455ba7f4a541'
    },
  ];
  
  // Filter resources based on active filters
  const filteredResources = resources.filter(resource => {
    // Filter by category
    if (activeCategory !== 'all' && resource.category !== activeCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by tags
    if (activeTags.length > 0 && !resource.tags.some(tag => activeTags.includes(tag))) {
      return false;
    }
    
    return true;
  });
  
  // Toggle a tag in the active tags list
  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setActiveTags([]);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'article': return faBrain;
      case 'video': return faVideo;
      case 'guide': return faHandHolding;
      case 'external': return faExternalLinkAlt;
      default: return faBrain;
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'article': return 'from-blue-500 to-indigo-600';
      case 'video': return 'from-red-500 to-pink-600';
      case 'guide': return 'from-green-500 to-teal-600';
      case 'external': return 'from-purple-500 to-indigo-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };
  
  // Get category text color
  const getCategoryTextColor = (category: string) => {
    switch(category) {
      case 'article': return 'text-blue-500';
      case 'video': return 'text-red-500';
      case 'guide': return 'text-green-500';
      case 'external': return 'text-purple-500';
      default: return 'text-blue-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section with background pattern */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Empowering Your Mental Health Journey
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore our curated collection of resources designed to support your wellness and personal growth.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 inline-flex">
                <button
                  onClick={() => document.getElementById('resources-search')?.focus()}
                  className="px-6 py-3 bg-gray-900 hover:bg-opacity-80 rounded-full text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSearch} />
                  Find Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        {/* Search and filters */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-10 shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="flex-grow w-full">
              <div className="relative">
                <input
                  id="resources-search"
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 py-4 pr-4 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filters {activeTags.length > 0 && `(${activeTags.length})`}</span>
              </button>
              
              {(activeCategory !== 'all' || activeTags.length > 0 || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="px-5 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Resources
            </button>
            <button 
              onClick={() => setActiveCategory('article')}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'article' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${activeCategory === 'article' ? 'bg-white bg-opacity-20' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                <FontAwesomeIcon icon={faBrain} className={`${activeCategory === 'article' ? 'text-white' : 'text-white'} text-xs`} />
              </span>
              Articles
            </button>
            <button 
              onClick={() => setActiveCategory('video')}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'video' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${activeCategory === 'video' ? 'bg-white bg-opacity-20' : 'bg-gradient-to-br from-red-500 to-pink-600'}`}>
                <FontAwesomeIcon icon={faVideo} className={`${activeCategory === 'video' ? 'text-white' : 'text-white'} text-xs`} />
              </span>
              Videos
            </button>
            <button 
              onClick={() => setActiveCategory('guide')}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'guide' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${activeCategory === 'guide' ? 'bg-white bg-opacity-20' : 'bg-gradient-to-br from-green-500 to-teal-600'}`}>
                <FontAwesomeIcon icon={faHandHolding} className={`${activeCategory === 'guide' ? 'text-white' : 'text-white'} text-xs`} />
              </span>
              Guides
            </button>
            <button 
              onClick={() => setActiveCategory('external')}
              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeCategory === 'external' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${activeCategory === 'external' ? 'bg-white bg-opacity-20' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
                <FontAwesomeIcon icon={faExternalLinkAlt} className={`${activeCategory === 'external' ? 'text-white' : 'text-white'} text-xs`} />
              </span>
              External
            </button>
          </div>
          
          {/* Tag filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faTag} className="text-gray-400" />
                <h3 className="text-lg font-medium">Filter by tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTags.includes(tag)
                        ? 'bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500'
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'} Found
            </h2>
          </div>
          
          {filteredResources.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 bg-opacity-50 rounded-2xl">
              <div className="text-5xl mb-4 text-gray-400">😕</div>
              <h3 className="text-xl font-medium mb-2">No resources found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map(resource => (
                <div 
                  key={resource.id} 
                  className="group bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px] border border-gray-700 hover:border-gray-600 flex flex-col h-full"
                >
                  {/* Top image with category tag - Make clickable */}
                  <Link to={`/resources/${resource.id}`} className="relative h-48 overflow-hidden block">
                    {resource.imageUrl && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url(${resource.imageUrl})` }}
                      ></div>
                    )}
                    {resource.videoUrl && (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <FontAwesomeIcon icon={faVideo} className="text-5xl text-red-500 opacity-70" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900 opacity-60"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 bg-gray-900 bg-opacity-80 text-white`}>
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br ${getCategoryColor(resource.category)}`}>
                          <FontAwesomeIcon icon={getCategoryIcon(resource.category)} className="text-white text-xs" />
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${getCategoryTextColor(resource.category)}`}>
                            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                          </span>
                          {resource.readTime && (
                            <span className="text-xs text-gray-400">
                              {resource.readTime}
                            </span>
                          )}
                        </div>
                      </span>
                    </div>
                    
                    {/* Time badge */}
                    {resource.readTime && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-900 bg-opacity-80 text-gray-300">
                          {resource.readTime}
                        </span>
                      </div>
                    )}
                  </Link>
                  
                  {/* Content - Make clickable */}
                  <Link to={`/resources/${resource.id}`} className="p-6 flex-grow flex flex-col no-underline text-white">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-300 mb-6 flex-grow">
                      {resource.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {resource.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-blue-500 bg-opacity-10 text-blue-400 rounded-lg text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700 bg-opacity-50 text-gray-300 rounded-lg text-xs">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                  
                  {/* Action button */}
                  <div className="px-6 pb-6">
                    {resource.category === 'external' ? (
                      <a 
                        href={resource.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                      >
                        Visit Website
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    ) : (
                      <button 
                        onClick={() => navigate(`/resources/${resource.id}`)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        {resource.category === 'video' ? 'Watch Video' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Make resources available globally
export const getResources = () => {
  return [
    {
      id: '1',
      title: 'Understanding Anxiety: Signs, Causes and Management',
      description: 'Learn about the different types of anxiety disorders, common symptoms, and evidence-based strategies to manage and reduce anxiety.',
      category: 'article',
      tags: ['anxiety', 'self-care', 'cbt'],
      imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47',
      readTime: '8 min',
      content: `
        <h2>What is Anxiety?</h2>
        <p>Anxiety is a natural response to stress and can be beneficial in some situations. It can alert us to dangers and help us prepare and pay attention. Anxiety disorders differ from normal feelings of nervousness or anxiousness and involve excessive fear or anxiety.</p>
        
        <h2>Common Types of Anxiety Disorders</h2>
        <ul>
          <li><strong>Generalized Anxiety Disorder (GAD)</strong>: Persistent and excessive worry about various things.</li>
          <li><strong>Social Anxiety Disorder</strong>: Intense fear of social or performance situations.</li>
          <li><strong>Panic Disorder</strong>: Recurrent panic attacks, with a fear of having them.</li>
          <li><strong>Phobias</strong>: Fear of specific objects or situations.</li>
        </ul>
        
        <h2>Management Strategies</h2>
        <p>Several evidence-based approaches can help manage anxiety:</p>
        <ol>
          <li><strong>Cognitive Behavioral Therapy (CBT)</strong>: Helps identify and challenge negative thought patterns.</li>
          <li><strong>Mindfulness and Meditation</strong>: Practices that help bring awareness to the present moment.</li>
          <li><strong>Regular Exercise</strong>: Physical activity can reduce anxiety and improve mood.</li>
          <li><strong>Healthy Lifestyle</strong>: Adequate sleep, balanced nutrition, and limiting caffeine and alcohol.</li>
          <li><strong>Breathing Techniques</strong>: Deep breathing exercises can help reduce anxiety symptoms.</li>
        </ol>
        
        <p>If you're experiencing persistent anxiety that interferes with daily life, consider seeking professional help. A mental health professional can provide personalized strategies and support.</p>
      `
    },
    {
      id: '2',
      title: '5-Minute Guided Breathing Exercise',
      description: 'A quick breathing exercise you can do anywhere to immediately reduce stress and anxiety. Perfect for busy days or moments of overwhelm.',
      category: 'video',
      tags: ['anxiety', 'stress', 'breathing', 'meditation'],
      videoUrl: 'https://youtube.com/embed/qULTwquOuT4',
      readTime: '5 min',
      content: `
        <h2>The Importance of Breathing Exercises</h2>
        <p>Breathing exercises are an effective way to reduce stress, anxiety, and promote relaxation. They can be done anywhere and only take a few minutes.</p>
        
        <p>This guided breathing exercise helps to activate your parasympathetic nervous system, which controls your body's ability to relax. By focusing on slow, deep breaths, you can lower your heart rate and blood pressure, and bring a sense of calm to your mind and body.</p>
        
        <p>Follow along with the video below for a 5-minute guided breathing exercise.</p>
      `
    },
    {
      id: '3',
      title: 'The Science of Sleep and Mental Health',
      description: 'Explore the crucial connection between quality sleep and mental wellbeing. Learn practical tips to improve your sleep hygiene.',
      category: 'article',
      tags: ['sleep', 'self-care', 'stress'],
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
      readTime: '12 min',
      content: `
        <h2>The Sleep-Mental Health Connection</h2>
        <p>Sleep and mental health are intimately connected. Sleep deprivation affects your psychological state and mental health, and those with mental health problems are more likely to have insomnia or other sleep disorders.</p>
        
        <h2>How Sleep Affects Mental Health</h2>
        <p>During sleep, your brain processes emotional information. Adequate sleep helps you react to positive situations with appropriate pleasure and joy, and negative situations with managed emotions. Without enough sleep, you're more likely to:</p>
        <ul>
          <li>Have negative emotional reactions</li>
          <li>Experience increased anxiety</li>
          <li>Feel greater stress</li>
          <li>Have difficulty concentrating</li>
          <li>Experience mood changes</li>
        </ul>
        
        <h2>Improving Sleep Hygiene</h2>
        <p>Here are some evidence-based strategies to improve your sleep:</p>
        <ol>
          <li><strong>Consistent Schedule</strong>: Go to bed and wake up at the same time every day, even on weekends.</li>
          <li><strong>Create a Restful Environment</strong>: Keep your bedroom quiet, dark, relaxing, and at a comfortable temperature.</li>
          <li><strong>Remove Electronic Devices</strong>: Keep TVs, computers, and smartphones out of the bedroom.</li>
          <li><strong>Avoid Large Meals</strong>: Don't eat heavy or large meals within a couple of hours of bedtime.</li>
          <li><strong>Limit Caffeine and Alcohol</strong>: Both can disrupt sleep patterns.</li>
          <li><strong>Physical Activity</strong>: Being physically active during the day can help you fall asleep more easily.</li>
          <li><strong>Relaxation Techniques</strong>: Practice relaxation or meditation before bedtime.</li>
        </ol>
        
        <p>If you consistently struggle with sleep despite trying these strategies, consider speaking with a healthcare provider, as you might have a sleep disorder that requires treatment.</p>
      `
    },
    {
      id: '4',
      title: 'Cognitive Behavioral Therapy Techniques for Depression',
      description: 'Learn effective CBT strategies that you can practice at home to manage depressive thoughts and behaviors.',
      category: 'guide',
      tags: ['depression', 'therapy', 'cbt'],
      imageUrl: 'https://images.unsplash.com/photo-1581595219315-a187dd60a7ae',
      readTime: '15 min',
      content: `
        <h2>Understanding Cognitive Behavioral Therapy</h2>
        <p>Cognitive Behavioral Therapy (CBT) is a proven treatment for depression that helps identify and change negative thought patterns that influence emotions and behaviors.</p>
        
        <h2>Key CBT Techniques You Can Practice</h2>
        
        <h3>1. Thought Challenging</h3>
        <p>Learn to identify and challenge negative thoughts:</p>
        <ul>
          <li>Identify automatic negative thoughts when you feel depressed</li>
          <li>Question the evidence for these thoughts</li>
          <li>Consider alternative perspectives</li>
          <li>Develop more balanced, realistic thoughts</li>
        </ul>
        
        <h3>2. Behavioral Activation</h3>
        <p>Increase positive activities to improve your mood:</p>
        <ul>
          <li>Make a list of activities you used to enjoy</li>
          <li>Start with small, achievable activities</li>
          <li>Schedule these activities into your day</li>
          <li>Notice how your mood changes after completing them</li>
        </ul>
        
        <h3>3. Problem-Solving</h3>
        <p>Develop skills to address life challenges:</p>
        <ol>
          <li>Clearly define the problem</li>
          <li>Brainstorm possible solutions</li>
          <li>Evaluate the pros and cons of each solution</li>
          <li>Choose and implement a solution</li>
          <li>Evaluate the results and adjust if needed</li>
        </ol>
        
        <h3>4. Mindfulness</h3>
        <p>Practice being present without judgment:</p>
        <ul>
          <li>Focus on your breathing for 5 minutes daily</li>
          <li>Notice thoughts without attachment</li>
          <li>Return focus to the present moment when your mind wanders</li>
        </ul>
        
        <p>While these self-help techniques can be valuable, working with a trained therapist is recommended for moderate to severe depression. CBT is most effective when practiced consistently over time.</p>
      `
    },
    {
      id: '5',
      title: '30-Day Mindfulness Challenge',
      description: 'A month-long program with daily exercises to build mindfulness habits that improve mental clarity and emotional regulation.',
      category: 'guide',
      tags: ['mindfulness', 'meditation', 'self-care'],
      imageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935',
      readTime: '30 days',
      content: `
        <h2>Your 30-Day Mindfulness Journey</h2>
        <p>This program introduces a new mindfulness practice each day, designed to be completed in 5-15 minutes. By the end of the 30 days, you'll have a toolkit of mindfulness techniques to use in your daily life.</p>
        
        <h3>Week 1: Foundation (Days 1-7)</h3>
        <ul>
          <li><strong>Day 1:</strong> Mindful breathing - Focus on your breath for 5 minutes</li>
          <li><strong>Day 2:</strong> Body scan - Bring awareness to each part of your body</li>
          <li><strong>Day 3:</strong> Mindful walking - Pay attention to each step</li>
          <li><strong>Day 4:</strong> Mindful eating - Experience a meal with all your senses</li>
          <li><strong>Day 5:</strong> Sound awareness - Notice the sounds around you</li>
          <li><strong>Day 6:</strong> Thought observation - Watch thoughts come and go</li>
          <li><strong>Day 7:</strong> Gratitude practice - List three things you're grateful for</li>
        </ul>
        
        <h3>Week 2: Emotions (Days 8-14)</h3>
        <ul>
          <li><strong>Day 8:</strong> Emotion labeling - Name your feelings without judgment</li>
          <li><strong>Day 9:</strong> Self-compassion practice - Treat yourself with kindness</li>
          <li><strong>Day 10:</strong> R.A.I.N. technique for difficult emotions</li>
          <li><strong>Day 11:</strong> Joy spotting - Look for small moments of joy</li>
          <li><strong>Day 12:</strong> Loving-kindness meditation</li>
          <li><strong>Day 13:</strong> Mindful journaling - Write about your experiences</li>
          <li><strong>Day 14:</strong> Body and emotion connection - Notice physical sensations</li>
        </ul>
        
        <h3>Week 3: Focus (Days 15-21)</h3>
        <ul>
          <li><strong>Day 15:</strong> Single-tasking - Do one thing with full attention</li>
          <li><strong>Day 16:</strong> Mindful technology use</li>
          <li><strong>Day 17:</strong> Focused attention practice</li>
          <li><strong>Day 18:</strong> Mindful listening in conversation</li>
          <li><strong>Day 19:</strong> Sensory awareness in nature</li>
          <li><strong>Day 20:</strong> Mindful cleaning or chores</li>
          <li><strong>Day 21:</strong> Breath counting meditation</li>
        </ul>
        
        <h3>Week 4: Integration (Days 22-30)</h3>
        <ul>
          <li><strong>Day 22:</strong> Mindful morning routine</li>
          <li><strong>Day 23:</strong> Mindful communication practice</li>
          <li><strong>Day 24:</strong> Mindful movement or stretching</li>
          <li><strong>Day 25:</strong> Digital detox (1-2 hours)</li>
          <li><strong>Day 26:</strong> Mindful problem-solving</li>
          <li><strong>Day 27:</strong> Mindful rest and relaxation</li>
          <li><strong>Day 28:</strong> Intention setting practice</li>
          <li><strong>Day 29:</strong> Mindfulness in transitions</li>
          <li><strong>Day 30:</strong> Creating your ongoing mindfulness plan</li>
        </ul>
        
        <p>Remember, mindfulness is a practice, not perfection. If you miss a day, simply begin again. The benefits come from consistent, gentle effort over time.</p>
      `
    },
    {
      id: '6',
      title: 'Understanding Trauma: A Path to Recovery',
      description: 'An informative guide about different types of trauma, their impact on mental health, and effective approaches to trauma recovery.',
      category: 'article',
      tags: ['trauma', 'therapy'],
      imageUrl: 'https://images.unsplash.com/photo-1536432069083-5a9a2506a8ca',
      readTime: '18 min',
      content: `
        <h2>What is Trauma?</h2>
        <p>Trauma is the emotional response to a deeply distressing or disturbing event. It can overwhelm an individual's ability to cope and leave lasting effects on their mental, physical, and emotional wellbeing.</p>
        
        <h2>Types of Trauma</h2>
        <ul>
          <li><strong>Acute Trauma:</strong> Results from a single incident</li>
          <li><strong>Chronic Trauma:</strong> Repeated and prolonged exposure to highly stressful events</li>
          <li><strong>Complex Trauma:</strong> Exposure to multiple traumatic events, often interpersonal in nature</li>
          <li><strong>Developmental Trauma:</strong> Early trauma that impacts development</li>
          <li><strong>Secondary or Vicarious Trauma:</strong> Trauma experienced by witnessing others' suffering</li>
        </ul>
        
        <h2>Common Responses to Trauma</h2>
        <p>Trauma can manifest in various ways, including:</p>
        <ul>
          <li>Intrusive memories, flashbacks, or nightmares</li>
          <li>Avoidance of reminders of the traumatic event</li>
          <li>Negative changes in thinking and mood</li>
          <li>Changes in physical and emotional reactions (hyperarousal)</li>
          <li>Dissociation or feeling emotionally numb</li>
          <li>Difficulty with trust and relationships</li>
        </ul>
        
        <h2>The Path to Recovery</h2>
        <p>Recovery from trauma is possible. Here are some evidence-based approaches:</p>
        
        <h3>1. Safety and Stabilization</h3>
        <p>Establishing physical and emotional safety is the first step in trauma recovery. This might include:</p>
        <ul>
          <li>Creating a safe living environment</li>
          <li>Developing coping skills for managing distress</li>
          <li>Building a support network</li>
          <li>Learning grounding techniques</li>
        </ul>
        
        <h3>2. Trauma-Focused Therapy</h3>
        <p>Several therapeutic approaches are effective for trauma:</p>
        <ul>
          <li><strong>Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)</strong></li>
          <li><strong>Eye Movement Desensitization and Reprocessing (EMDR)</strong></li>
          <li><strong>Prolonged Exposure Therapy</strong></li>
          <li><strong>Somatic Experiencing</strong></li>
          <li><strong>Internal Family Systems (IFS)</strong></li>
        </ul>
        
        <h3>3. Self-Care and Mind-Body Approaches</h3>
        <p>Practices that can support trauma recovery include:</p>
        <ul>
          <li>Mindfulness and meditation</li>
          <li>Yoga and other gentle movement practices</li>
          <li>Expressive arts (writing, art, music)</li>
          <li>Connection with nature</li>
          <li>Regular physical activity</li>
        </ul>
        
        <p>Remember, trauma recovery is not linear, and what works best varies for each person. Working with trauma-informed professionals can provide personalized guidance for your healing journey.</p>
      `
    },
    {
      id: '7',
      title: 'Workplace Stress Management Strategies',
      description: 'Practical techniques to manage and reduce work-related stress. Learn to set boundaries and maintain wellbeing in your professional life.',
      category: 'article',
      tags: ['stress', 'work-life'],
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      readTime: '10 min',
      content: `
        <h2>Understanding Workplace Stress</h2>
        <p>Workplace stress affects most professionals at some point in their careers. While some stress can motivate us, chronic stress can lead to burnout, decreased productivity, and health problems.</p>
        
        <h2>Recognizing the Signs of Workplace Stress</h2>
        <p>Common indicators include:</p>
        <ul>
          <li>Feeling overwhelmed or constantly worried</li>
          <li>Difficulty concentrating or making decisions</li>
          <li>Changes in sleep patterns</li>
          <li>Irritability or short temper</li>
          <li>Physical symptoms like headaches or muscle tension</li>
          <li>Decreased job satisfaction</li>
          <li>Withdrawing from colleagues</li>
        </ul>
        
        <h2>Effective Stress Management Strategies</h2>
        
        <h3>1. Set Clear Boundaries</h3>
        <ul>
          <li>Establish working hours and stick to them</li>
          <li>Take regular breaks throughout the day</li>
          <li>Avoid checking work emails during personal time</li>
          <li>Learn to say no to additional responsibilities when necessary</li>
        </ul>
        
        <h3>2. Organize and Prioritize</h3>
        <ul>
          <li>Break large projects into manageable tasks</li>
          <li>Use the Eisenhower Matrix to prioritize tasks (urgent/important)</li>
          <li>Focus on one task at a time rather than multitasking</li>
          <li>Use time-blocking techniques to structure your day</li>
        </ul>
        
        <h3>3. Develop Healthy Coping Mechanisms</h3>
        <ul>
          <li>Practice deep breathing or quick meditation during the workday</li>
          <li>Take short walks to clear your mind</li>
          <li>Engage in physical activity regularly</li>
          <li>Maintain a healthy diet and proper hydration</li>
          <li>Ensure adequate sleep</li>
        </ul>
        
        <h3>4. Improve Communication</h3>
        <ul>
          <li>Discuss concerns with your supervisor constructively</li>
          <li>Clarify expectations and deadlines</li>
          <li>Seek feedback regularly</li>
          <li>Build supportive relationships with colleagues</li>
        </ul>
        
        <h3>5. Create Work-Life Balance</h3>
        <ul>
          <li>Pursue hobbies and interests outside of work</li>
          <li>Schedule regular time with family and friends</li>
          <li>Take your vacation days</li>
          <li>Create rituals to transition between work and personal time</li>
        </ul>
        
        <h3>6. Seek Support When Needed</h3>
        <ul>
          <li>Utilize employee assistance programs if available</li>
          <li>Consider speaking with a mental health professional</li>
          <li>Join support groups or forums for your industry</li>
          <li>Speak with trusted colleagues or mentors</li>
        </ul>
        
        <p>Remember that managing workplace stress is an ongoing practice. Implementing even a few of these strategies can significantly improve your wellbeing and job satisfaction.</p>
      `
    },
    {
      id: '8',
      title: 'Guided Body Scan Meditation',
      description: 'A 15-minute guided meditation focusing on progressive muscle relaxation and body awareness to reduce tension and promote relaxation.',
      category: 'video',
      tags: ['meditation', 'mindfulness', 'stress'],
      videoUrl: 'https://youtube.com/embed/ihO02wUzgkc',
      readTime: '15 min',
      content: `
        <h2>The Benefits of Body Scan Meditation</h2>
        <p>Body scan meditation is a practice that involves systematically focusing your attention on different parts of your body, from your feet to the top of your head. This practice helps develop awareness of bodily sensations, reduce physical tension, and promote deep relaxation.</p>
        
        <h3>Regular practice can help:</h3>
        <ul>
          <li>Reduce stress and anxiety</li>
          <li>Improve sleep quality</li>
          <li>Increase body awareness</li>
          <li>Release muscle tension</li>
          <li>Develop concentration</li>
          <li>Connect mind and body</li>
        </ul>
        
        <h2>How to Practice</h2>
        <ol>
          <li>Find a comfortable position, either lying down or sitting</li>
          <li>Close your eyes and take a few deep breaths</li>
          <li>Bring your awareness to your feet, noticing any sensations</li>
          <li>Slowly move your attention up through the body</li>
          <li>Notice sensations without judgment</li>
          <li>If your mind wanders, gently bring focus back to the body</li>
        </ol>
        
        <p>The guided video below will walk you through a 15-minute body scan meditation practice.</p>
      `
    },
    {
      id: '9',
      title: 'Building Healthy Relationships: Communication Skills',
      description: 'Learn effective communication techniques to foster healthier, more supportive relationships with partners, family members, and friends.',
      category: 'guide',
      tags: ['relationships', 'self-care'],
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      readTime: '14 min',
      content: `
        <h2>The Foundation of Healthy Relationships</h2>
        <p>Effective communication is the cornerstone of healthy relationships. It allows us to express our needs, understand others, resolve conflicts, and build deeper connections.</p>
        
        <h2>Key Communication Skills</h2>
        
        <h3>1. Active Listening</h3>
        <p>Active listening involves fully concentrating on what's being said rather than passively hearing the message.</p>
        <ul>
          <li>Give your full attention and make eye contact</li>
          <li>Avoid interrupting or planning your response while the other person is speaking</li>
          <li>Use verbal and non-verbal cues to show you're engaged (nodding, "I see")</li>
          <li>Reflect back what you've heard: "It sounds like you're saying..."</li>
          <li>Ask clarifying questions when needed</li>
        </ul>
        
        <h3>2. "I" Statements</h3>
        <p>Express feelings without blaming or criticizing the other person.</p>
        <ul>
          <li>Format: "I feel [emotion] when [situation] because [reason]."</li>
          <li>Example: Instead of "You never help around the house," try "I feel overwhelmed when I'm handling all the household chores because I also have work deadlines to meet."</li>
        </ul>
        
        <h3>3. Emotional Awareness</h3>
        <p>Recognize and manage your own emotions before communicating.</p>
        <ul>
          <li>Take a moment to identify what you're feeling</li>
          <li>Consider whether you're in the right emotional state for difficult conversations</li>
          <li>Use deep breathing or other techniques to calm intense emotions</li>
          <li>Be mindful of your tone and body language</li>
        </ul>
        
        <h3>4. Assertive Communication</h3>
        <p>Express your needs clearly while respecting others.</p>
        <ul>
          <li>Be direct and specific about your needs and boundaries</li>
          <li>Stay calm and respectful</li>
          <li>Focus on finding solutions rather than proving you're right</li>
          <li>Use phrases like "I need," "I would like," or "I prefer"</li>
        </ul>
        
        <h3>5. Conflict Resolution</h3>
        <p>Handle disagreements constructively to strengthen relationships.</p>
        <ul>
          <li>Address conflicts early rather than letting resentment build</li>
          <li>Focus on the specific issue at hand, not past grievances</li>
          <li>Listen to understand the other person's perspective</li>
          <li>Look for compromise or win-win solutions</li>
          <li>Take breaks if discussions become too heated</li>
        </ul>
        
        <h2>Putting Skills into Practice</h2>
        <ol>
          <li><strong>Start small:</strong> Practice with minor issues before tackling major conflicts</li>
          <li><strong>Check for understanding:</strong> Ensure both parties are on the same page</li>
          <li><strong>Be patient:</strong> Changing communication patterns takes time</li>
          <li><strong>Express appreciation:</strong> Acknowledge positive communication efforts</li>
          <li><strong>Seek help when needed:</strong> Consider couples or family therapy for persistent communication problems</li>
        </ol>
        
        <p>Remember, improving communication is an ongoing journey. Even small improvements can lead to significantly healthier and more fulfilling relationships.</p>
      `
    },
    {
      id: '10',
      title: 'Mental Health Foundation',
      description: 'A leading UK mental health charity providing information, support and resources for various mental health conditions.',
      category: 'external',
      tags: ['anxiety', 'depression', 'stress', 'self-care'],
      externalUrl: 'https://www.mentalhealth.org.uk/',
      imageUrl: 'https://images.unsplash.com/photo-1526662092594-e98c1e356d6a',
      content: `
        <h2>About Mental Health Foundation</h2>
        <p>The Mental Health Foundation is a UK charity that provides information, research, and advocacy for mental health. They work to help people understand, protect, and sustain their mental health through various resources and community programs.</p>
        
        <h3>What They Offer</h3>
        <ul>
          <li>Evidence-based information on various mental health conditions</li>
          <li>Self-help resources and guides</li>
          <li>Research on mental health prevention</li>
          <li>Campaigns to raise awareness and reduce stigma</li>
          <li>Policy recommendations to improve mental health services</li>
        </ul>
        
        <p>Visit their website to access their comprehensive resources and learn about their current mental health initiatives.</p>
      `
    },
    {
      id: '11',
      title: 'National Alliance on Mental Illness',
      description: 'The largest grassroots mental health organization in the US dedicated to building better lives for Americans affected by mental illness.',
      category: 'external',
      tags: ['depression', 'anxiety', 'therapy'],
      externalUrl: 'https://www.nami.org/',
      imageUrl: 'https://images.unsplash.com/photo-1478061653917-455ba7f4a541',
      content: `
        <h2>About NAMI</h2>
        <p>The National Alliance on Mental Illness (NAMI) is the largest grassroots mental health organization in the United States. It's dedicated to building better lives for millions of Americans affected by mental illness through education, advocacy, support, and public awareness.</p>
        
        <h3>Key Resources Provided</h3>
        <ul>
          <li>HelpLine for information and referrals</li>
          <li>Support groups for individuals and family members</li>
          <li>Educational programs and classes</li>
          <li>Advocacy for improved mental health policies</li>
          <li>Online discussion groups and forums</li>
          <li>Informational resources on various mental health conditions</li>
        </ul>
        
        <p>NAMI works at the national, state, and local levels to support those affected by mental health conditions. Visit their website to find your local NAMI affiliate and access their many resources.</p>
      `
    }
  ];
};

export default ResourcesPage; 