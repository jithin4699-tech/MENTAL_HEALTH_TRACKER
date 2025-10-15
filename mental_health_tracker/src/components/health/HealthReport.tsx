import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';

// For simple charting without dependencies
const SimpleLineChart: React.FC<{
  data: number[];
  height: number;
  color: string;
  label?: string;
  max?: number;
  showDots?: boolean;
}> = ({ data, height, color, label, max = 100, showDots = true }) => {
  if (!data.length) return null;
  
  const calculatePoints = () => {
    const width = 100; // percentage width
    const step = width / (data.length - 1);
    
    return data.map((value, index) => {
      const x = index * step;
      const y = 100 - (value / max * 100);
      return `${x},${y}`;
    }).join(' ');
  };
  
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
        <polyline
          points={calculatePoints()}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showDots && data.map((value, index) => {
          const x = index * (100 / (data.length - 1));
          const y = 100 - (value / max * 100);
          return (
            <circle 
              key={index} 
              cx={x} 
              cy={y} 
              r="2" 
              fill="white" 
              stroke={color} 
              strokeWidth="1.5" 
            />
          );
        })}
      </svg>
    </div>
  );
};

// Simple gauge chart
const GaugeChart: React.FC<{
  value: number;
  min: number;
  max: number;
  thresholds: { value: number; color: string }[];
  label: string;
  size?: number;
}> = ({ value, min, max, thresholds, label, size = 120 }) => {
  // Calculate angle (0-180 degrees)
  const angle = (value - min) / (max - min) * 180;
  
  // Find the right color based on thresholds
  const getColor = () => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i].value) {
        return thresholds[i].color;
      }
    }
    return thresholds[0].color;
  };
  
  const color = getColor();
  
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: `${size}px` }}>
      <div className="relative">
        <svg width={size} height={size/2} viewBox="0 0 100 50">
          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Value arc */}
          <path
            d={`M10,50 A40,40 0 0,1 ${10 + 80 * angle / 180},${50 - Math.sin(angle * Math.PI / 180) * 40}`}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <line
            x1="50"
            y1="50"
            x2={50 + Math.cos((angle - 90) * Math.PI / 180) * 35}
            y2={50 + Math.sin((angle - 90) * Math.PI / 180) * 35}
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Center point */}
          <circle cx="50" cy="50" r="4" fill="#374151" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center top-6">
          <span className="text-xl font-bold">{value}</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700 text-center">{label}</div>
    </div>
  );
};

// Progress ring component
const ProgressRing: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  value: string;
}> = ({ percentage, size = 120, strokeWidth = 8, color = "#3b82f6", label, value }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">{label}</div>
    </div>
  );
};

const HealthReport: React.FC = () => {
  const { metrics, device } = useContext(HealthMetricsContext);
  const [historyData, setHistoryData] = useState<{
    heartRate: number[];
    steps: number[];
    sleepQuality: number[];
    stressLevel: number[];
  }>({
    heartRate: [70, 72, 68, 75, 71, 69, 72],
    steps: [5000, 6500, 4800, 7200, 5600, 8000, 6200],
    sleepQuality: [65, 70, 60, 75, 80, 68, 72],
    stressLevel: [45, 60, 55, 40, 50, 48, 42]
  });
  
  // Generate mock historical data when metrics change
  useEffect(() => {
    try {
      if (metrics.heartRate) {
        // Generate some historical data based on current metrics
        const generateHistory = (base: number | null, variance: number, count: number, fallback: number) => {
          const baseValue = base || fallback;
          return Array.from({ length: count }, () => 
            Math.max(0, Math.round(baseValue + (Math.random() * variance * 2 - variance)))
          );
        };
        
        setHistoryData({
          heartRate: generateHistory(metrics.heartRate, 10, 7, 70),
          steps: generateHistory(metrics.steps, 2000, 7, 5000),
          sleepQuality: generateHistory(metrics.sleepQuality, 15, 7, 70),
          stressLevel: generateHistory(metrics.stressLevel, 20, 7, 50)
        });
      }
    } catch (error) {
      console.error("Error generating history data:", error);
      // Keep the default data
    }
  }, [metrics]);
  
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

  return (
    <div id="health-report" className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800">
          📊 Health Report
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

      <div className="p-5">
        {/* Summary section with 3 circular charts */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Today's Summary</h4>
          <div className="flex flex-wrap justify-center gap-8">
            <ProgressRing 
              percentage={metrics.steps ? Math.min(100, (metrics.steps / 10000) * 100) : 0} 
              color="#10b981" 
              label="Daily Steps" 
              value={metrics.steps?.toLocaleString() || '0'}
            />
            
            <GaugeChart 
              value={metrics.heartRate || 0} 
              min={40} 
              max={140} 
              thresholds={[
                { value: 40, color: '#3b82f6' },
                { value: 60, color: '#10b981' },
                { value: 100, color: '#10b981' },
                { value: 120, color: '#f59e0b' },
                { value: 140, color: '#ef4444' }
              ]} 
              label="Heart Rate"
            />
            
            <ProgressRing 
              percentage={metrics.sleepQuality || 0} 
              color="#8b5cf6" 
              label="Sleep Quality" 
              value={`${metrics.sleepQuality || 0}%`}
            />
          </div>
        </div>

        {/* Week trends charts */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">Weekly Trends</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Chart */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon="heartbeat" className="text-red-500 mr-2" />
                <span className="text-gray-700 font-medium">Heart Rate (bpm)</span>
              </div>
              {historyData.heartRate.length > 0 ? (
                <SimpleLineChart 
                  data={historyData.heartRate} 
                  height={120} 
                  color="#ef4444" 
                  max={150}
                />
              ) : (
                <div className="h-[120px] flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-500">No data available</span>
                </div>
              )}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            
            {/* Sleep Quality Chart */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon="bed" className="text-indigo-500 mr-2" />
                <span className="text-gray-700 font-medium">Sleep Quality (%)</span>
              </div>
              <SimpleLineChart 
                data={historyData.sleepQuality} 
                height={120} 
                color="#8b5cf6" 
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            
            {/* Steps Chart */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon="walking" className="text-green-500 mr-2" />
                <span className="text-gray-700 font-medium">Daily Steps</span>
              </div>
              <SimpleLineChart 
                data={historyData.steps} 
                height={120} 
                color="#10b981" 
                max={15000}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            
            {/* Stress Level Chart */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon="brain" className="text-orange-500 mr-2" />
                <span className="text-gray-700 font-medium">Stress Level</span>
              </div>
              <SimpleLineChart 
                data={historyData.stressLevel} 
                height={120} 
                color="#f59e0b"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Device Information */}
        {device?.connected && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Connected Device</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-blue-600">Device Name:</span>
                <p className="text-gray-800">{device.name}</p>
              </div>
              <div>
                <span className="text-sm text-blue-600">Device ID:</span>
                <p className="text-gray-800 truncate">{device.id}</p>
              </div>
              <div>
                <span className="text-sm text-blue-600">Status:</span>
                <p className="text-green-600">Connected</p>
              </div>
              <div>
                <span className="text-sm text-blue-600">Data Source:</span>
                <p className="text-gray-800">Bluetooth Low Energy</p>
              </div>
              <div>
                <span className="text-sm text-blue-600">Battery:</span>
                <p className="text-gray-800">Simulated</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthReport; 