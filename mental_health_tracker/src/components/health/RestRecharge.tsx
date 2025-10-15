import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RestRechargeProps {
  sleepQuality: number | null;
}

const RestRecharge: React.FC<RestRechargeProps> = ({ sleepQuality }) => {
  return (
    <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon="bed" className="text-indigo-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-indigo-800">
            🛌 Rest & Recharge
          </h3>
          <p className="text-indigo-600 text-sm">
            Your sleep quality is {sleepQuality}%, which is below optimal
          </p>
        </div>
      </div>
      
      <p className="text-indigo-800 mb-4">
        Proper rest is essential for mental wellbeing. Here are some suggestions to improve your sleep quality.
      </p>
      
      <div className="bg-white rounded-md p-4 mb-4 border border-indigo-100">
        <h4 className="font-medium text-indigo-900 mb-2">Sleep Improvement Tips</h4>
        <ul className="space-y-2 text-indigo-800">
          <li className="flex items-start">
            <FontAwesomeIcon icon="moon" className="text-indigo-500 mr-2 mt-1" />
            <span>Maintain a consistent sleep schedule, even on weekends</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="mobile-alt" className="text-indigo-500 mr-2 mt-1" />
            <span>Avoid screens at least 1 hour before bedtime</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="coffee" className="text-indigo-500 mr-2 mt-1" />
            <span>Limit caffeine intake after 2pm</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="temperature-low" className="text-indigo-500 mr-2 mt-1" />
            <span>Keep your bedroom cool (65-68°F/18-20°C)</span>
          </li>
        </ul>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="play-circle" className="mr-2" />
          Sleep Meditation
        </button>
        <button className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="book" className="mr-2" />
          Sleep Journal
        </button>
      </div>
    </div>
  );
};

export default RestRecharge; 