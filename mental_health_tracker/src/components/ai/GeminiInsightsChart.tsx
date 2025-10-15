import React, { useEffect, useState, useRef } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define types for our insights data
interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface TopicDistribution {
  anxiety: number;
  depression: number;
  stress: number;
  sleep: number;
  wellness: number;
  other: number;
}

interface ConversationInsights {
  overallScore: number;
  moodTrend: number[];
  topicDistribution: Array<{topic: string, percentage: number}>;
  sentimentData: SentimentData;
  suggestedResources: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  sleepQuality: number[];
  anxietyLevels: number[];
  mostDiscussedTopics: string[];
}

interface Insights {
  overallScore: number;
  moodTrend: number[];
  topicDistribution: Array<{topic: string, percentage: number}>;
  sentimentData: {
    positive: number;
    neutral: number;
    negative: number;
  };
  suggestedResources: Array<{
    title: string;
    description: string;
    link: string;
  }>;
  sleepQuality: number[];
  anxietyLevels: number[];
}

const GeminiInsightsChart: React.FC<{ 
  conversations: Array<{ role: 'user' | 'assistant', content: string }>,
  apiKey: string 
}> = ({ conversations, apiKey }) => {
  const [insights, setInsights] = useState<ConversationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add refs for chart instances
  const chartRefs = useRef<{ [key: string]: any }>({});
  const chartInstanceId = useRef<string>(Math.random().toString(36).substring(2, 9));
  
  // Add cleanup effect for chart instances
  useEffect(() => {
    return () => {
      // Destroy chart instances when component unmounts
      Object.values(chartRefs.current).forEach((chart: any) => {
        if (chart && chart.chartInstance) {
          chart.chartInstance.destroy();
        }
      });
    };
  }, []);

  // Mock function to analyze conversations - in a real app, this would call an AI API
  const analyzeConversations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would call the Gemini API here
      // For demo purposes, we'll generate mock data instead
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock insights data
      const mockInsights: ConversationInsights = {
        overallScore: 7.2,
        moodTrend: [6.5, 7.0, 5.8, 6.2, 7.5, 7.8, 7.2],
        topicDistribution: [
          { topic: 'Anxiety', percentage: 35 },
          { topic: 'Work Stress', percentage: 25 },
          { topic: 'Relationships', percentage: 20 },
          { topic: 'Sleep', percentage: 15 },
          { topic: 'Exercise', percentage: 5 }
        ],
        sentimentData: {
          positive: 0.6,
          neutral: 0.3,
          negative: 0.1
        },
        sleepQuality: [65, 70, 60, 75, 80, 85, 75],
        anxietyLevels: [45, 40, 60, 55, 35, 30, 35],
        mostDiscussedTopics: [
          "Stress management",
          "Sleep quality",
          "Anxiety coping strategies"
        ],
        suggestedResources: [
          {
            title: "Managing Workplace Anxiety",
            description: "Techniques for reducing anxiety in professional settings",
            link: "/resources/workplace-anxiety"
          },
          {
            title: "Sleep Improvement Guide",
            description: "Science-backed methods to improve sleep quality",
            link: "/resources/sleep-improvement"
          },
          {
            title: "Mindfulness Meditation Basics",
            description: "Introduction to mindfulness practices for stress reduction",
            link: "/resources/mindfulness"
          }
        ]
      };
      
      setInsights(mockInsights);
    } catch (err) {
      console.error("Error analyzing conversations:", err);
      setError("Failed to analyze conversations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze conversations when they change
  useEffect(() => {
    if (conversations.length > 2) { // Only analyze if we have enough conversation data
      analyzeConversations();
    }
  }, [conversations]);

  // Prepare data for sentiment chart
  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Conversation Sentiment',
        data: [
          insights?.sentimentData?.positive || 0,
          insights?.sentimentData?.neutral || 0, 
          insights?.sentimentData?.negative || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(30, 58, 138, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(30, 58, 138, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const sentimentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: '"Inter", sans-serif'
          },
          color: '#1e293b'
        }
      },
      title: {
        display: true,
        text: 'Sentiment Analysis',
        color: '#1e293b',
        font: {
          size: 16,
          family: '"Inter", sans-serif',
          weight: 600
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#475569'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#475569'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  };

  // Prepare data for topic distribution chart
  const topicChartData = {
    labels: insights?.topicDistribution?.map(t => t.topic) || [],
    datasets: [
      {
        label: 'Topic Distribution',
        data: insights?.topicDistribution?.map(t => t.percentage) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(29, 78, 216, 0.7)',
          'rgba(30, 64, 175, 0.7)',
          'rgba(17, 24, 39, 0.7)',
          'rgba(79, 70, 229, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(29, 78, 216, 1)',
          'rgba(30, 64, 175, 1)',
          'rgba(17, 24, 39, 1)',
          'rgba(79, 70, 229, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const topicChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: '"Inter", sans-serif'
          },
          color: '#1e293b'
        }
      },
      title: {
        display: true,
        text: 'Topic Distribution',
        color: '#1e293b',
        font: {
          size: 16,
          family: '"Inter", sans-serif',
          weight: 600
        }
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          callback: function(tickValue: string | number) {
            return tickValue.toString();
          }
        }
      }
    }
  };

  // Prepare data for mood trend line chart
  const moodTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood',
        data: insights?.moodTrend || [],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const moodTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: '"Inter", sans-serif'
          },
          color: '#1e293b'
        }
      },
      title: {
        display: true,
        text: 'Mood Trend',
        color: '#1e293b',
        font: {
          size: 16,
          family: '"Inter", sans-serif',
          weight: 600
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 10,
        ticks: {
          color: '#475569',
          stepSize: 1,
          callback: function(tickValue: string | number) {
            return tickValue.toString();
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#475569'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  };
  
  // Prepare data for sleep vs anxiety comparison chart
  const healthMetricsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Quality',
        data: insights?.sleepQuality || [],
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Anxiety Level',
        data: insights?.anxietyLevels || [],
        borderColor: 'rgba(244, 114, 182, 1)',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(244, 114, 182, 1)',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.4,
        yAxisID: 'y'
      }
    ]
  };
  
  const healthMetricsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      title: {
        display: true,
        text: 'Sleep Quality vs. Anxiety Levels',
        font: {
          size: 16
        },
        color: '#1e40af',
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(226, 232, 240, 0.2)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // If we have no conversations yet
  if (conversations.length <= 2) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-xl border border-blue-800 text-center">
        <div className="text-blue-400 mb-4">
          <FontAwesomeIcon icon="chart-pie" className="text-4xl" />
        </div>
        <h3 className="text-lg font-medium text-blue-400 mb-2">AI Insights</h3>
        <p className="text-blue-300">
          Continue your conversation with Gemini to generate personalized mental health insights.
        </p>
        <button 
          onClick={() => navigate('/chat')} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start a Conversation
        </button>
      </div>
    );
  }

  // If we're loading
  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-xl border border-blue-800 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-medium text-blue-400 mb-2">Analyzing Conversation</h3>
        <p className="text-blue-300">
          Gemini is analyzing your conversation to generate personalized insights...
        </p>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg shadow-xl border border-red-700 text-center">
        <div className="text-red-500 mb-4">
          <FontAwesomeIcon icon="exclamation-circle" className="text-4xl" />
        </div>
        <h3 className="text-lg font-medium text-red-400 mb-2">Analysis Error</h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  // If we have insights to display
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-100 shadow-sm">
      {!conversations || conversations.length === 0 ? (
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <FontAwesomeIcon icon="chart-line" className="text-blue-600 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Conversations Yet</h3>
          <p className="text-gray-600 mb-4">Start conversations to generate insights</p>
          <button 
            onClick={() => navigate('/chat')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start a Conversation
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-16 h-16 mb-4 flex items-center justify-center">
            <FontAwesomeIcon icon="spinner" spin size="2x" className="text-blue-600" />
          </div>
          <p className="text-blue-700 font-medium">Analyzing your conversations...</p>
          <p className="text-sm text-blue-600 mt-2">This may take a moment</p>
        </div>
      ) : (
        <>
          <div className="p-5 border-b border-blue-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900">
            <h3 className="text-xl font-semibold text-blue-300 flex items-center">
              <FontAwesomeIcon icon="chart-pie" className="text-blue-400 mr-2" />
              Gemini AI Insights
            </h3>
            <p className="text-sm text-blue-400 mt-1 opacity-90 font-light">
              Your personalized mental wellness analysis
            </p>
          </div>
          
          <div className="p-5">
            {/* Weekly Mood Score */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm">
                <h4 className="text-lg font-medium text-blue-400 mb-3">Weekly Mood Score</h4>
                <div className="inline-flex items-center justify-center">
                  <div className={`text-5xl font-bold ${
                    insights && insights.overallScore >= 7 
                      ? 'text-blue-400' 
                      : insights && insights.overallScore >= 5 
                        ? 'text-amber-400' 
                        : 'text-red-400'
                  }`}>
                    {insights?.overallScore.toFixed(1)}
                  </div>
                  <div className="text-blue-500 ml-2 text-lg">/10</div>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  {insights && insights.overallScore >= 7 
                    ? 'Excellent progress this week!' 
                    : insights && insights.overallScore >= 5 
                      ? 'Steady improvement' 
                      : 'Focus on self-care'}
                </div>
              </div>
              
              {/* Mood Trend Chart */}
              <div className="col-span-2 bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm h-48">
                <Line 
                  data={moodTrendData} 
                  options={moodTrendOptions}
                  key={`mood-trend-${chartInstanceId.current}`}
                  ref={(el) => chartRefs.current.moodTrend = el}
                />
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm h-64">
                <Bar 
                  data={sentimentChartData} 
                  options={sentimentChartOptions}
                  key={`sentiment-chart-${chartInstanceId.current}`}
                  ref={(el) => chartRefs.current.sentimentChart = el}
                />
              </div>
              <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm h-64">
                <Doughnut 
                  data={topicChartData} 
                  options={topicChartOptions}
                  key={`topic-chart-${chartInstanceId.current}`}
                  ref={(el) => chartRefs.current.topicChart = el}
                />
              </div>
            </div>
            
            {/* Sleep vs Anxiety Chart */}
            <div className="mb-6 bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm h-64">
              <Line 
                data={healthMetricsData} 
                options={healthMetricsOptions}
                key={`health-metrics-${chartInstanceId.current}`}
                ref={(el) => chartRefs.current.healthMetrics = el}
              />
            </div>
            
            {/* Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Discussed Topics */}
              <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm">
                <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                  <FontAwesomeIcon icon="comments" className="text-blue-500 mr-2" />
                  Most Discussed Topics
                </h4>
                <ul className="space-y-2">
                  {insights?.mostDiscussedTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <span className="h-4 w-4 mr-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Suggested Resources */}
              <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 shadow-sm">
                <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                  <FontAwesomeIcon icon="book-open" className="text-blue-500 mr-2" />
                  Suggested Resources
                </h4>
                <ul className="space-y-2">
                  {insights?.suggestedResources.map((resource, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <span className="h-4 w-4 mr-2 mt-0.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <div>
                        <p className="font-medium text-blue-300">{resource.title}</p>
                        <p className="text-xs text-gray-400">{resource.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GeminiInsightsChart; 