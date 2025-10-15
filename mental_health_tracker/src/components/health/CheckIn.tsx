import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CheckInProps {
  stressLevel: number | null;
}

const CheckIn: React.FC<CheckInProps> = ({ stressLevel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    "How are you feeling emotionally right now?",
    "What is the primary source of your stress today?",
    "What's one small thing you could do right now to help yourself feel better?"
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
  };

  return (
    <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon="heart" className="text-orange-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-orange-800">
            ❤️ Check-In
          </h3>
          <p className="text-orange-600 text-sm">
            Your stress level is {stressLevel}%, which is elevated
          </p>
        </div>
      </div>
      
      {!isComplete ? (
        <div className="space-y-4">
          <p className="text-orange-800 mb-4">
            Taking a moment to check in with yourself can help manage stress. Answer a few quick questions:
          </p>
          
          <div className="bg-white rounded-md p-4 border border-orange-100">
            <h4 className="font-medium text-orange-900 mb-3">
              {questions[currentQuestion]}
            </h4>
            
            {currentQuestion === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAnswer("Overwhelmed")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Overwhelmed
                </button>
                <button 
                  onClick={() => handleAnswer("Anxious")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Anxious
                </button>
                <button 
                  onClick={() => handleAnswer("Frustrated")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Frustrated
                </button>
                <button 
                  onClick={() => handleAnswer("Tired")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Tired
                </button>
              </div>
            )}
            
            {currentQuestion === 1 && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAnswer("Work/School")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Work/School
                </button>
                <button 
                  onClick={() => handleAnswer("Relationships")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Relationships
                </button>
                <button 
                  onClick={() => handleAnswer("Health")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Health
                </button>
                <button 
                  onClick={() => handleAnswer("Finances")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Finances
                </button>
              </div>
            )}
            
            {currentQuestion === 2 && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAnswer("Take a break")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Take a break
                </button>
                <button 
                  onClick={() => handleAnswer("Deep breathing")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Deep breathing
                </button>
                <button 
                  onClick={() => handleAnswer("Talk to someone")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Talk to someone
                </button>
                <button 
                  onClick={() => handleAnswer("Go for a walk")}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
                >
                  Go for a walk
                </button>
              </div>
            )}
          </div>
          
          <div className="text-xs text-orange-700 text-center">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-md p-4 border border-orange-100">
            <h4 className="font-medium text-orange-900 mb-3">
              Thanks for checking in!
            </h4>
            <p className="text-orange-800 mb-4">
              Based on your responses, here are some personalized suggestions:
            </p>
            
            <div className="space-y-3">
              {answers[0] === "Overwhelmed" && answers[1] === "Work/School" && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon="tasks" className="text-orange-500 mr-2 mt-1" />
                  <span>Try breaking your tasks into smaller, manageable chunks.</span>
                </div>
              )}
              
              {answers[0] === "Anxious" && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon="cloud" className="text-orange-500 mr-2 mt-1" />
                  <span>Practice mindfulness or meditation for 5 minutes.</span>
                </div>
              )}
              
              {answers[1] === "Relationships" && (
                <div className="flex items-start">
                  <FontAwesomeIcon icon="comment" className="text-orange-500 mr-2 mt-1" />
                  <span>Consider scheduling time for an honest conversation about your feelings.</span>
                </div>
              )}
              
              <div className="flex items-start">
                <FontAwesomeIcon icon="lightbulb" className="text-orange-500 mr-2 mt-1" />
                <span>Your suggestion to "{answers[2]}" is a great place to start.</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleReset}
              className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-4 rounded-md transition-colors"
            >
              <FontAwesomeIcon icon="redo" className="mr-2" />
              Check In Again
            </button>
            <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors">
              <FontAwesomeIcon icon="journal-whills" className="mr-2" />
              Journal About It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn; 