import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../context/UserContext';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';

const AIChatAssistant: React.FC = () => {
  const { user } = useContext(UserContext);
  const { metrics } = useContext(HealthMetricsContext);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const DEEPSEEK_API_KEY = 'sk-c7778cafb3484a5198007eff65e1c44d';
  
  // Initial greeting message
  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Hello ${user?.name || 'there'}! I'm your wellness AI assistant. How are you feeling today?` 
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
      // Prepare context with health metrics if available
      let contextInfo = '';
      if (metrics.heartRate || metrics.stressLevel || metrics.sleepQuality) {
        contextInfo = 'Based on your current health metrics:\n';
        if (metrics.heartRate) contextInfo += `- Heart rate: ${metrics.heartRate} bpm\n`;
        if (metrics.stressLevel) contextInfo += `- Stress level: ${metrics.stressLevel}/100\n`;
        if (metrics.sleepQuality) contextInfo += `- Sleep quality: ${metrics.sleepQuality}%\n`;
      }
      
      // Create conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user's new message
      conversationHistory.push({
        role: 'user',
        content: contextInfo ? `${contextInfo}\n\n${userMessage}` : userMessage
      });
      
      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      // Fallback response in case of API error
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment." 
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <FontAwesomeIcon icon="robot" className="text-indigo-600 mr-2" />
          Mental Wellbeing AI Assistant
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Powered by DeepSeek AI - Your personal mental health companion
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`ml-2 p-3 rounded-full ${
              isLoading || !input.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-primary hover:bg-secondary text-white'
            }`}
          >
            <FontAwesomeIcon icon={isLoading ? 'spinner' : 'paper-plane'} spin={isLoading} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your conversation is private and helps provide personalized mental health insights.
        </p>
      </div>
    </div>
  );
};

export default AIChatAssistant; 