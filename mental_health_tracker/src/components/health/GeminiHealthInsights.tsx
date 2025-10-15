import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../context/UserContext';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our insights data
interface HealthInsight {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
  recommendation: string;
}

interface HealthTrend {
  date: string;
  heartRate: number;
  sleepScore: number;
  stressLevel: number;
  steps: number;
}

const GeminiHealthInsights: React.FC = () => {
  const { user } = useContext(UserContext);
  const { metrics } = useContext(HealthMetricsContext);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [trends, setTrends] = useState<HealthTrend[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  
  const GEMINI_API_KEY = 'AIzaSyCZm7CUv8u5UcNemhor7PDLNlIH4DRSMGY';
  
  // Generate mock insights based on current health metrics
  useEffect(() => {
    if (metrics) {
      const mockInsights: HealthInsight[] = [
        {
          category: 'Heart Rate',
          score: metrics.heartRate || 75,
          status: metrics.heartRate && metrics.heartRate > 90 ? 'fair' : 'good',
          message: 'Your heart rate is generally within a healthy range, but shows occasional elevation.',
          recommendation: 'Consider adding relaxation techniques to your daily routine to help maintain a steady heart rate.'
        },
        {
          category: 'Sleep Quality',
          score: metrics.sleepQuality || 65,
          status: metrics.sleepQuality && metrics.sleepQuality < 50 ? 'poor' : 
                  metrics.sleepQuality && metrics.sleepQuality < 70 ? 'fair' : 'good',
          message: metrics.sleepQuality && metrics.sleepQuality < 50 ? 
                  'Your sleep quality has been below optimal levels recently.' :
                  'Your sleep patterns show moderate consistency with occasional disruptions.',
          recommendation: 'Establish a consistent sleep schedule and reduce screen time before bed.'
        },
        {
          category: 'Stress Level',
          score: metrics.stressLevel || 55,
          status: metrics.stressLevel && metrics.stressLevel > 70 ? 'poor' : 
                 metrics.stressLevel && metrics.stressLevel > 50 ? 'fair' : 'good',
          message: 'Your stress levels fluctuate throughout the week with peaks during workdays.',
          recommendation: 'Try mindfulness meditation or brief breathing exercises during high-stress periods.'
        },
        {
          category: 'Physical Activity',
          score: metrics.steps ? Math.min(100, Math.round((metrics.steps / 10000) * 100)) : 60,
          status: metrics.steps && metrics.steps < 3000 ? 'poor' :
                 metrics.steps && metrics.steps < 7000 ? 'fair' : 'good',
          message: 'Your activity levels are moderate but could benefit from more consistent movement.',
          recommendation: 'Aim for short walking breaks throughout the day to increase your step count.'
        }
      ];
      
      setInsights(mockInsights);
      
      // Generate mock trend data
      const today = new Date();
      const mockTrends: HealthTrend[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - 6 + i);
        
        // Generate data with slight variations based on current metrics
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          heartRate: (metrics.heartRate || 75) + Math.floor(Math.random() * 10) - 5,
          sleepScore: (metrics.sleepQuality || 65) + Math.floor(Math.random() * 10) - 5,
          stressLevel: (metrics.stressLevel || 55) + Math.floor(Math.random() * 10) - 5,
          steps: metrics.steps ? metrics.steps + Math.floor(Math.random() * 2000) - 1000 : 6000 + Math.floor(Math.random() * 2000)
        };
      });
      
      setTrends(mockTrends);
    }
  }, [metrics]);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Hello ${user?.name || 'there'}! I'm your Gemini AI health insights assistant. Here's my analysis of your recent health metrics.` 
      }
    ]);
  }, [user?.name]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Prepare context with health metrics
      let contextInfo = 'Based on your current health metrics:\n';
      if (metrics.heartRate) contextInfo += `- Heart rate: ${metrics.heartRate} bpm\n`;
      if (metrics.stressLevel) contextInfo += `- Stress level: ${metrics.stressLevel}/100\n`;
      if (metrics.sleepQuality) contextInfo += `- Sleep quality: ${metrics.sleepQuality}%\n`;
      if (metrics.steps) contextInfo += `- Daily steps: ${metrics.steps}\n`;
      if (metrics.activity) contextInfo += `- Activity level: ${metrics.activity}\n`;
      if (metrics.spO2) contextInfo += `- Blood oxygen: ${metrics.spO2}%\n`;
      if (metrics.temperature) contextInfo += `- Body temperature: ${metrics.temperature}°C\n`;
      
      // Create conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      // Add user's new message with context
      conversationHistory.push({
        role: 'user',
        parts: [{ text: `${contextInfo}\n\n${userMessage}` }]
      });
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback response in case of API error
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble analyzing your health data right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Prepare data for wellness trend chart
  const wellnessTrendChart = {
    labels: trends.map(trend => trend.date),
    datasets: [
      {
        label: 'Heart Rate',
        data: trends.map(trend => trend.heartRate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Sleep Score',
        data: trends.map(trend => trend.sleepScore),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y1',
      },
      {
        label: 'Stress Level',
        data: trends.map(trend => trend.stressLevel),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y1',
      }
    ]
  };
  
  const wellnessTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Wellness Trends',
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Heart Rate (bpm)',
        },
        min: 50,
        max: 100,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Score (0-100)',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Prepare data for wellness balance chart
  const wellnessBalanceData = {
    labels: ['Physical', 'Mental', 'Sleep', 'Nutrition'],
    datasets: [
      {
        label: 'Your Wellness Balance',
        data: [
          metrics.steps ? Math.min(100, Math.round((metrics.steps / 10000) * 100)) : 65,
          metrics.stressLevel ? 100 - metrics.stressLevel : 70,
          metrics.sleepQuality || 65,
          75 // Mock nutrition score
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Optimal Balance',
        data: [80, 80, 80, 80],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderDash: [5, 5],
      }
    ]
  };
  
  const wellnessBalanceOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          callback: function(tickValue: string | number) {
            return tickValue.toString();
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Your Wellness Balance',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <FontAwesomeIcon icon="brain" className="text-white mr-2" />
          Gemini AI Health Insights
        </h3>
        <p className="text-sm text-white mt-1 opacity-90 font-light">
          AI-powered analysis of your health metrics and personalized wellness recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Insights Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <div 
                key={`insight-card-${index}-${chartInstanceId.current}`}
                className={`p-4 rounded-xl border shadow-sm ${
                  insight.status === 'excellent' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
                  insight.status === 'good' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                  insight.status === 'fair' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
                  'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                }`}
              >
                <h4 className="font-medium text-gray-800 mb-1">{insight.category}</h4>
                <div className={`text-2xl font-bold ${
                  insight.status === 'excellent' ? 'text-green-600' :
                  insight.status === 'good' ? 'text-blue-600' :
                  insight.status === 'fair' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {insight.score}
                  {insight.category === 'Heart Rate' ? ' bpm' : 
                   insight.category === 'Physical Activity' ? '%' : ''}
                </div>
                <div className={`text-xs font-medium ${
                  insight.status === 'excellent' ? 'text-green-700' :
                  insight.status === 'good' ? 'text-blue-700' :
                  insight.status === 'fair' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {insight.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Wellness Trend Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="h-72">
              <Line 
                data={wellnessTrendChart} 
                options={wellnessTrendOptions}
                key={`wellness-trend-${chartInstanceId.current}`}
                ref={(el) => chartRefs.current.wellnessTrend = el}
              />
            </div>
          </div>
          
          {/* Wellness Balance Radar Chart and Steps Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="h-64">
                <Doughnut 
                  data={wellnessBalanceData} 
                  options={wellnessBalanceOptions}
                  key={`wellness-balance-${chartInstanceId.current}`}
                  ref={(el) => chartRefs.current.wellnessBalance = el}
                />
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Daily Steps Progress</h4>
              <div className="flex items-center justify-center h-32" id={`steps-progress-${chartInstanceId.current}`}>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="10" 
                    />
                    {/* Progress circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#blue-gradient-${chartInstanceId.current})" 
                      strokeWidth="10" 
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * (1 - (metrics.steps ? Math.min(1, metrics.steps / 10000) : 0.6))}
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id={`blue-gradient-${chartInstanceId.current}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{metrics.steps ? metrics.steps.toLocaleString() : '6,000'}</span>
                    <span className="text-sm text-gray-500">of 10,000 steps</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>0</span>
                  <span>Goal: 10,000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                    style={{ width: `${metrics.steps ? Math.min(100, (metrics.steps / 10000) * 100) : 60}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - AI Chat */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col h-[600px] shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h4 className="font-medium text-white">
                AI Health Assistant
              </h4>
              <p className="text-xs text-white opacity-80">
                Ask questions about your health metrics
              </p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl p-3 shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your health metrics..."
                  className="flex-grow border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                  rows={2}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className={`ml-2 p-2 rounded-full ${
                    isLoading || !input.trim() 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all'
                  }`}
                >
                  <FontAwesomeIcon icon={isLoading ? 'spinner' : 'paper-plane'} spin={isLoading} size="sm" />
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Health Insights */}
          <div className="mt-6 space-y-4">
            {insights.map((insight, index) => (
              <div key={`insight-card-${index}-${chartInstanceId.current}`} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <FontAwesomeIcon 
                    icon={
                      insight.category === 'Heart Rate' ? 'heartbeat' :
                      insight.category === 'Sleep Quality' ? 'bed' :
                      insight.category === 'Stress Level' ? 'brain' :
                      'walking'
                    } 
                    className={`mr-2 ${
                      insight.status === 'excellent' ? 'text-green-500' :
                      insight.status === 'good' ? 'text-blue-500' :
                      insight.status === 'fair' ? 'text-yellow-500' :
                      'text-red-500'
                    }`} 
                  />
                  {insight.category} Insight
                </h4>
                <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                <p className="text-sm text-indigo-600 font-medium">
                  <FontAwesomeIcon icon="lightbulb" className="mr-1" />
                  {insight.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiHealthInsights; 