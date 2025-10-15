import React from 'react';
import GeminiAssistant from '../components/ai/GeminiAssistant';

const GeminiAssistantPage: React.FC = () => {
  return (
    <div className="py-16 bg-lightBg min-h-screen">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Gemini AI Mental Health Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chat with our Google Gemini-powered AI assistant for personalized mental health support and wellness guidance with visual analytics.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <GeminiAssistant />
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Gemini Assistant</h2>
            <p className="text-gray-600 mb-4">
              This AI assistant is powered by Google's Gemini Pro language model, designed specifically to provide mental health support and guidance in a conversational way. The companion insights chart analyzes your conversations for patterns and trends.
            </p>
            
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h3 className="font-medium text-teal-800 mb-2">Features</h3>
              <ul className="text-teal-700 space-y-2 ml-5 list-disc">
                <li>Intelligent conversations about mental health and wellness</li>
                <li>Personalized recommendations based on your health metrics</li>
                <li>Visual analytics of conversation sentiment and topics</li>
                <li>Evidence-based mental health strategies and coping techniques</li>
                <li>Private and secure interactions</li>
              </ul>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 italic">
              Note: This AI assistant is not a replacement for professional medical advice. If you're experiencing a mental health crisis, please contact your healthcare provider or a crisis hotline immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistantPage; 