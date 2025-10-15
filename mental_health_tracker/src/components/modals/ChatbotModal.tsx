import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health assistant. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response (would be an API call in a real app)
    setTimeout(() => {
      const botResponse = generateResponse(inputText);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response generator - would be replaced with actual AI API
  const generateResponse = (input: string): string => {
    const inputLower = input.toLowerCase();
    
    // Check for emotional keywords
    if (inputLower.includes('sad') || inputLower.includes('depressed') || inputLower.includes('unhappy')) {
      return "I'm sorry to hear you're feeling down. Remember that it's okay to feel this way sometimes. Would you like to explore some mood-lifting activities or talk more about what's causing these feelings?";
    }
    
    if (inputLower.includes('anxious') || inputLower.includes('worried') || inputLower.includes('stress')) {
      return "Anxiety can be challenging to deal with. Have you tried any breathing exercises? Taking slow, deep breaths for a few minutes can help reduce anxiety in the moment. Would you like me to guide you through a quick breathing exercise?";
    }
    
    if (inputLower.includes('happy') || inputLower.includes('good') || inputLower.includes('great')) {
      return "I'm glad to hear you're feeling positive! It's important to acknowledge and celebrate these moments. What's contributing to your good mood today?";
    }
    
    if (inputLower.includes('tired') || inputLower.includes('exhausted') || inputLower.includes('sleep')) {
      return "Rest is so important for mental health. Are you getting enough quality sleep? We could discuss some strategies for improving your sleep routine if you'd like.";
    }
    
    if (inputLower.includes('help') || inputLower.includes('advice') || inputLower.includes('need support')) {
      return "I'm here to support you. Could you tell me more specifically what you're looking for help with? I can offer resources, exercises, or just be here to listen.";
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for sharing that with me. Could you tell me a bit more about how that's affecting you?",
      "I appreciate you opening up. How long have you been feeling this way?",
      "I understand. What strategies have you tried so far to cope with this situation?",
      "That's important to talk about. How has this been impacting your daily life?",
      "I'm here to support you. Would it help to explore some resources or techniques related to what you're experiencing?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-800 w-full max-w-2xl h-[600px] max-h-[90vh] flex flex-col rounded-xl overflow-hidden relative shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary bg-opacity-20 rounded-full -mr-16 -mt-16 z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary bg-opacity-20 rounded-full -ml-12 -mb-12 z-0"></div>
        
        {/* Header */}
        <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
            <FontAwesomeIcon icon={faRobot} className="text-white" />
          </div>
          <h3 className="font-semibold text-xl">Elite Coders AI Assistant</h3>
          <button 
            onClick={onClose} 
            className="ml-auto text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 relative z-10 bg-gray-900">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white text-opacity-80' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        
        {/* Input Form */}
        <form 
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-800 bg-gray-800 relative z-10"
        >
          <div className="flex">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-r-full hover:bg-secondary transition-colors"
              disabled={!inputText.trim()}
            >
              <FontAwesomeIcon icon="paper-plane" />
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            This is an AI assistant and not a substitute for professional mental health care.
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotModal; 