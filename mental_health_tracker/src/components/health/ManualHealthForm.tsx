import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';

// Define an interface for the form data to ensure proper typing
interface ManualHealthFormData {
  heartRate: number;
  sleepQuality: number;
  steps: number;
  activity: number; // Numeric value for the slider
  stressLevel: number;
  spO2: number;
  temperature: number;
}

const ManualHealthForm: React.FC = () => {
  const { metrics, device, updateHealthMetrics } = useContext(HealthMetricsContext);
  
  // Initialize form with existing metrics or default values
  const [formData, setFormData] = useState<ManualHealthFormData>({
    heartRate: metrics.heartRate || 75,
    sleepQuality: metrics.sleepQuality || 80,
    steps: metrics.steps || 5000,
    activity: typeof metrics.activity === 'string' 
      ? convertActivityToNumber(metrics.activity) 
      : 60,
    stressLevel: metrics.stressLevel || 45,
    spO2: metrics.spO2 || 97,
    temperature: metrics.temperature || 36.6
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Helper function to convert activity enum to numeric value for the form
  function convertActivityToNumber(activity: 'low' | 'moderate' | 'high' | null): number {
    if (activity === 'low') return 20;
    if (activity === 'moderate') return 50;
    if (activity === 'high') return 80;
    return 60; // Default value
  }
  
  // Helper function to convert numeric activity value to enum string
  function convertActivityToEnum(activityValue: number): 'low' | 'moderate' | 'high' {
    if (activityValue < 30) return 'low';
    if (activityValue < 70) return 'moderate';
    return 'high';
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert numeric activity to the expected string enum value
    const activityValue = convertActivityToEnum(formData.activity);
    
    // Send data to localStorage for persistence
    localStorage.setItem('manualHealthData', JSON.stringify({
      ...formData,
      activity: activityValue,
      lastUpdated: new Date().toISOString()
    }));
    
    // Simulate API call
    setTimeout(() => {
      // Update the health metrics using the context function with proper activity type
      updateHealthMetrics({
        ...formData,
        activity: activityValue
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-blue-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-lg text-gray-800 flex items-center">
          <FontAwesomeIcon icon="edit" className="text-blue-500 mr-2" />
          Manual Health Data Entry
        </h3>
        {device && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <FontAwesomeIcon icon="info-circle" className="mr-1" />
            Connected device data will override manual entries
          </div>
        )}
      </div>
      
      {showSuccess && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center">
          <FontAwesomeIcon icon="check-circle" className="text-green-500 mr-2" />
          Health data saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          {/* Heart Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="heartbeat" className="text-red-500 mr-1" />
              Heart Rate (BPM)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="heartRate"
                min="40"
                max="180"
                value={formData.heartRate}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.heartRate}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>40</span>
              <span>180</span>
            </div>
          </div>
          
          {/* Sleep Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="moon" className="text-indigo-500 mr-1" />
              Sleep Quality (%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="sleepQuality"
                min="0"
                max="100"
                value={formData.sleepQuality}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.sleepQuality}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          
          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="shoe-prints" className="text-green-500 mr-1" />
              Steps Count
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="steps"
                min="0"
                max="20000"
                step="100"
                value={formData.steps}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[4rem] text-center">
                {formData.steps.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>20,000</span>
            </div>
          </div>
          
          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="running" className="text-orange-500 mr-1" />
              Activity Level (%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="activity"
                min="0"
                max="100"
                value={formData.activity}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.activity}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          
          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="brain" className="text-purple-500 mr-1" />
              Stress Level (%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="stressLevel"
                min="0"
                max="100"
                value={formData.stressLevel}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.stressLevel}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          
          {/* SpO2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="lungs" className="text-blue-500 mr-1" />
              Blood Oxygen - SpO2 (%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="spO2"
                min="80"
                max="100"
                value={formData.spO2}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.spO2}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>80</span>
              <span>100</span>
            </div>
          </div>
          
          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon="thermometer-half" className="text-red-400 mr-1" />
              Body Temperature (°C)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="temperature"
                min="35"
                max="42"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                {formData.temperature.toFixed(1)}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>35.0</span>
              <span>42.0</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-full font-medium flex items-center shadow-sm transition-all duration-300 ${
              isSubmitting 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="save" className="mr-2" />
                Save Health Data
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualHealthForm; 