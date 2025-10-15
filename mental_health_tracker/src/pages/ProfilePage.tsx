import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import HealthSectionContainer from '../components/health/HealthSectionContainer';

// Interface for mood entry
interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
  note?: string;
}

// Interface for assessment result
interface AssessmentResult {
  date: string;
  anxiety: number;
  depression: number;
  stress: number;
  wellbeing: number;
}

const ProfilePage: React.FC = () => {
  // User info state (would be from context in a real app)
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    joinDate: 'November 2023',
    completedAssessments: 8,
    journalEntries: 24,
    streak: 5
  });
  
  // Mood tracking state
  const [moodEntries] = useState<MoodEntry[]>([
    { date: '2023-06-12', mood: 4, note: 'Feeling productive today' },
    { date: '2023-06-11', mood: 3 },
    { date: '2023-06-10', mood: 3, note: 'Average day, nothing special' },
    { date: '2023-06-09', mood: 2, note: 'Feeling a bit anxious about work' },
    { date: '2023-06-08', mood: 4, note: 'Good day, went for a walk' },
    { date: '2023-06-07', mood: 5, note: 'Great news at work!' },
    { date: '2023-06-06', mood: 3 },
  ]);
  
  // Assessment results state
  const [assessmentResults] = useState<AssessmentResult[]>([
    {
      date: '2023-06-12',
      anxiety: 35,
      depression: 22,
      stress: 40,
      wellbeing: 68
    },
    {
      date: '2023-05-28',
      anxiety: 42,
      depression: 30,
      stress: 45,
      wellbeing: 60
    },
    {
      date: '2023-05-14',
      anxiety: 58,
      depression: 45,
      stress: 62,
      wellbeing: 48
    },
    {
      date: '2023-04-30',
      anxiety: 65,
      depression: 52,
      stress: 70,
      wellbeing: 40
    },
  ]);
  
  // Current mood state
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showMoodNote, setShowMoodNote] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('progress');
  
  // Handle mood selection
  const handleMoodSelect = (mood: number) => {
    setCurrentMood(mood);
    setShowMoodNote(true);
  };
  
  // Handle mood log submission
  const handleMoodSubmit = () => {
    // In a real app, this would save to a database
    setCurrentMood(null);
    setMoodNote('');
    setShowMoodNote(false);
    alert('Mood logged successfully!');
  };
  
  // Get a label for a mood value
  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Neutral';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };
  
  // Get a color for a mood value
  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-400';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get progress for a metric
  const getProgress = (metric: 'anxiety' | 'depression' | 'stress' | 'wellbeing') => {
    if (assessmentResults.length < 2) return 0;
    
    const latest = assessmentResults[0][metric];
    const previous = assessmentResults[1][metric];
    
    if (metric === 'wellbeing') {
      // For wellbeing, higher is better
      return latest - previous;
    } else {
      // For anxiety, depression, stress, lower is better
      return previous - latest;
    }
  };
  
  return (
    <div className="py-16 bg-lightBg min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-card shadow-card overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
                <div className="w-24 h-24 bg-white text-primary rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="opacity-90">{user.email}</p>
                <p className="text-sm opacity-75 mt-1">Member since {user.joinDate}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.completedAssessments}</div>
                    <div className="text-sm text-gray-500">Assessments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.journalEntries}</div>
                    <div className="text-sm text-gray-500">Journal Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.streak}</div>
                    <div className="text-sm text-gray-500">Day Streak</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link 
                    to="/assessment" 
                    className="block w-full py-3 px-4 bg-primary text-white text-center rounded-md hover:bg-secondary transition-colors"
                  >
                    <FontAwesomeIcon icon="clipboard-list" className="mr-2" />
                    Take Assessment
                  </Link>
                  
                  <Link 
                    to="/ai-tools" 
                    className="block w-full py-3 px-4 bg-tertiary text-primary text-center rounded-md hover:bg-primary hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon="robot" className="mr-2" />
                    AI Therapy Assistant
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-4">Quick Access</h3>
                  <div className="space-y-2">
                    <Link 
                      to="/account-settings" 
                      className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-tertiary hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon="cog" className="mr-3 w-5" />
                      Account Settings
                    </Link>
                    <Link 
                      to="/notifications" 
                      className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-tertiary hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon="bell" className="mr-3 w-5" />
                      Notifications
                      <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">3</span>
                    </Link>
                    <Link 
                      to="/privacy" 
                      className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-tertiary hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon="shield-alt" className="mr-3 w-5" />
                      Privacy & Data
                    </Link>
                    <button 
                      className="w-full flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-tertiary hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon="sign-out-alt" className="mr-3 w-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Add Health Dashboard */}
            <div className="bg-white rounded-card shadow-card overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Health Dashboard</h2>
                <p className="text-gray-600">Connect your smartwatch to get personalized wellness recommendations</p>
              </div>
              
              <div className="p-6">
                <HealthSectionContainer />
              </div>
            </div>
            
            {/* Mood tracker card */}
            <div className="bg-white rounded-card shadow-card overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Mood Tracker</h2>
                <p className="text-gray-600">Track your daily mood to identify patterns over time</p>
              </div>
              
              <div className="p-6">
                <h3 className="font-medium mb-4">How are you feeling today?</h3>
                
                {!currentMood ? (
                  <div className="flex items-center justify-between max-w-md mx-auto mb-6">
                    {[1, 2, 3, 4, 5].map(mood => (
                      <button 
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          getMoodColor(mood)
                        } text-white transition-transform hover:scale-110`}
                      >
                        {mood <= 2 ? '😞' : mood === 3 ? '😐' : mood === 4 ? '🙂' : '😄'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <div 
                        className={`w-16 h-16 ${getMoodColor(currentMood)} text-white text-2xl rounded-full mx-auto flex items-center justify-center mb-2`}
                      >
                        {currentMood <= 2 ? '😞' : currentMood === 3 ? '😐' : currentMood === 4 ? '🙂' : '😄'}
                      </div>
                      <div className="font-medium">{getMoodLabel(currentMood)}</div>
                    </div>
                    
                    {showMoodNote && (
                      <div className="max-w-md mx-auto">
                        <label htmlFor="mood-note" className="block text-sm font-medium text-gray-700 mb-1">
                          Add a note (optional)
                        </label>
                        <textarea
                          id="mood-note"
                          rows={3}
                          placeholder="What's contributing to your mood today?"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary mb-4"
                          value={moodNote}
                          onChange={(e) => setMoodNote(e.target.value)}
                        ></textarea>
                        
                        <div className="flex justify-between">
                          <button 
                            onClick={() => setCurrentMood(null)}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleMoodSubmit}
                            className="btn btn-primary"
                          >
                            Log Mood
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium mb-4">Recent Mood History</h3>
                  <div className="overflow-x-auto">
                    <div className="flex items-end space-x-4 pb-2 min-w-max">
                      {moodEntries.map((entry, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className={`w-8 h-${entry.mood * 6} ${getMoodColor(entry.mood)} rounded-t-md mx-auto`}
                            title={entry.note}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(entry.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress tabs */}
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'progress' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon="chart-line" className="mr-2" />
                    Progress
                  </button>
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'journal' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon="book" className="mr-2" />
                    Journal
                  </button>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                      activeTab === 'achievements' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon="trophy" className="mr-2" />
                    Achievements
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'progress' && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Assessment Progress</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Anxiety</h4>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              getProgress('anxiety') > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {getProgress('anxiety') > 0 ? (
                                <><FontAwesomeIcon icon="arrow-down" /> {Math.abs(getProgress('anxiety'))}%</>
                              ) : (
                                <><FontAwesomeIcon icon="arrow-up" /> {Math.abs(getProgress('anxiety'))}%</>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${assessmentResults[0].anxiety}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Depression</h4>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              getProgress('depression') > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {getProgress('depression') > 0 ? (
                                <><FontAwesomeIcon icon="arrow-down" /> {Math.abs(getProgress('depression'))}%</>
                              ) : (
                                <><FontAwesomeIcon icon="arrow-up" /> {Math.abs(getProgress('depression'))}%</>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${assessmentResults[0].depression}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Stress</h4>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              getProgress('stress') > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {getProgress('stress') > 0 ? (
                                <><FontAwesomeIcon icon="arrow-down" /> {Math.abs(getProgress('stress'))}%</>
                              ) : (
                                <><FontAwesomeIcon icon="arrow-up" /> {Math.abs(getProgress('stress'))}%</>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${assessmentResults[0].stress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Well-being</h4>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              getProgress('wellbeing') > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {getProgress('wellbeing') > 0 ? (
                                <><FontAwesomeIcon icon="arrow-up" /> {Math.abs(getProgress('wellbeing'))}%</>
                              ) : (
                                <><FontAwesomeIcon icon="arrow-down" /> {Math.abs(getProgress('wellbeing'))}%</>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${assessmentResults[0].wellbeing}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Assessment History</h3>
                        <Link to="/assessment-history" className="text-primary text-sm font-medium hover:underline">View All</Link>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anxiety</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depression</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stress</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Well-being</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {assessmentResults.map((result, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatDate(result.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.anxiety}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.depression}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.stress}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.wellbeing}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                  <Link to={`/assessment-results/${i}`} className="hover:underline">View Details</Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'journal' && (
                  <div className="text-center py-8">
                    <img src="https://images.unsplash.com/photo-1606472777984-26a079644be3" alt="Journal" className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Journal Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      We're working on a journaling feature to help you track your thoughts and emotions over time.
                    </p>
                    <button className="btn btn-primary">
                      <FontAwesomeIcon icon="bell" className="mr-2" />
                      Get Notified When It's Ready
                    </button>
                  </div>
                )}
                
                {activeTab === 'achievements' && (
                  <div className="text-center py-8">
                    <img src="https://images.unsplash.com/photo-1567913300214-364a4222e877" alt="Achievements" className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Achievements Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      We're developing an achievement system to celebrate your mental health journey milestones.
                    </p>
                    <button className="btn btn-primary">
                      <FontAwesomeIcon icon="bell" className="mr-2" />
                      Get Notified When It's Ready
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 