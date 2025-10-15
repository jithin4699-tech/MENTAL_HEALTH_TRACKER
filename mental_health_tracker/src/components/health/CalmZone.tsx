import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CalmZoneProps {
  heartRate: number | null;
}

const CalmZone: React.FC<CalmZoneProps> = ({ heartRate }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon="wind" className="text-blue-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-blue-800">
            🧘 Calm Zone
          </h3>
          <p className="text-blue-600 text-sm">
            Your heart rate is {heartRate} bpm, which is elevated
          </p>
        </div>
      </div>
      
      <p className="text-blue-800 mb-4">
        Take a moment to breathe and center yourself. Try this simple breathing exercise to help lower your heart rate.
      </p>
      
      <div className="bg-white rounded-md p-4 mb-4 border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-2">4-7-8 Breathing Technique</h4>
        <ol className="space-y-2 text-blue-800">
          <li>Inhale quietly through your nose for 4 seconds</li>
          <li>Hold your breath for 7 seconds</li>
          <li>Exhale completely through your mouth for 8 seconds</li>
          <li>Repeat this cycle 3-4 times</li>
        </ol>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="play-circle" className="mr-2" />
          Guided Meditation
        </button>
        <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-md transition-colors">
          <FontAwesomeIcon icon="music" className="mr-2" />
          Calming Sounds
        </button>
      </div>
    </div>
  );
};

export default CalmZone; 