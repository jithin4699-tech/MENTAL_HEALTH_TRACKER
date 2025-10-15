import React, { useContext, Suspense } from 'react';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';
import MyStats from './MyStats';
import ConnectDevicePrompt from './ConnectDevicePrompt';
import HealthReport from './HealthReport';
import GeminiHealthInsights from './GeminiHealthInsights';

// Lazy load the other components to prevent import errors
const CalmZone = React.lazy(() => import('./CalmZone'));
const RestRecharge = React.lazy(() => import('./RestRecharge')); 
const MoveALittle = React.lazy(() => import('./MoveALittle'));
const CheckIn = React.lazy(() => import('./CheckIn'));

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-700 font-medium">Something went wrong with this component.</h3>
        <p className="text-red-600">The application will continue to work, but some features may be unavailable.</p>
      </div>;
    }

    return this.props.children;
  }
}

const HealthSectionContainer: React.FC = () => {
  const { metrics, device, hasUserConsent, requestUserConsent } = useContext(HealthMetricsContext);

  // For demonstration purposes, always show all sections 
  // We'll keep the original logic as comments
  // const showCalmZone = metrics.heartRate !== null && metrics.heartRate > 90;
  // const showRestRecharge = metrics.sleepQuality !== null && metrics.sleepQuality < 50;
  // const showMoveALittle = metrics.steps !== null && metrics.steps < 2000;
  // const showCheckIn = metrics.stressLevel !== null && metrics.stressLevel > 70;
  
  const showCalmZone = true;
  const showRestRecharge = true;
  const showMoveALittle = true;
  const showCheckIn = true;
  
  // If no device is connected or no consent, just show the connect prompt
  if (!device?.connected || !hasUserConsent) {
    // For demo purposes, let's also show sections even without a connected device
    const handleDemoView = () => {
      requestUserConsent();
    };

    return (
      <div>
        <ErrorBoundary>
          <ConnectDevicePrompt />
        </ErrorBoundary>
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700 mb-3">
            To see all sections without connecting a device, click the button below.
          </p>
          <button 
            onClick={handleDemoView}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Show Demo Sections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Your Wellbeing Dashboard</h2>
      
      {/* Health Report with advanced visualizations */}
      <ErrorBoundary>
        <HealthReport />
      </ErrorBoundary>
      
      {/* Gemini AI Health Insights */}
      <ErrorBoundary>
        <GeminiHealthInsights />
      </ErrorBoundary>
      
      {/* Basic stats summary */}
      <ErrorBoundary>
        <MyStats />
      </ErrorBoundary>
      
      {/* Show all sections for demonstration */}
      <div className="space-y-6">
        <Suspense fallback={<div>Loading...</div>}>
          {showCalmZone && (
            <ErrorBoundary>
              <CalmZone heartRate={metrics.heartRate || 95} />
            </ErrorBoundary>
          )}
          
          {showRestRecharge && (
            <ErrorBoundary>
              <RestRecharge sleepQuality={metrics.sleepQuality || 35} />
            </ErrorBoundary>
          )}
          
          {showMoveALittle && (
            <ErrorBoundary>
              <MoveALittle steps={metrics.steps || 1500} />
            </ErrorBoundary>
          )}
          
          {showCheckIn && (
            <ErrorBoundary>
              <CheckIn stressLevel={metrics.stressLevel || 80} />
            </ErrorBoundary>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default HealthSectionContainer; 