import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Define journal entry interface
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number; // 1-10
  activities: string[];
  sleepHours: number;
  tags: string[];
}

// Define weekly report interface
interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  averageMood: number;
  moodTrend: 'up' | 'down' | 'stable';
  sleepAverage: number;
  topActivities: string[];
  insightMessage: string;
}

const JournalPage: React.FC = () => {
  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2023-04-01',
      title: 'Productive Saturday',
      content: 'Had a great day working on my projects. Finished the proposal and went for a jog in the evening.',
      mood: 8,
      activities: ['Work', 'Exercise', 'Reading'],
      sleepHours: 7.5,
      tags: ['productive', 'weekend', 'exercise']
    },
    {
      id: '2',
      date: '2023-04-02',
      title: 'Relaxing Sunday',
      content: 'Spent the day with family. We went to the park and had a picnic. Weather was perfect.',
      mood: 9,
      activities: ['Family', 'Outdoors', 'Relaxation'],
      sleepHours: 8,
      tags: ['family', 'weekend', 'outdoors']
    },
    {
      id: '3',
      date: '2023-04-03',
      title: 'Monday Blues',
      content: 'Difficult start to the week. Had a challenging meeting at work but managed to resolve the issues.',
      mood: 5,
      activities: ['Work', 'Meditation'],
      sleepHours: 6,
      tags: ['work', 'stress', 'monday']
    },
    {
      id: '4',
      date: '2023-04-04',
      title: 'Feeling Better',
      content: 'Work was more manageable today. Had a good chat with my team lead about the project roadmap.',
      mood: 7,
      activities: ['Work', 'Social', 'Cooking'],
      sleepHours: 7,
      tags: ['work', 'social', 'cooking']
    },
    {
      id: '5',
      date: '2023-04-05',
      title: 'Midweek Motivation',
      content: 'Productive day at work. Started a new book in the evening and did some light stretching.',
      mood: 7,
      activities: ['Work', 'Reading', 'Exercise'],
      sleepHours: 7.5,
      tags: ['productive', 'reading', 'exercise']
    },
    {
      id: '6',
      date: '2023-04-06',
      title: 'Looking Forward to Weekend',
      content: 'Wrapped up major tasks at work. Planning a hike for the weekend if weather permits.',
      mood: 8,
      activities: ['Work', 'Planning', 'Meditation'],
      sleepHours: 7,
      tags: ['work', 'planning', 'weekend']
    },
    {
      id: '7',
      date: '2023-04-07',
      title: 'Friday Feelings',
      content: 'Finished the week strong. Had dinner with friends and discussed plans for the weekend.',
      mood: 8,
      activities: ['Work', 'Social', 'Relaxation'],
      sleepHours: 7,
      tags: ['friday', 'social', 'weekend']
    }
  ]);

  // Current week report
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport>({
    weekStart: '2023-04-01',
    weekEnd: '2023-04-07',
    averageMood: 7.4,
    moodTrend: 'up',
    sleepAverage: 7.1,
    topActivities: ['Work', 'Exercise', 'Social'],
    insightMessage: 'Your mood improved throughout the week. Exercise days correlated with higher mood scores.'
  });

  // Showing weekly report or entries
  const [showWeeklyReport, setShowWeeklyReport] = useState(true);

  // New entry form
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 5,
    activities: [],
    sleepHours: 7,
    tags: []
  });
  
  // Activity options for selection
  const activityOptions = [
    'Work', 'Exercise', 'Reading', 'Meditation', 'Social', 
    'Family', 'Outdoors', 'Relaxation', 'Cooking', 'Study', 
    'Hobbies', 'Entertainment', 'Shopping', 'Cleaning', 'Travel'
  ];
  
  // Color mapping for mood scores
  const getMoodColor = (score: number): string => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle new entry submission
  const handleNewEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood || 5,
        activities: newEntry.activities || [],
        sleepHours: newEntry.sleepHours || 7,
        tags: newEntry.tags || []
      };
      
      setJournalEntries([entry, ...journalEntries]);
      setNewEntry({
        title: '',
        content: '',
        mood: 5,
        activities: [],
        sleepHours: 7,
        tags: []
      });
      setShowNewEntryForm(false);
      
      // Update weekly report
      updateWeeklyReport([entry, ...journalEntries]);
    }
  };

  // Update weekly report based on entries
  const updateWeeklyReport = (entries: JournalEntry[]) => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
    const weekEnd = new Date(today.setDate(today.getDate() + 6)).toISOString().split('T')[0];
    
    const weekEntries = entries.filter(entry => entry.date >= weekStart && entry.date <= weekEnd);
    
    if (weekEntries.length > 0) {
      const avgMood = weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
      const avgSleep = weekEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / weekEntries.length;
      
      // Calculate mood trend
      const moodTrend = weekEntries[0].mood > weekEntries[weekEntries.length - 1].mood ? 'up' : 
                        weekEntries[0].mood < weekEntries[weekEntries.length - 1].mood ? 'down' : 'stable';
      
      // Get top activities
      const activityCount = new Map<string, number>();
      weekEntries.forEach(entry => {
        entry.activities.forEach(activity => {
          activityCount.set(activity, (activityCount.get(activity) || 0) + 1);
        });
      });
      
      const topActivities = Array.from(activityCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([activity]) => activity);
      
      setWeeklyReport({
        weekStart,
        weekEnd,
        averageMood: Number(avgMood.toFixed(1)),
        moodTrend,
        sleepAverage: Number(avgSleep.toFixed(1)),
        topActivities,
        insightMessage: generateInsightMessage(avgMood, moodTrend, topActivities)
      });
    }
  };

  // Generate insight message based on data
  const generateInsightMessage = (avgMood: number, trend: string, activities: string[]): string => {
    let message = '';
    
    if (avgMood >= 7) {
      message = 'You had a great week! ';
    } else if (avgMood >= 5) {
      message = 'You had a balanced week. ';
    } else {
      message = 'This week had some challenges. ';
    }
    
    if (trend === 'up') {
      message += 'Your mood has been improving. ';
    } else if (trend === 'down') {
      message += 'Your mood has been declining. Consider incorporating more activities you enjoy. ';
    }
    
    if (activities.length > 0) {
      message += `Your top activities were ${activities.join(', ')}. These seem to positively impact your well-being.`;
    }
    
    return message;
  };
  
  // Generate weekly report data visualization
  const renderWeeklyReport = () => {
    return (
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Weekly Wellness Report</h2>
          <div className="text-gray-400">
            {formatDate(weeklyReport.weekStart)} - {formatDate(weeklyReport.weekEnd)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon="chart-line" className="text-blue-400 mr-2" />
              Mood Trend
            </h3>
            
            <div className="relative h-60">
              <svg className="w-full h-full" viewBox="0 0 350 200">
                {/* X and Y Axes */}
                <line x1="40" y1="170" x2="330" y2="170" stroke="#4B5563" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#4B5563" strokeWidth="2" />
                
                {/* Horizontal Grid Lines */}
                <line x1="40" y1="20" x2="330" y2="20" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="57.5" x2="330" y2="57.5" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="95" x2="330" y2="95" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="132.5" x2="330" y2="132.5" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Y-axis Labels */}
                <text x="30" y="25" textAnchor="end" fill="white" fontSize="12">10</text>
                <text x="30" y="62.5" textAnchor="end" fill="white" fontSize="12">7.5</text>
                <text x="30" y="100" textAnchor="end" fill="white" fontSize="12">5</text>
                <text x="30" y="137.5" textAnchor="end" fill="white" fontSize="12">2.5</text>
                <text x="30" y="175" textAnchor="end" fill="white" fontSize="12">0</text>
                
                {/* Area under the mood line */}
                <path 
                  d={
                    journalEntries.map((entry, index) => {
                      const x = 40 + (index * 40);
                      const y = 170 - (entry.mood * 15);
                      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ') + 
                    ` L ${40 + ((journalEntries.length - 1) * 40)} 170 L 40 170 Z`
                  }
                  fill="url(#moodGradient)" 
                  opacity="0.3"
                />
                
                {/* Define gradient for area fill */}
                <defs>
                  <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* Mood Line */}
                <path 
                  d={journalEntries.map((entry, index) => {
                    const x = 40 + (index * 40);
                    const y = 170 - (entry.mood * 15);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  fill="none" 
                />
                
                {/* Mood Points */}
                {journalEntries.map((entry, index) => {
                  const x = 40 + (index * 40);
                  const y = 170 - (entry.mood * 15);
                  return (
                    <g key={index}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="5" 
                        fill={getMoodColor(entry.mood).replace('bg-', 'fill-')} 
                      />
                    </g>
                  );
                })}
                
                {/* X-axis Labels (days) */}
                {journalEntries.map((entry, index) => {
                  const x = 40 + (index * 40);
                  const date = new Date(entry.date);
                  return (
                    <text 
                      key={index} 
                      x={x} 
                      y="185" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="10"
                    >
                      {date.toLocaleDateString('en-US', {weekday: 'short'})}
                    </text>
                  );
                })}
                
                {/* Average mood line */}
                <line 
                  x1="40" 
                  y1={170 - (weeklyReport.averageMood * 15)} 
                  x2="330" 
                  y2={170 - (weeklyReport.averageMood * 15)} 
                  stroke="#EF4444" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                />
                <text 
                  x="325" 
                  y={165 - (weeklyReport.averageMood * 15)} 
                  textAnchor="end" 
                  fill="#EF4444" 
                  fontSize="12"
                >
                  Avg: {weeklyReport.averageMood.toFixed(1)}
                </text>
              </svg>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  weeklyReport.moodTrend === 'up' ? 'bg-green-500' : 
                  weeklyReport.moodTrend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-gray-300 text-sm">
                  {weeklyReport.moodTrend === 'up' ? 'Trend: Improving' : 
                   weeklyReport.moodTrend === 'down' ? 'Trend: Declining' : 'Trend: Stable'}
                </span>
              </div>
              <span className="text-gray-300 text-sm">Average: {weeklyReport.averageMood.toFixed(1)}/10</span>
            </div>
          </div>
          
          {/* Sleep Quality */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon="moon" className="text-indigo-400 mr-2" />
              Sleep Duration
            </h3>
            
            <div className="relative h-60">
              <svg className="w-full h-full" viewBox="0 0 350 200">
                {/* X and Y Axes */}
                <line x1="40" y1="170" x2="330" y2="170" stroke="#4B5563" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#4B5563" strokeWidth="2" />
                
                {/* Horizontal Grid Lines */}
                <line x1="40" y1="20" x2="330" y2="20" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="57.5" x2="330" y2="57.5" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="95" x2="330" y2="95" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="40" y1="132.5" x2="330" y2="132.5" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Y-axis Labels */}
                <text x="30" y="25" textAnchor="end" fill="white" fontSize="12">10h</text>
                <text x="30" y="62.5" textAnchor="end" fill="white" fontSize="12">7.5h</text>
                <text x="30" y="100" textAnchor="end" fill="white" fontSize="12">5h</text>
                <text x="30" y="137.5" textAnchor="end" fill="white" fontSize="12">2.5h</text>
                <text x="30" y="175" textAnchor="end" fill="white" fontSize="12">0h</text>
                
                {/* Sleep hours bars */}
                {journalEntries.map((entry, index) => {
                  const x = 40 + (index * 40);
                  const barHeight = entry.sleepHours * 15;
                  return (
                    <g key={index}>
                      <rect 
                        x={x - 12} 
                        y={170 - barHeight} 
                        width="24" 
                        height={barHeight} 
                        fill="rgba(139, 92, 246, 0.6)" 
                        rx="3"
                      />
                      <text 
                        x={x} 
                        y={165 - barHeight} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="10"
                      >
                        {entry.sleepHours}h
                      </text>
                    </g>
                  );
                })}
                
                {/* X-axis Labels (days) */}
                {journalEntries.map((entry, index) => {
                  const x = 40 + (index * 40);
                  const date = new Date(entry.date);
                  return (
                    <text 
                      key={index} 
                      x={x} 
                      y="185" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="10"
                    >
                      {date.toLocaleDateString('en-US', {weekday: 'short'})}
                    </text>
                  );
                })}
                
                {/* Average sleep line */}
                <line 
                  x1="40" 
                  y1={170 - (weeklyReport.sleepAverage * 15)} 
                  x2="330" 
                  y2={170 - (weeklyReport.sleepAverage * 15)} 
                  stroke="#EF4444" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                />
                <text 
                  x="325" 
                  y={165 - (weeklyReport.sleepAverage * 15)} 
                  textAnchor="end" 
                  fill="#EF4444" 
                  fontSize="12"
                >
                  Avg: {weeklyReport.sleepAverage.toFixed(1)}h
                </text>
              </svg>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300 text-sm">Recommended: 7-9 hours</span>
              <span className="text-gray-300 text-sm">Average: {weeklyReport.sleepAverage.toFixed(1)} hours</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Top Activities */}
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon="running" className="text-green-400 mr-2" />
              Top Activities
            </h3>
            
            <ul className="space-y-3">
              {weeklyReport.topActivities.map((activity, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Weekly Insights */}
          <div className="bg-gray-800 rounded-lg p-5 col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon="lightbulb" className="text-yellow-400 mr-2" />
              Weekly Insights
            </h3>
            
            <p className="text-gray-300">{weeklyReport.insightMessage}</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full bg-blue-900 text-blue-300 text-sm flex items-center">
                <FontAwesomeIcon icon="smile" className="mr-1" />
                Best Day: {formatDate(journalEntries.reduce((prev, current) => 
                  (prev.mood > current.mood) ? prev : current
                ).date)}
              </div>
              
              <div className="px-3 py-1 rounded-full bg-purple-900 text-purple-300 text-sm flex items-center">
                <FontAwesomeIcon icon="moon" className="mr-1" />
                Best Sleep: {journalEntries.reduce((prev, current) => 
                  (prev.sleepHours > current.sleepHours) ? prev : current
                ).sleepHours} hours
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setShowWeeklyReport(false)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
          >
            <FontAwesomeIcon icon="book" className="mr-2" />
            View Journal Entries
          </button>
        </div>
      </div>
    );
  };
  
  // Render journal entries list
  const renderJournalEntries = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Journal Entries</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowWeeklyReport(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon="chart-line" className="mr-2" />
              View Weekly Report
            </button>
            <button 
              onClick={() => setShowNewEntryForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
            >
              <FontAwesomeIcon icon="plus" className="mr-2" />
              New Entry
            </button>
          </div>
        </div>

        {showNewEntryForm && (
          <div className="mb-6 bg-gray-900 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">New Journal Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                  placeholder="Enter a title for your entry"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Content</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 h-32"
                  placeholder="Write your thoughts here..."
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Mood (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({ ...newEntry, mood: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Activities</label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => {
                        const activities = newEntry.activities || [];
                        if (activities.includes(activity)) {
                          setNewEntry({
                            ...newEntry,
                            activities: activities.filter((a) => a !== activity)
                          });
                        } else {
                          setNewEntry({
                            ...newEntry,
                            activities: [...activities, activity]
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        (newEntry.activities || []).includes(activity)
                          ? 'bg-primary text-white'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Sleep Hours</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={newEntry.sleepHours}
                  onChange={(e) => setNewEntry({ ...newEntry, sleepHours: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={(newEntry.tags || []).join(', ')}
                  onChange={(e) => setNewEntry({
                    ...newEntry,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                  placeholder="e.g. productive, exercise, family"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowNewEntryForm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewEntry}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="bg-gray-900 rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                  <p className="text-gray-400">{formatDate(entry.date)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${getMoodColor(entry.mood)} text-white text-sm`}>
                  Mood: {entry.mood}/10
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{entry.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.activities.map((activity, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                    {activity}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <FontAwesomeIcon icon="moon" className="mr-1" />
                <span className="mr-4">Sleep: {entry.sleepHours} hours</span>
                
                <div className="flex gap-1">
                  {entry.tags.map((tag, idx) => (
                    <span key={idx} className="text-gray-500">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Your Wellness Journal</h1>
        <div className="text-gray-400">
          <span className="bg-gray-800 px-4 py-2 rounded-md">Week of {formatDate(weeklyReport.weekStart)}</span>
        </div>
      </div>
      
      {showWeeklyReport ? renderWeeklyReport() : renderJournalEntries()}
    </div>
  );
};

export default JournalPage; 