import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faExternalLinkAlt, 
  faTag, 
  faClock, 
  faBrain,
  faVideo,
  faHandHolding,
  faLightbulb,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import { getResources } from './ResourcesPage';
import './ResourceDetail.css'; // Import custom styles

interface ResourceDetailPageProps {
  onChatClick: () => void;
}

const ResourceDetailPage: React.FC<ResourceDetailPageProps> = ({ onChatClick }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<any>(null);
  const [relatedResources, setRelatedResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
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
  
  useEffect(() => {
    // Simulating data fetch
    setLoading(true);
    const resources = getResources();
    const foundResource = resources.find(r => r.id === id);
    
    if (foundResource) {
      setResource(foundResource);
      
      // Find related resources based on shared tags
      const related = resources
        .filter(r => r.id !== id && r.tags.some(tag => foundResource.tags.includes(tag)))
        .slice(0, 3);
      
      setRelatedResources(related);
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-16">
        <div className="container">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
            <p className="text-gray-400 mb-6">The resource you're looking for doesn't exist or has been removed</p>
            <Link 
              to="/resources" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Hero section with resource image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-gray-800">
        {resource.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${resource.imageUrl})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <button 
              onClick={() => navigate('/resources')}
              className="mb-4 flex items-center text-gray-300 hover:text-white transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Resources
            </button>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-gray-900 bg-opacity-80 flex items-center gap-2 text-white`}>
                <span className={`w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-br ${getCategoryColor(resource.category)}`}>
                  <FontAwesomeIcon icon={getCategoryIcon(resource.category)} className="text-white text-xs" />
                </span>
                {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
              </span>
              {resource.readTime && (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-900 bg-opacity-80 text-gray-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} />
                  {resource.readTime}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{resource.title}</h1>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-blue-500 bg-opacity-10 text-blue-400 rounded-lg text-xs flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTag} className="text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Description */}
              <p className="text-gray-300 text-lg mb-8">{resource.description}</p>
              
              {/* Resource content based on type */}
              {resource.category === 'video' && resource.videoUrl ? (
                <div className="aspect-w-16 aspect-h-9 mb-8 rounded-xl overflow-hidden">
                  <iframe 
                    src={resource.videoUrl} 
                    title={resource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : resource.category === 'external' ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-6">This resource is available on an external website.</p>
                  <a 
                    href={resource.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  >
                    Visit Website
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                  </a>
                </div>
              ) : (
                <div 
                  className="text-gray-200 resource-content"
                  dangerouslySetInnerHTML={{ __html: resource.content || '<p>Content coming soon...</p>' }}
                />
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related resources */}
            {relatedResources.length > 0 && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700 mb-8">
                <h3 className="text-xl font-semibold mb-6">Related Resources</h3>
                <div className="space-y-4">
                  {relatedResources.map(related => (
                    <div key={related.id} className="group">
                      <Link 
                        to={`/resources/${related.id}`}
                        className="flex items-start hover:bg-gray-700 p-3 rounded-xl transition"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                          {related.imageUrl ? (
                            <div 
                              className="w-full h-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${related.imageUrl})` }}
                            ></div>
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${getCategoryColor(related.category)}`}>
                                <FontAwesomeIcon 
                                  icon={getCategoryIcon(related.category)} 
                                  className="text-white text-xs" 
                                />
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-blue-400 transition line-clamp-2">{related.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${getCategoryTextColor(related.category)}`}>
                              {related.category.charAt(0).toUpperCase() + related.category.slice(1)}
                            </span>
                            {related.readTime && (
                              <span className="text-xs text-gray-400">
                                {related.readTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <Link 
                    to="/resources" 
                    className="text-blue-400 hover:text-blue-300 transition font-medium flex items-center justify-center"
                  >
                    View All Resources
                  </Link>
                </div>
              </div>
            )}
            
            {/* Help section */}
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 shadow-xl border border-blue-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20">
                  <FontAwesomeIcon icon={faLightbulb} className="text-white text-sm" />
                </span>
                Need More Support?
              </h3>
              <p className="text-gray-300 mb-6">
                If you're looking for personalized guidance or have questions about this resource, our AI assistant is here to help.
              </p>
              <button 
                onClick={onChatClick}
                className="w-full py-3 bg-white text-blue-800 font-medium rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faRobot} />
                Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage; 