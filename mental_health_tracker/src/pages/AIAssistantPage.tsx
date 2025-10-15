import React from 'react';
import AIChatAssistant from '../components/ai/AIChatAssistant';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="py-16 bg-lightBg min-h-screen">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Mental Health Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chat with our AI assistant to get personalized mental health insights, coping strategies, and emotional support.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AIChatAssistant />
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Assistant</h2>
            <p className="text-gray-600 mb-4">
              This AI assistant is powered by DeepSeek's advanced language model, designed specifically to provide mental health support and guidance.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">How It Works</h3>
              <ul className="text-blue-700 space-y-2 ml-5 list-disc">
                <li>Chat naturally about your thoughts, feelings, and challenges</li>
                <li>Receive personalized responses based on your health metrics</li>
                <li>Get evidence-based coping strategies and mental wellness tips</li>
                <li>All conversations are private and secure</li>
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

export default AIAssistantPage; 