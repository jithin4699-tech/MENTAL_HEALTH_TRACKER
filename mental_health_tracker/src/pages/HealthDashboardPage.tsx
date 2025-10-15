import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../context/HealthMetricsContext';
import { UserContext } from '../context/UserContext';
import BluetoothDeviceScanner from '../components/health/BluetoothDeviceScanner';
import ManualHealthForm from '../components/health/ManualHealthForm';
import HealthInsights from '../components/health/HealthInsights';

const HealthDashboardPage: React.FC = () => {
  const { metrics, device, requestDeviceConnection, disconnectDevice, hasUserConsent } = useContext(HealthMetricsContext);
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('bluetooth'); // Default to the Bluetooth tab
  
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Dashboard</h1>
        <p className="text-gray-600">
          Monitor your health metrics and connect to your smartwatch for real-time tracking
        </p>
        
        {/* Device status indicator */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg inline-flex items-center">
          <FontAwesomeIcon 
            icon={device ? "bluetooth" : "bluetooth-b"} 
            className={`mr-2 ${device ? "text-blue-600" : "text-gray-400"}`} 
          />
          <span className="font-medium">
            {device 
              ? `Connected to: ${device.name}` 
              : "No device connected"}
          </span>
          {device && (
            <button 
              onClick={disconnectDevice}
              className="ml-3 text-sm text-red-600 hover:text-red-800"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('bluetooth')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'bluetooth' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon="bluetooth" className="mr-2" />
            Bluetooth Devices
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'dashboard' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon="chart-line" className="mr-2" />
            Health Metrics
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'insights' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon="lightbulb" className="mr-2" />
            Insights
          </button>
        </nav>
      </div>

      {/* Bluetooth Tab */}
      {activeTab === 'bluetooth' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="mr-3 bg-blue-100 p-3 rounded-full">
              <FontAwesomeIcon icon="bluetooth" className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Connect to Bluetooth Devices</h2>
              <p className="text-gray-600">Find and connect to your smartwatch or fitness tracker</p>
            </div>
          </div>
          
          <BluetoothDeviceScanner />
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {!device && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon="exclamation-triangle" className="text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No device connected</h3>
                  <div className="text-yellow-700 text-sm mt-1">
                    <p>Connect to your smartwatch or fitness tracker to see your health metrics, or enter data manually below.</p>
                    <button 
                      className="text-yellow-800 font-medium underline mt-1 mr-2"
                      onClick={() => setActiveTab('bluetooth')}
                    >
                      Connect a device
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Health Data Form */}
          <div className="mb-8">
            <ManualHealthForm />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Heart Rate Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Heart Rate</h3>
                <FontAwesomeIcon icon="heartbeat" className="text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.heartRate ? `${metrics.heartRate} BPM` : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>

            {/* Sleep Quality Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Sleep Quality</h3>
                <FontAwesomeIcon icon="moon" className="text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.sleepQuality ? `${metrics.sleepQuality}%` : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>

            {/* Step Count Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Steps</h3>
                <FontAwesomeIcon icon="shoe-prints" className="text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.steps ? metrics.steps.toLocaleString() : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>

            {/* Activity Level Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Activity Level</h3>
                <FontAwesomeIcon icon="running" className="text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.activity ? `${metrics.activity}%` : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>

            {/* Stress Level Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Stress Level</h3>
                <FontAwesomeIcon icon="brain" className="text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.stressLevel ? `${metrics.stressLevel}%` : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>

            {/* SpO2 Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Blood Oxygen (SpO2)</h3>
                <FontAwesomeIcon icon="lungs" className="text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.spO2 ? `${metrics.spO2}%` : 'No data'}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {formatDate(metrics.lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div>
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Insights Section */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon="lightbulb" className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Quick Health Insights</h3>
                  <p className="text-gray-600">Actionable recommendations based on your current metrics</p>
                </div>
              </div>

              {!device && !metrics.heartRate ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon="exclamation-triangle" className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Connect a device or enter health data manually to see personalized insights.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Heart Rate Insight */}
                  {metrics.heartRate && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="heartbeat" className="text-red-500 mr-2" />
                        <h4 className="font-medium text-red-900">Heart Rate: {metrics.heartRate} BPM</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.heartRate > 100 
                          ? "Your heart rate is elevated. Consider relaxation techniques." 
                          : metrics.heartRate < 60
                          ? "Your heart rate is lower than average. This could be due to rest or good fitness."
                          : "Your heart rate is within a healthy range."}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Learn more
                      </a>
                    </div>
                  )}
                  
                  {/* Sleep Quality Insight */}
                  {metrics.sleepQuality && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="moon" className="text-indigo-500 mr-2" />
                        <h4 className="font-medium text-indigo-900">Sleep Quality: {metrics.sleepQuality}%</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.sleepQuality < 50 
                          ? "Your sleep quality is low. Try to establish a regular sleep schedule." 
                          : metrics.sleepQuality < 70
                          ? "Your sleep quality is moderate. Reducing screen time before bed may help."
                          : "Your sleep quality is good. Keep up your healthy sleep habits."}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Sleep improvement tips
                      </a>
                    </div>
                  )}
                  
                  {/* Stress Level Insight */}
                  {metrics.stressLevel && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="brain" className="text-amber-500 mr-2" />
                        <h4 className="font-medium text-amber-900">Stress Level: {metrics.stressLevel}%</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.stressLevel > 70 
                          ? "Your stress level is high. Consider mind-body practices like yoga or meditation." 
                          : metrics.stressLevel > 40
                          ? "Your stress is moderate. Regular breaks during the day may help."
                          : "Your stress level is low. Great job managing your stress."}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Stress management techniques
                      </a>
                    </div>
                  )}
                  
                  {/* Activity Level Insight */}
                  {metrics.activity && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="running" className="text-green-500 mr-2" />
                        <h4 className="font-medium text-green-900">Activity: {typeof metrics.activity === 'string' ? metrics.activity : 'Moderate'}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.activity === 'low' 
                          ? "Your activity level is low. Try to incorporate more movement in your day." 
                          : metrics.activity === 'moderate'
                          ? "Your activity level is moderate. A good balance for overall health."
                          : "Your activity level is high. Make sure to allow for recovery periods."}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Activity recommendations
                      </a>
                    </div>
                  )}
                  
                  {/* Steps Insight */}
                  {metrics.steps && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="shoe-prints" className="text-blue-500 mr-2" />
                        <h4 className="font-medium text-blue-900">Steps: {metrics.steps.toLocaleString()}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.steps < 4000 
                          ? "Your step count is low. Try taking short walks throughout the day." 
                          : metrics.steps < 8000
                          ? "You're on your way to reaching the recommended 10,000 steps."
                          : "Great job staying active with your step count!"}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Walking benefits
                      </a>
                    </div>
                  )}
                  
                  {/* SpO2 Insight */}
                  {metrics.spO2 && (
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-lg border border-sky-100">
                      <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon="lungs" className="text-sky-500 mr-2" />
                        <h4 className="font-medium text-sky-900">Blood Oxygen: {metrics.spO2}%</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {metrics.spO2 < 95 
                          ? "Your blood oxygen level is slightly below optimal. If you notice breathing difficulties, consult a doctor." 
                          : "Your blood oxygen level is in the healthy range."}
                      </p>
                      <a href="#" className="text-xs text-blue-600 flex items-center">
                        <FontAwesomeIcon icon="arrow-right" className="mr-1" />
                        Understanding SpO2
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Main Insights Components */}
          <div className="space-y-8">
            {/* Standard Health Insights */}
            <HealthInsights />
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboardPage; 