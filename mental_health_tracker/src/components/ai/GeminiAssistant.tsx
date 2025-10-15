import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../context/UserContext';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add FontAwesome icons to library
library.add(fas, fab);

const GeminiAssistant: React.FC = () => {
  const { user } = useContext(UserContext);
  const { metrics } = useContext(HealthMetricsContext);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use an environment variable or a more secure method for the API key
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
  
  // Initial greeting message
  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Hello ${user?.name || 'there'}! I'm your Gemini AI wellness assistant. How can I help with your mental health today?` 
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
      
      // Use hardcoded API key for now but this should be moved to environment variable for production
      const apiKey = 'AIzaSyCZm7CUv8u5UcNemhor7PDLNlIH4DRSMGY';
      
      console.log('Sending request to Gemini API...');
      
      // Call Gemini API with the correct model and simplified payload
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextInfo ? `${contextInfo}\n\n${userMessage}` : userMessage
            }]
          }]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Response Error:', response.status, errorData);
        throw new Error(`API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Gemini API Response:', data);
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback response in case of API error
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I'm having trouble connecting right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key or try again later.` 
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
    <div className="flex flex-col h-full bg-black text-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-3 border-b border-blue-800 bg-gradient-to-r from-black via-gray-900 to-black">
        <h3 className="text-xl font-semibold text-blue-400 flex items-center">
          <FontAwesomeIcon icon="robot" className="text-blue-500 mr-2" />
          Gemini Mental Health Assistant
        </h3>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-4" 
        ref={messagesEndRef}
      >
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-block p-3 mb-2 rounded-full bg-blue-900">
              <FontAwesomeIcon icon="comment-dots" className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-blue-400 mb-1">Welcome to Your Mental Health Assistant</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              I'm here to provide support and guidance for your mental wellbeing. How are you feeling today?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-gray-900 text-white border border-blue-800' 
                      : 'bg-blue-900 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 p-3 rounded-lg bg-gray-900 text-white border border-blue-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-gray-900 border-t border-blue-800">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => document.getElementById('reportUpload')?.click()}
            className="flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg text-sm text-white"
          >
            <FontAwesomeIcon icon="file-upload" className="mr-2" />
            Upload Report
          </button>
          <input
            type="file"
            id="reportUpload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setInput(`I'm uploading a report: ${file.name}. Please analyze this for me.`);
                // In a real app, you would handle the file upload to a server here
                // For now, we'll just simulate by mentioning the file in the input
              }
            }}
          />
          
          <div className="text-xs text-gray-400">
            Supports PDF, DOC, TXT, CSV
          </div>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-black border border-blue-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 rounded-lg"
            disabled={isLoading || !input.trim()}
          >
            <FontAwesomeIcon icon="paper-plane" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant; 