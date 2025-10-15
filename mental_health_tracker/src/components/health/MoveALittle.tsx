import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface MoveALittleProps {
  steps: number | null;
}

const MoveALittle: React.FC<MoveALittleProps> = ({ steps }) => {
  return (
    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon="walking" className="text-green-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-green-800">
            🚶‍♀️ Move A Little
          </h3>
          <p className="text-green-600 text-sm">
            You've taken {steps} steps today, which is below the recommended amount
          </p>
        </div>
      </div>
      
      <p className="text-green-800 mb-4">
        Even small amounts of movement can boost your mood and energy levels. Try to take short movement breaks throughout your day.
      </p>
      
      <div className="bg-white rounded-md p-4 mb-4 border border-green-100">
        <h4 className="font-medium text-green-900 mb-2">Quick Movement Ideas</h4>
        <ul className="space-y-2 text-green-800">
          <li className="flex items-start">
            <FontAwesomeIcon icon="door-open" className="text-green-500 mr-2 mt-1" />
            <span>Take a 5-minute walk outside for fresh air</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="dumbbell" className="text-green-500 mr-2 mt-1" />
            <span>Do a quick set of stretches or desk exercises</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="phone" className="text-green-500 mr-2 mt-1" />
            <span>Take walking meetings or phone calls</span>
          </li>
          <li className="flex items-start">
            <FontAwesomeIcon icon="stairs" className="text-green-500 mr-2 mt-1" />
            <span>Use the stairs instead of the elevator</span>
          </li>
        </ul>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="play-circle" className="mr-2" />
          Quick Stretch Routine
        </button>
        <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="bell" className="mr-2" />
          Set Move Reminder
        </button>
      </div>
    </div>
  );
};

export default MoveALittle; 