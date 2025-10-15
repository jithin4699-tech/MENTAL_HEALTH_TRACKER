import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HealthMetricsContext } from '../../context/HealthMetricsContext';

// Mock device data for nearby devices
interface NearbyDevice {
  id: string;
  name: string;
  type: 'watch' | 'fitness' | 'medical';
  batteryLevel: number;
  signalStrength: number; // 1-5
}

const ConnectDevicePrompt: React.FC = () => {
  const { 
    device, 
    isLoading, 
    error, 
    requestDeviceConnection, 
    hasUserConsent, 
    requestUserConsent,
    isBluetoothAvailable,
    scanForDevices
  } = useContext(HealthMetricsContext);
  
  const [showConsentInfo, setShowConsentInfo] = useState(false);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);

  // Handle scan for devices
  const handleScan = async () => {
    if (!hasUserConsent) {
      setShowConsentInfo(true);
      return;
    }

    setIsScanning(true);
    setNearbyDevices([]);
    setShowDeviceList(true);
    
    try {
      console.log('Starting device scan...');
      // Use the real Web Bluetooth API to scan for devices
      const devices = await scanForDevices();
      console.log('Scan complete, found devices:', devices);
      
      if (devices.length === 0) {
        // No devices found message will be handled by the context
      } else {
        setNearbyDevices(devices as NearbyDevice[]);
      }
    } catch (error) {
      console.error('Error scanning for devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle connect button click
  const handleConnect = async () => {
    if (!hasUserConsent) {
      setShowConsentInfo(true);
      return;
    }
    
    if (showDeviceList && selectedDeviceId) {
      await requestDeviceConnection(selectedDeviceId);
      setShowDeviceList(false);
    } else if (!showDeviceList) {
      handleScan();
    }
  };

  // Handle consent agreement
  const handleConsentAgree = () => {
    requestUserConsent();
    setShowConsentInfo(false);
  };

  // Get signal strength icon
  const getSignalIcon = (strength: number) => {
    switch(strength) {
      case 5: return "signal";
      case 4: return "signal";
      case 3: return "signal";
      case 2: return "signal-slash";
      case 1: return "signal-slash";
      default: return "signal-slash";
    }
  };

  // Get device type icon
  const getDeviceTypeIcon = (type: 'watch' | 'fitness' | 'medical') => {
    switch(type) {
      case 'watch': return "clock";
      case 'fitness': return "heartbeat";
      case 'medical': return "notes-medical";
      default: return "mobile-alt";
    }
  };

  // Determine the connection status message and icon
  const getConnectionStatusInfo = () => {
    if (!isLoading && !error && !device?.connected) {
      return {
        icon: "bluetooth",
        text: "Connect Device",
        progress: 0
      };
    }

    if (device?.connected) {
      return {
        icon: "check-circle",
        text: `Connected to ${device.name}`,
        progress: 100
      };
    }

    if (isLoading) {
      if (error?.includes("Scanning")) {
        return {
          icon: "search",
          text: "Scanning for devices...",
          progress: 20
        };
      }
      if (error?.includes("Found")) {
        return {
          icon: "list",
          text: error,
          progress: 40
        };
      }
      if (error?.includes("Establishing")) {
        return {
          icon: "link",
          text: "Establishing connection...",
          progress: 60
        };
      }
      if (error?.includes("Discovering")) {
        return {
          icon: "heartbeat",
          text: "Discovering health services...",
          progress: 80
        };
      }
      return {
        icon: "circle-notch",
        text: "Connecting...",
        progress: 10
      };
    }

    return {
      icon: "exclamation-triangle",
      text: error,
      progress: 0
    };
  };

  const statusInfo = getConnectionStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-5">
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
          <FontAwesomeIcon icon="mobile-alt" className="text-purple-600 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-800">
            Connect Your Smartwatch
          </h3>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isBluetoothAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">
              Bluetooth: {isBluetoothAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>
      
      {!isBluetoothAvailable ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon="exclamation-circle" className="text-red-500 mr-2 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Bluetooth is not available</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Bluetooth is not available on this device or is turned off. Please:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Check if Bluetooth is enabled on your device</li>
                  <li>Try using a browser that supports Web Bluetooth API (Chrome, Edge, Opera)</li>
                  <li>Make sure you're using a secure (HTTPS) connection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {showConsentInfo ? (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded p-4 text-blue-700 border border-blue-200">
            <h4 className="font-medium mb-2">Health Data Permission</h4>
            <p className="text-sm">
              To provide personalized wellness insights, we need permission to access your health data from your connected device. 
              We value your privacy and will only use this data to power the features of this app.
            </p>
          </div>
          
          <div className="rounded bg-gray-50 p-4 border border-gray-200">
            <h4 className="font-medium mb-2 text-gray-800">We'll access:</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-center">
                <FontAwesomeIcon icon="heart" className="text-red-500 mr-2" />
                Heart rate data
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon="bed" className="text-indigo-500 mr-2" />
                Sleep quality metrics
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon="walking" className="text-green-500 mr-2" />
                Step count and activity levels
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon="brain" className="text-orange-500 mr-2" />
                Stress levels (if available)
              </li>
            </ul>
          </div>
          
          <p className="text-xs text-gray-500">
            You can revoke this permission at any time from your profile settings.
          </p>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleConsentAgree}
              className="flex-1 bg-primary hover:bg-secondary text-white py-2 px-4 rounded transition-colors"
            >
              I Agree
            </button>
            <button 
              onClick={() => setShowConsentInfo(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              No Thanks
            </button>
          </div>
        </div>
      ) : showDeviceList ? (
        <div>
          <p className="text-gray-600 mb-4">
            Select a device from the list of nearby devices:
          </p>
          
          {isScanning ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
              <p className="text-blue-600">Scanning for nearby devices...</p>
            </div>
          ) : nearbyDevices.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
              <FontAwesomeIcon icon="search" className="text-gray-400 text-3xl mb-2" />
              <p className="text-gray-500">No devices found nearby.</p>
              <button
                onClick={handleScan}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
              >
                Scan Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 space-y-2">
                {nearbyDevices.map(nearbyDevice => (
                  <div 
                    key={nearbyDevice.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center ${
                      selectedDeviceId === nearbyDevice.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDeviceId(nearbyDevice.id)}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                      selectedDeviceId === nearbyDevice.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FontAwesomeIcon icon={getDeviceTypeIcon(nearbyDevice.type)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{nearbyDevice.name}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <FontAwesomeIcon icon="battery-three-quarters" className="mr-1" />
                        <span className="mr-2">{nearbyDevice.batteryLevel}%</span>
                        <FontAwesomeIcon icon={getSignalIcon(nearbyDevice.signalStrength)} className="mr-1" />
                        <span>Signal: {nearbyDevice.signalStrength}/5</span>
                      </div>
                    </div>
                    {selectedDeviceId === nearbyDevice.id && (
                      <div className="text-blue-500">
                        <FontAwesomeIcon icon="check-circle" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeviceList(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!selectedDeviceId}
                  className={`flex-1 py-2 px-4 rounded transition-colors ${
                    selectedDeviceId 
                      ? 'bg-primary text-white hover:bg-secondary' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Connect
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={handleScan}
                  className="text-blue-600 text-sm hover:underline"
                >
                  <FontAwesomeIcon icon="sync" className="mr-1" />
                  Scan Again
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Connect your smartwatch to automatically track your health metrics and get personalized wellbeing recommendations.
            <br /><br />
            <span className="text-blue-600 font-medium">
              Click "Search Nearby Devices" to use your PC's Bluetooth to find devices.
            </span>
          </p>
          
          {isLoading && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${statusInfo.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-600 flex items-center">
                {statusInfo.icon === "circle-notch" || statusInfo.icon === "spinner" ? (
                  <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                ) : statusInfo.icon === "search" ? (
                  <FontAwesomeIcon icon="search" className="mr-2" />
                ) : statusInfo.icon === "list" ? (
                  <FontAwesomeIcon icon="list" className="mr-2" />
                ) : statusInfo.icon === "link" ? (
                  <FontAwesomeIcon icon="link" className="mr-2" />
                ) : statusInfo.icon === "heartbeat" ? (
                  <FontAwesomeIcon icon="heartbeat" className="mr-2" />
                ) : statusInfo.icon === "exclamation-triangle" ? (
                  <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
                ) : (
                  <FontAwesomeIcon icon="bluetooth" className="mr-2" />
                )}
                {statusInfo.text}
              </p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            {!device?.connected ? (
              <button
                onClick={handleScan}
                disabled={isLoading || !isBluetoothAvailable}
                className={`px-6 py-3 rounded-md flex items-center justify-center transition-colors ${
                  isLoading || !isBluetoothAvailable
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon="search" className="mr-2" />
                    Search Nearby Devices
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {}}
                disabled={true}
                className="px-6 py-3 rounded-md flex items-center justify-center bg-green-500 text-white cursor-not-allowed"
              >
                <FontAwesomeIcon icon="check-circle" className="mr-2" />
                Connected to {device.name}
              </button>
            )}
          </div>
          
          {device?.connected ? (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 flex items-center">
                <FontAwesomeIcon icon="check-circle" className="mr-2 text-green-600" />
                Successfully Connected!
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Your health metrics are now being synced. Explore your personalized recommendations below.
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-4 text-center">
              Make sure your device is nearby and Bluetooth is enabled on your phone or computer.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectDevicePrompt; 