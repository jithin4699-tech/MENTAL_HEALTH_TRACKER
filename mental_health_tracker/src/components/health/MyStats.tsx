import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';

const MyStats: React.FC = () => {
  const { metrics, device } = useContext(HealthMetricsContext);
  
  // Format the last updated timestamp
  const formatLastUpdated = () => {
    if (!metrics.lastUpdated) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - metrics.lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return metrics.lastUpdated.toLocaleString();
  };

  // Helper function to determine the appropriate background color class based on metric value
  const getHeartRateColorClass = (heartRate: number | null) => {
    if (heartRate === null) return 'bg-gray-200';
    if (heartRate < 60) return 'bg-blue-500'; // Low
    if (heartRate <= 100) return 'bg-green-500'; // Normal
    return 'bg-red-500'; // High
  };

  const getSleepQualityColorClass = (quality: number | null) => {
    if (quality === null) return 'bg-gray-200';
    if (quality < 40) return 'bg-red-500'; // Poor
    if (quality < 70) return 'bg-yellow-500'; // Fair
    return 'bg-green-500'; // Good
  };

  const getStressLevelColorClass = (stress: number | null) => {
    if (stress === null) return 'bg-gray-200';
    if (stress < 30) return 'bg-green-500'; // Low stress
    if (stress < 70) return 'bg-yellow-500'; // Moderate stress
    return 'bg-red-500'; // High stress
  };

  const getSpO2ColorClass = (spO2: number | null) => {
    if (spO2 === null) return 'bg-gray-200';
    if (spO2 < 95) return 'bg-yellow-500'; // Below optimal
    return 'bg-green-500'; // Normal
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">
          📈 My Stats
        </h3>
        {device?.connected && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <FontAwesomeIcon icon="bluetooth" className="text-blue-500 mr-1" />
            <span>Connected to {device.name}</span>
            <span className="mx-2">•</span>
            <span>Last updated: {formatLastUpdated()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5">
        {/* Heart Rate Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="heartbeat" className="text-red-500 mr-2" />
            <span className="text-gray-700 font-medium">Heart Rate</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.heartRate ?? '--'}</span>
            <span className="ml-1 text-gray-500 mb-1">bpm</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getHeartRateColorClass(metrics.heartRate)}`} 
              style={{ width: metrics.heartRate ? `${Math.min(100, metrics.heartRate)}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Sleep Quality Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="bed" className="text-indigo-500 mr-2" />
            <span className="text-gray-700 font-medium">Sleep Quality</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.sleepQuality ?? '--'}</span>
            <span className="ml-1 text-gray-500 mb-1">%</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getSleepQualityColorClass(metrics.sleepQuality)}`} 
              style={{ width: metrics.sleepQuality ? `${metrics.sleepQuality}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Steps Count Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="walking" className="text-green-500 mr-2" />
            <span className="text-gray-700 font-medium">Steps</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.steps?.toLocaleString() ?? '--'}</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: metrics.steps ? `${Math.min(100, (metrics.steps / 10000) * 100)}%` : '0%' }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Goal: 10,000</div>
        </div>

        {/* Stress Level Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="brain" className="text-orange-500 mr-2" />
            <span className="text-gray-700 font-medium">Stress Level</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.stressLevel ?? '--'}</span>
            <span className="ml-1 text-gray-500 mb-1">/100</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getStressLevelColorClass(metrics.stressLevel)}`} 
              style={{ width: metrics.stressLevel ? `${metrics.stressLevel}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* SpO2 Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="lungs" className="text-blue-500 mr-2" />
            <span className="text-gray-700 font-medium">Blood Oxygen</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.spO2 ?? '--'}</span>
            <span className="ml-1 text-gray-500 mb-1">%</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getSpO2ColorClass(metrics.spO2)}`} 
              style={{ width: metrics.spO2 ? `${Math.min(100, (metrics.spO2 - 90) * 10)}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Temperature Metric */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon="thermometer-half" className="text-red-500 mr-2" />
            <span className="text-gray-700 font-medium">Temperature</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-900">{metrics.temperature ?? '--'}</span>
            <span className="ml-1 text-gray-500 mb-1">°C</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500" 
              style={{ 
                width: metrics.temperature 
                  ? `${Math.min(100, Math.max(0, ((metrics.temperature - 36) / 2) * 100))}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
        <button 
          className="text-primary hover:text-secondary transition-colors"
          onClick={() => document.getElementById('health-report')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <FontAwesomeIcon icon="chart-line" className="mr-1" />
          View Detailed Health Trends
        </button>
      </div>
    </div>
  );
};

export default MyStats; 