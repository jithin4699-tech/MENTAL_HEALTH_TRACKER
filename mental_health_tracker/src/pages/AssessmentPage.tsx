import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

// Define assessment question types
interface AssessmentQuestion {
  id: string;
  text: string;
  options: string[];
  type: 'single' | 'multiple';
}

// Define assessment sections
interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

// Define sleep data tracking
interface SleepEntry {
  date: string;
  hoursSlept: number;
  quality: number; // 1-5 scale
  notes: string;
}

// Define mood tracking data
interface MoodEntry {
  date: string;
  score: number; // 1-10 scale
  notes: string;
}

// Define result metrics
interface AssessmentResults {
  anxiety: number;
  depression: number;
  stress: number;
  wellbeing: number;
  sleepQuality: number;
  recommendations: string[];
}

const AssessmentPage: React.FC = () => {
  // State for assessment progress
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState<AssessmentResults>({
    anxiety: 0,
    depression: 0,
    stress: 0,
    wellbeing: 0,
    sleepQuality: 0,
    recommendations: []
  });
  
  // Sleep tracking state
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([
    { date: '2023-04-01', hoursSlept: 7.5, quality: 4, notes: 'Went to bed early' },
    { date: '2023-04-02', hoursSlept: 6, quality: 3, notes: 'Woke up several times' },
    { date: '2023-04-03', hoursSlept: 8, quality: 5, notes: 'Best sleep in weeks' },
    { date: '2023-04-04', hoursSlept: 5.5, quality: 2, notes: 'Stress affecting sleep' },
    { date: '2023-04-05', hoursSlept: 7, quality: 3, notes: 'Average night' },
    { date: '2023-04-06', hoursSlept: 6.5, quality: 3, notes: 'Took a while to fall asleep' },
    { date: '2023-04-07', hoursSlept: 7.5, quality: 4, notes: 'Slept well' },
  ]);
  
  // Mood tracking state
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { date: '2023-04-01', score: 7, notes: 'Feeling good today' },
    { date: '2023-04-02', score: 5, notes: 'Neutral day' },
    { date: '2023-04-03', score: 8, notes: 'Great day at work' },
    { date: '2023-04-04', score: 4, notes: 'Feeling stressed' },
    { date: '2023-04-05', score: 6, notes: 'Better than yesterday' },
    { date: '2023-04-06', score: 7, notes: 'Good energy levels' },
    { date: '2023-04-07', score: 6, notes: 'Slight anxiety but managing' },
  ]);
  
  // Show sleep journal
  const [showSleepJournal, setShowSleepJournal] = useState(false);
  
  // Show mood tracker
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  // State for new entries
  const [newSleepEntry, setNewSleepEntry] = useState<Partial<SleepEntry>>({
    hoursSlept: 7,
    quality: 3,
    notes: ''
  });

  const [newMoodEntry, setNewMoodEntry] = useState<Partial<MoodEntry>>({
    score: 5,
    notes: ''
  });

  // Assessment sections
  const sections: AssessmentSection[] = [
    {
      id: 'mood',
      title: 'Mood Assessment',
      description: 'These questions help us understand your general mood and emotional state over the past two weeks.',
      questions: [
        {
          id: 'mood_1',
          text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
          options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
          type: 'single'
        },
        {
          id: 'mood_2',
          text: 'Over the past 2 weeks, how often have you had little interest or pleasure in doing things?',
          options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
          type: 'single'
        },
        {
          id: 'mood_3',
          text: 'How would you rate your overall mood right now?',
          options: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'],
          type: 'single'
        }
      ]
    },
    {
      id: 'anxiety',
      title: 'Anxiety Assessment',
      description: 'These questions help us understand your anxiety levels and how they might be affecting you.',
      questions: [
        {
          id: 'anxiety_1',
          text: 'Over the past 2 weeks, how often have you been feeling nervous, anxious, or on edge?',
          options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
          type: 'single'
        },
        {
          id: 'anxiety_2',
          text: 'Over the past 2 weeks, how often have you been unable to stop or control worrying?',
          options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
          type: 'single'
        },
        {
          id: 'anxiety_3',
          text: 'Which of the following physical symptoms of anxiety have you experienced in the past 2 weeks? (Select all that apply)',
          options: ['Restlessness', 'Fatigue', 'Difficulty concentrating', 'Irritability', 'Muscle tension', 'Sleep problems', 'None of the above'],
          type: 'multiple'
        }
      ]
    },
    {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'These questions help us understand your stress levels and potential stressors in your life.',
      questions: [
        {
          id: 'stress_1',
          text: 'In the past month, how often have you felt that you were unable to control the important things in your life?',
          options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
          type: 'single'
        },
        {
          id: 'stress_2',
          text: 'In the past month, how often have you felt confident about your ability to handle your personal problems?',
          options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
          type: 'single'
        },
        {
          id: 'stress_3',
          text: 'Which areas of your life are currently causing you stress? (Select all that apply)',
          options: ['Work/School', 'Relationships', 'Finances', 'Health', 'Family', 'Future plans', 'None of the above'],
          type: 'multiple'
        }
      ]
    },
    {
      id: 'coping',
      title: 'Coping Strategies',
      description: 'These questions help us understand how you manage stress and emotional challenges.',
      questions: [
        {
          id: 'coping_1',
          text: 'What strategies do you currently use to cope with stress or negative emotions? (Select all that apply)',
          options: ['Exercise', 'Meditation', 'Talking to friends/family', 'Professional support', 'Creative activities', 'Spending time in nature', 'None of the above'],
          type: 'multiple'
        },
        {
          id: 'coping_2',
          text: 'How effective do you find your current coping strategies?',
          options: ['Not at all effective', 'Slightly effective', 'Moderately effective', 'Very effective', 'Extremely effective'],
          type: 'single'
        },
        {
          id: 'coping_3',
          text: 'How open are you to trying new strategies for managing your mental health?',
          options: ['Not at all open', 'Slightly open', 'Moderately open', 'Very open', 'Extremely open'],
          type: 'single'
        }
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep Assessment',
      description: 'These questions help us understand your sleep patterns and quality.',
      questions: [
        {
          id: 'sleep_1',
          text: 'On average, how many hours of sleep do you get per night?',
          options: ['Less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours'],
          type: 'single'
        },
        {
          id: 'sleep_2',
          text: 'How would you rate your overall sleep quality?',
          options: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'],
          type: 'single'
        },
        {
          id: 'sleep_3',
          text: 'Which sleep issues have you experienced in the past month? (Select all that apply)',
          options: ['Difficulty falling asleep', 'Waking up during the night', 'Waking up too early', 'Feeling tired after sleeping', 'Snoring/breathing issues', 'None of the above'],
          type: 'multiple'
        }
      ]
    }
  ];

  // Calculate current question
  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];

  // Track progress percentage
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const completedQuestions = Object.keys(answers).length;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  // Handle answer selection
  const handleSingleSelection = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleMultipleSelection = (questionId: string, answerIndex: number) => {
    setAnswers(prev => {
      const currentSelections = Array.isArray(prev[questionId]) ? prev[questionId] as number[] : [];
      
      if (currentSelections.includes(answerIndex)) {
        // Remove if already selected
        return {
          ...prev,
          [questionId]: currentSelections.filter(index => index !== answerIndex)
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [questionId]: [...currentSelections, answerIndex]
        };
      }
    });
  };

  // Navigation handlers
  const handleNext = () => {
    // Check if an answer has been selected
    if (answers[currentQuestionData.id] === undefined) {
      // For single-choice questions, require an answer
      if (currentQuestionData.type === 'single') {
        return; // Don't proceed without an answer
      }
      // For multiple-choice, set empty array if nothing selected
      if (currentQuestionData.type === 'multiple') {
        setAnswers(prev => ({
          ...prev,
          [currentQuestionData.id]: []
        }));
      }
    }

    // Check if there are more questions in this section
    if (currentQuestion < currentSectionData.questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to next section or show results
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
      } else {
        // Calculate and display results
        calculateResults();
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // Move to previous question in this section
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      // Move to previous section, last question
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    }
  };

  // Calculate assessment results
  const calculateResults = () => {
    // This is a simplified scoring system for demonstration
    // In a real app, this would be more sophisticated

    // Calculate anxiety score (0-10)
    const anxietyScore = Math.min(10, (
      (answers['anxiety_1'] as number || 0) * 2 + 
      (answers['anxiety_2'] as number || 0) * 2 + 
      (Array.isArray(answers['anxiety_3']) ? answers['anxiety_3'].length : 0)
    ));
    
    // Calculate depression score (0-10)
    const depressionScore = Math.min(10, (
      (answers['mood_1'] as number || 0) * 2 + 
      (answers['mood_2'] as number || 0) * 2 + 
      (4 - (answers['mood_3'] as number || 0))
    ));
    
    // Calculate stress score (0-10)
    const stressScore = Math.min(10, (
      (answers['stress_1'] as number || 0) * 1.5 + 
      (4 - (answers['stress_2'] as number || 0)) * 1.5 + 
      (Array.isArray(answers['stress_3']) ? answers['stress_3'].length : 0)
    ));
    
    // Calculate wellbeing score (0-10)
    const wellbeingScore = Math.min(10, (
      (Array.isArray(answers['coping_1']) ? answers['coping_1'].length : 0) + 
      (answers['coping_2'] as number || 0) * 1.5 + 
      (answers['coping_3'] as number || 0)
    ));

    // Calculate sleep quality score (0-10)
    const sleepQualityScore = Math.min(10, (
      (answers['sleep_1'] as number || 0) * 1.5 + 
      (answers['sleep_2'] as number || 0) * 1.5 + 
      (6 - (Array.isArray(answers['sleep_3']) ? Math.min(5, answers['sleep_3'].length) : 0))
    ));
    
    // Generate personalized recommendations
    const recommendations = generateRecommendations(anxietyScore, depressionScore, stressScore, wellbeingScore, sleepQualityScore);
    
    setResultsData({
      anxiety: anxietyScore,
      depression: depressionScore,
      stress: stressScore,
      wellbeing: wellbeingScore,
      sleepQuality: sleepQualityScore,
      recommendations
    });
  };

  // Generate recommendations based on scores
  const generateRecommendations = (anxiety: number, depression: number, stress: number, wellbeing: number, sleepQuality: number): string[] => {
    const recommendations: string[] = [];
    
    if (anxiety > 6) {
      recommendations.push('Your anxiety levels appear elevated. Consider practicing daily mindfulness or breathing exercises.');
    }
    
    if (depression > 6) {
      recommendations.push('Your responses indicate you may be experiencing low mood. Regular physical activity and social connection can help.');
    }
    
    if (stress > 6) {
      recommendations.push('You seem to be experiencing significant stress. Try to identify your stressors and develop a stress management plan.');
    }
    
    if (wellbeing < 5) {
      recommendations.push('Consider incorporating more self-care activities into your routine to improve your overall wellbeing.');
    }
    
    if (sleepQuality < 5) {
      recommendations.push('Your sleep quality could be improved. Consider establishing a regular sleep schedule and bedtime routine.');
    }
    
    // Add a general recommendation if no specific ones are needed
    if (recommendations.length === 0) {
      recommendations.push('Your mental health appears to be in good condition. Continue with your current healthy habits and self-care routines.');
    }
    
    return recommendations;
  };

  // Render metrics bars
  const renderMetricBar = (label: string, value: number, maxValue: number, colorClass: string) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-medium">{label}</span>
          <span className="text-white">{value}/{maxValue}</span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${colorClass}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Calculate average sleep quality
  const calculateAverageSleepQuality = () => {
    if (sleepEntries.length === 0) return 0;
    const totalQuality = sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
    return totalQuality / sleepEntries.length;
  };

  // Calculate sleep quality trend
  const calculateSleepQualityTrend = () => {
    if (sleepEntries.length < 2) return 'stable';
    const recentQuality = sleepEntries[0].quality;
    const previousQuality = sleepEntries[1].quality;
    return recentQuality > previousQuality ? 'up' : recentQuality < previousQuality ? 'down' : 'stable';
  };

  // Render the results page
  const renderResults = () => {
    const getScoreCategory = (score: number): string => {
      if (score <= 3) return 'Low';
      if (score <= 6) return 'Moderate';
      return 'High';
    };
    
    const averageSleepQuality = calculateAverageSleepQuality();
    const sleepQualityTrend = calculateSleepQualityTrend();
    
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Assessment Results</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Results Summary Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Anxiety Card */}
              <div className="assessment-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 mood-anxious -mt-10 -mr-10"></div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon="brain" className="text-2xl text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Anxiety</h3>
                    <p className="text-gray-400">{getScoreCategory(resultsData.anxiety)} level</p>
                  </div>
                </div>
                {renderMetricBar('Anxiety Level', resultsData.anxiety, 10, 'mood-anxious')}
                <p className="text-gray-300 mt-4">
                  {resultsData.anxiety <= 3 
                    ? 'Your anxiety levels appear to be well-managed.'
                    : resultsData.anxiety <= 6
                      ? 'You are experiencing moderate anxiety levels.'
                      : 'Your anxiety levels are elevated and may benefit from intervention.'
                  }
                </p>
              </div>

              {/* Depression Card */}
              <div className="assessment-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 mood-sad -mt-10 -mr-10"></div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon="cloud-rain" className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Depression</h3>
                    <p className="text-gray-400">{getScoreCategory(resultsData.depression)} level</p>
                  </div>
                </div>
                {renderMetricBar('Depression Level', resultsData.depression, 10, 'mood-sad')}
                <p className="text-gray-300 mt-4">
                  {resultsData.depression <= 3 
                    ? 'Your mood appears to be positive and well-balanced.'
                    : resultsData.depression <= 6
                      ? 'You are experiencing some low mood symptoms.'
                      : 'Your responses indicate significant low mood that may benefit from support.'
                  }
                </p>
              </div>

              {/* Stress Card */}
              <div className="assessment-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 bg-red-500 -mt-10 -mr-10"></div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon="bolt" className="text-2xl text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Stress</h3>
                    <p className="text-gray-400">{getScoreCategory(resultsData.stress)} level</p>
                  </div>
                </div>
                {renderMetricBar('Stress Level', resultsData.stress, 10, 'bg-red-500')}
                <p className="text-gray-300 mt-4">
                  {resultsData.stress <= 3 
                    ? 'Your stress levels appear to be well-managed.'
                    : resultsData.stress <= 6
                      ? 'You are experiencing moderate stress.'
                      : 'Your stress levels are elevated and may benefit from stress-reduction techniques.'
                  }
                </p>
              </div>

              {/* Well-being Card */}
              <div className="assessment-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 mood-happy -mt-10 -mr-10"></div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon="heart" className="text-2xl text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Well-being</h3>
                    <p className="text-gray-400">{getScoreCategory(resultsData.wellbeing)} level</p>
                  </div>
                </div>
                {renderMetricBar('Well-being Score', resultsData.wellbeing, 10, 'mood-happy')}
                <p className="text-gray-300 mt-4">
                  {resultsData.wellbeing >= 7 
                    ? 'Your well-being score is excellent. Keep up the good self-care!'
                    : resultsData.wellbeing >= 4
                      ? 'Your well-being is average. There is room for improvement.'
                      : 'Your well-being score suggests you may benefit from more self-care activities.'
                  }
                </p>
              </div>
              
              {/* Sleep Quality Card */}
              <div className="assessment-card p-6 relative overflow-hidden col-span-1 md:col-span-2">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 bg-indigo-500 -mt-10 -mr-10"></div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon="moon" className="text-2xl text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Sleep Quality</h3>
                    <p className="text-gray-400">
                      Average Quality: {averageSleepQuality.toFixed(1)}/5
                      <span className="ml-2">
                        {sleepQualityTrend === 'up' ? '↑' : sleepQualityTrend === 'down' ? '↓' : '→'}
                      </span>
                    </p>
                  </div>
                </div>
                {renderMetricBar('Sleep Quality', resultsData.sleepQuality, 10, 'bg-indigo-500')}
                <p className="text-gray-300 mt-4">
                  Based on your recent sleep entries, your sleep quality is {
                    averageSleepQuality >= 4 ? 'excellent' :
                    averageSleepQuality >= 3 ? 'good' :
                    averageSleepQuality >= 2 ? 'fair' : 'poor'
                  }.
                </p>
                
                <button 
                  onClick={() => setShowSleepJournal(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors text-white flex items-center justify-center"
                >
                  <FontAwesomeIcon icon="clipboard-list" className="mr-2" />
                  View Sleep Journal
                </button>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="assessment-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon="lightbulb" className="text-yellow-400 mr-3" />
                Personalized Recommendations
              </h3>
              <ul className="space-y-3">
                {resultsData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <FontAwesomeIcon icon="check-circle" className="text-green-400 mt-1 mr-3" />
                    <span className="text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Mood Tracking Section */}
          <div className="w-full lg:w-1/3">
            <div className="assessment-card p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon="chart-line" className="text-blue-400 mr-3" />
                Mood Tracking
              </h3>
              
              <div className="relative h-60 mb-6">
                {/* SVG Line Chart for Mood */}
                <svg className="w-full h-full" viewBox="0 0 300 200">
                  {/* X and Y Axes */}
                  <line x1="40" y1="170" x2="280" y2="170" stroke="#4B5563" strokeWidth="2" />
                  <line x1="40" y1="20" x2="40" y2="170" stroke="#4B5563" strokeWidth="2" />
                  
                  {/* Horizontal Grid Lines */}
                  <line x1="40" y1="20" x2="280" y2="20" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="40" y1="50" x2="280" y2="50" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="40" y1="80" x2="280" y2="80" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="40" y1="110" x2="280" y2="110" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="40" y1="140" x2="280" y2="140" stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
                  
                  {/* Y-axis Labels */}
                  <text x="30" y="20" textAnchor="end" fill="white" fontSize="10">10</text>
                  <text x="30" y="50" textAnchor="end" fill="white" fontSize="10">8</text>
                  <text x="30" y="80" textAnchor="end" fill="white" fontSize="10">6</text>
                  <text x="30" y="110" textAnchor="end" fill="white" fontSize="10">4</text>
                  <text x="30" y="140" textAnchor="end" fill="white" fontSize="10">2</text>
                  <text x="30" y="170" textAnchor="end" fill="white" fontSize="10">0</text>
                  
                  {/* Mood Data Points */}
                  {moodEntries.map((entry, index) => {
                    const x = 40 + (index * 35);
                    const y = 170 - (entry.score * 15);
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="5" fill="#6B8CBE" />
                        {index > 0 && (
                          <line 
                            x1={40 + ((index-1) * 35)} 
                            y1={170 - (moodEntries[index-1].score * 15)} 
                            x2={x} 
                            y2={y} 
                            stroke="#6B8CBE" 
                            strokeWidth="2" 
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* X-axis Labels (dates) */}
                  {moodEntries.map((entry, index) => {
                    const x = 40 + (index * 35);
                    return (
                      <text 
                        key={index} 
                        x={x} 
                        y="185" 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="8"
                      >
                        {new Date(entry.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                      </text>
                    );
                  })}
                </svg>
              </div>
              
              <button 
                onClick={() => setShowMoodTracker(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white flex items-center justify-center"
              >
                <FontAwesomeIcon icon="smile" className="mr-2" />
                View Mood Tracker
              </button>
            </div>
            
            {/* Call to Action */}
            <div className="assessment-card p-6">
              <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
              <p className="text-gray-300 mb-4">
                Based on your assessment results, we recommend exploring these resources:
              </p>
              <div className="space-y-3">
                <Link to="/resources" className="block px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon="book" className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Mental Health Library</h4>
                      <p className="text-sm text-gray-400">Articles and guides tailored to your needs</p>
                    </div>
                  </div>
                </Link>
                <Link to="/community" className="block px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon="users" className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Community Support</h4>
                      <p className="text-sm text-gray-400">Connect with others who understand</p>
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-left"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon="redo" className="text-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Retake Assessment</h4>
                      <p className="text-sm text-gray-400">Track your progress over time</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the question form
  const renderQuestionForm = () => {
    return (
      <div className="min-h-screen bg-lightBg parallax">
        <div className="container py-12">
          <div className="glass-card max-w-3xl mx-auto p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pattern-1 rounded-full -mr-16 -mt-16 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pattern-2 rounded-full -ml-12 -mb-12 opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
                <div className="text-sm text-gray-500">
                  Section {currentSection + 1} of {sections.length}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-2 animated-gradient rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Start</span>
                  <span>Progress: {progressPercentage.toFixed(0)}%</span>
                  <span>Complete</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">{currentSectionData.title}</h2>
                <p className="text-gray-600 mb-6">{currentSectionData.description}</p>
                
                <div className="card p-6 mb-6 floating">
                  <h3 className="text-xl font-semibold mb-4">
                    {currentQuestionData.text}
                  </h3>
                  
                  {currentQuestionData.type === 'single' ? (
                    <div className="space-y-3">
                      {currentQuestionData.options.map((option, idx) => (
                        <label 
                          key={idx} 
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 hover:bg-primary hover:bg-opacity-5 ${
                            answers[currentQuestionData.id] === idx ? 'bg-primary bg-opacity-10 border-primary' : ''
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${currentSection}-${currentQuestion}`} 
                            checked={answers[currentQuestionData.id] === idx} 
                            onChange={() => handleSingleSelection(currentQuestionData.id, idx)}
                            className="mr-3" 
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentQuestionData.options.map((option, idx) => (
                        <label 
                          key={idx} 
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 hover:bg-primary hover:bg-opacity-5 ${
                            Array.isArray(answers[currentQuestionData.id]) && 
                            (answers[currentQuestionData.id] as number[]).includes(idx) 
                              ? 'bg-primary bg-opacity-10 border-primary' 
                              : ''
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={Array.isArray(answers[currentQuestionData.id]) && 
                              (answers[currentQuestionData.id] as number[]).includes(idx)}
                            onChange={() => handleMultipleSelection(currentQuestionData.id, idx)}
                            className="mr-3" 
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentSection === 0 && currentQuestion === 0}
                    className={`btn ${
                      currentSection === 0 && currentQuestion === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'btn-secondary'
                    }`}
                  >
                    <FontAwesomeIcon icon="arrow-left" className="mr-2" />
                    Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    className="btn btn-primary"
                  >
                    {currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1 ? 
                      'See Results' : 'Next'}
                    {!(currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1) && 
                      <FontAwesomeIcon icon="arrow-right" className="ml-2" />}
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Your responses are confidential and will be used to provide personalized insights.</p>
                <p className="mt-1">This assessment is not a substitute for professional medical advice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add new sleep entry
  const addSleepEntry = (entry: SleepEntry) => {
    setSleepEntries(prev => [entry, ...prev]);
  };

  // Add new mood entry
  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => [entry, ...prev]);
  };

  // Handle sleep entry submission
  const handleSleepEntrySubmit = () => {
    if (newSleepEntry.hoursSlept && newSleepEntry.quality) {
      addSleepEntry({
        date: new Date().toISOString().split('T')[0],
        hoursSlept: newSleepEntry.hoursSlept,
        quality: newSleepEntry.quality,
        notes: newSleepEntry.notes || ''
      });
      setNewSleepEntry({
        hoursSlept: 7,
        quality: 3,
        notes: ''
      });
      setShowSleepJournal(false);
    }
  };

  // Handle mood entry submission
  const handleMoodEntrySubmit = () => {
    if (newMoodEntry.score) {
      addMoodEntry({
        date: new Date().toISOString().split('T')[0],
        score: newMoodEntry.score,
        notes: newMoodEntry.notes || ''
      });
      setNewMoodEntry({
        score: 5,
        notes: ''
      });
      setShowMoodTracker(false);
    }
  };

  // Update sleep journal modal to use state from parent
  const renderSleepJournalModal = () => {
    if (!showSleepJournal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
          <h3 className="text-2xl font-bold text-white mb-4">Sleep Journal Entry</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Hours Slept</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={newSleepEntry.hoursSlept}
                onChange={e => setNewSleepEntry(prev => ({ ...prev, hoursSlept: parseFloat(e.target.value) }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Sleep Quality (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={newSleepEntry.quality}
                onChange={e => setNewSleepEntry(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Notes</label>
              <textarea
                value={newSleepEntry.notes}
                onChange={e => setNewSleepEntry(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-24"
                placeholder="Any additional notes about your sleep..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowSleepJournal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSleepEntrySubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Update mood tracker modal to use state from parent
  const renderMoodTrackerModal = () => {
    if (!showMoodTracker) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
          <h3 className="text-2xl font-bold text-white mb-4">Mood Tracker Entry</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Mood Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newMoodEntry.score}
                onChange={e => setNewMoodEntry(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Notes</label>
              <textarea
                value={newMoodEntry.notes}
                onChange={e => setNewMoodEntry(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-24"
                placeholder="How are you feeling today?"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowMoodTracker(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleMoodEntrySubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-16">
      {showResults ? (
        renderResults()
      ) : (
        <div className="container py-12">
          {/* Render the assessment form */}
          {renderQuestionForm()}
        </div>
      )}
      
      {/* Render modals */}
      {renderSleepJournalModal()}
      {renderMoodTrackerModal()}
    </div>
  );
};

export default AssessmentPage; 