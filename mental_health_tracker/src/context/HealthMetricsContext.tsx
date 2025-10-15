import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from './UserContext';

// Check if Web Bluetooth API is available in the browser
const isWebBluetoothAvailable = (): boolean => {
  return typeof navigator !== 'undefined' && 
         'bluetooth' in navigator;
};

// Define interfaces for health metrics
export interface HealthMetrics {
  heartRate: number | null;
  sleepQuality: number | null; // 0-100%
  steps: number | null;
  activity: 'low' | 'moderate' | 'high' | null;
  stressLevel: number | null; // 0-100
  spO2: number | null; // Blood oxygen level (%)
  temperature: number | null; // Body temperature in Celsius
  lastUpdated: Date | null;
}

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
}

interface HealthMetricsContextType {
  metrics: HealthMetrics;
  device: BluetoothDevice | null;
  isLoading: boolean;
  error: string | null;
  requestDeviceConnection: (deviceId?: string, deviceName?: string) => Promise<void>;
  disconnectDevice: () => void;
  hasUserConsent: boolean;
  requestUserConsent: () => void;
  revokeUserConsent: () => void;
  isBluetoothAvailable: boolean;
  scanForDevices: () => Promise<any[]>;
  updateHealthMetrics: (data: Partial<HealthMetrics>) => void;
}

// Create context with default values
export const HealthMetricsContext = createContext<HealthMetricsContextType>({
  metrics: {
    heartRate: null,
    sleepQuality: null,
    steps: null,
    activity: null,
    stressLevel: null,
    spO2: null,
    temperature: null,
    lastUpdated: null
  },
  device: null,
  isLoading: false,
  error: null,
  requestDeviceConnection: async (deviceId?: string, deviceName?: string) => {},
  disconnectDevice: () => {},
  hasUserConsent: false,
  requestUserConsent: () => {},
  revokeUserConsent: () => {},
  isBluetoothAvailable: false,
  scanForDevices: async () => [],
  updateHealthMetrics: () => {}
});

interface HealthMetricsProviderProps {
  children: React.ReactNode;
}

export const HealthMetricsProvider: React.FC<HealthMetricsProviderProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: null,
    sleepQuality: null,
    steps: null,
    activity: null,
    stressLevel: null,
    spO2: null,
    temperature: null,
    lastUpdated: null
  });
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserConsent, setHasUserConsent] = useState<boolean>(false);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState<boolean>(isWebBluetoothAvailable());

  // Check for saved consent on mount
  useEffect(() => {
    if (user) {
      const storedConsent = localStorage.getItem(`health_consent_${user.id}`);
      if (storedConsent === 'true') {
        setHasUserConsent(true);
      }
    }

    // Check if Bluetooth is available
    setIsBluetoothAvailable(isWebBluetoothAvailable());
    
    // Listen for Bluetooth adapter state changes
    if (typeof navigator.bluetooth !== 'undefined' && 
        typeof navigator.bluetooth.addEventListener === 'function') {
      const handleBluetoothAvailabilityChanged = (event: any) => {
        setIsBluetoothAvailable(event.value);
      };
      
      // This is experimental and may not work in all browsers
      try {
        const bluetooth = navigator.bluetooth;
        if (bluetooth) {
          bluetooth.addEventListener('availabilitychanged', 
            handleBluetoothAvailabilityChanged);
            
          return () => {
            if (bluetooth) {
              bluetooth.removeEventListener('availabilitychanged', 
                handleBluetoothAvailabilityChanged);
            }
          };
        }
      } catch (e) {
        console.log('Bluetooth availability events not supported');
      }
    }
  }, [user]);

  // Mock function for retrieving data from Bluetooth device
  const fetchHealthData = useCallback(() => {
    if (!device || !device.connected || !hasUserConsent) return;

    // In a real app, this would use the Web Bluetooth API to fetch real data
    // For demo purposes, we'll generate random data
    
    const mockHeartRate = Math.floor(Math.random() * (100 - 60) + 60); // 60-100 bpm
    const mockSleepQuality = Math.floor(Math.random() * 101); // 0-100%
    const mockSteps = Math.floor(Math.random() * 15000); // 0-15000 steps
    const mockActivityLevels = ['low', 'moderate', 'high'] as const;
    const mockActivity = mockActivityLevels[Math.floor(Math.random() * mockActivityLevels.length)];
    const mockStressLevel = Math.floor(Math.random() * 101); // 0-100
    const mockSpO2 = Math.floor(Math.random() * (100 - 94) + 94); // 94-100%
    const mockTemperature = (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1); // 36.0-37.5°C

    setMetrics({
      heartRate: mockHeartRate,
      sleepQuality: mockSleepQuality,
      steps: mockSteps,
      activity: mockActivity,
      stressLevel: mockStressLevel,
      spO2: mockSpO2,
      temperature: parseFloat(mockTemperature),
      lastUpdated: new Date()
    });
  }, [device, hasUserConsent]);

  // Set up regular data fetching when connected to a device
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (device?.connected && hasUserConsent) {
      // Fetch initial data
      fetchHealthData();
      
      // Set up interval for regular updates (every 30 seconds)
      interval = setInterval(fetchHealthData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [device, hasUserConsent, fetchHealthData]);

  // Request connection to a Bluetooth device
  const requestDeviceConnection = async (deviceId?: string, deviceName?: string): Promise<void> => {
    if (!hasUserConsent) {
      setError('User consent is required before connecting to a device');
      return;
    }

    if (!isBluetoothAvailable) {
      setError('Bluetooth is not available on this device or browser. Please ensure Bluetooth is enabled and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if this is a real device ID format (not our simulation IDs)
      const isRealDeviceId = deviceId && !deviceId.startsWith('device-');
      
      // Try to use the real Web Bluetooth API if available and we have a real device ID
      if (isRealDeviceId && navigator.bluetooth) {
        try {
          // For real devices, we'd have to use a previously cached device or
          // request a new one through characteristic discovery
          
          // Notify user we're connecting to a Bluetooth device
          setError('Connecting to real Bluetooth device...');
          
          // Here we'd connect using the cached device, but for demo purposes
          // we'll just set up as if the connection was successful
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setDevice({
            id: deviceId,
            name: deviceName || 'Real Bluetooth Device',
            connected: true
          });
          
          // Initialize with first data fetch
          setTimeout(() => {
            fetchHealthData();
          }, 500);
          
          setError(null);
          setIsLoading(false);
          return;
        } catch (error: any) {
          console.error('Real Bluetooth connection error:', error);
          setError(`Failed to connect to real device: ${error.message || 'Unknown error'}. Falling back to simulation.`);
          // Fall back to simulation mode
        }
      }
      
      // SIMULATION CODE BELOW - For demo purposes only
      // Step 1: Simulate scanning for devices
      setError('Scanning for nearby devices...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Simulate finding devices
      const mockDevices = [
        { id: 'device-001', name: 'Apple Watch Series 8' },
        { id: 'device-002', name: 'Fitbit Sense' },
        { id: 'device-003', name: 'Samsung Galaxy Watch' },
        { id: 'device-004', name: 'Withings ScanWatch' }
      ];
      
      // Find the selected device or default to the first one
      const selectedDevice = deviceId 
        ? mockDevices.find(d => d.id === deviceId) || { id: deviceId, name: deviceName || 'Custom Device' }
        : mockDevices[0];
      
      if (!selectedDevice) {
        throw new Error('Selected device not found');
      }
      
      setError(`Found ${mockDevices.length} devices. Connecting to ${selectedDevice.name}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Simulate connection
      setError('Establishing connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Simulate service discovery
      setError('Discovering health services...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Connect successfully
      setDevice({
        id: selectedDevice.id,
        name: selectedDevice.name,
        connected: true
      });
      
      // Initialize with first data fetch
      setTimeout(() => {
        fetchHealthData();
      }, 500);
      
      setError(null);
      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to connect to device: ${err.message || 'Unknown error'}. Please make sure Bluetooth is enabled and try again.`);
      setIsLoading(false);
      console.error(err);
    }
  };

  // Disconnect from current device
  const disconnectDevice = (): void => {
    if (device) {
      // In a real app, this would disconnect from the Bluetooth device
      setDevice(null);
      
      // Reset metrics
      setMetrics({
        heartRate: null,
        sleepQuality: null,
        steps: null,
        activity: null,
        stressLevel: null,
        spO2: null,
        temperature: null,
        lastUpdated: null
      });
    }
  };

  // Request user consent for health data access
  const requestUserConsent = (): void => {
    if (user) {
      setHasUserConsent(true);
      localStorage.setItem(`health_consent_${user.id}`, 'true');
    }
  };

  // Revoke user consent for health data access
  const revokeUserConsent = (): void => {
    if (user) {
      setHasUserConsent(false);
      localStorage.removeItem(`health_consent_${user.id}`);
      
      // Also disconnect any connected devices
      disconnectDevice();
    }
  };

  // Add this new function to scan for Bluetooth devices
  const scanForDevices = async (): Promise<any[]> => {
    if (!hasUserConsent) {
      setError('User consent is required before scanning for devices');
      return [];
    }

    if (!isBluetoothAvailable) {
      setError('Bluetooth is not available on this device or browser. Please ensure Bluetooth is enabled and try again.');
      return [];
    }

    setIsLoading(true);
    setError('Scanning for nearby devices...');

    try {
      // Try to use the real Web Bluetooth API if available
      if (navigator.bluetooth && typeof navigator.bluetooth.requestDevice === 'function') {
        try {
          console.log('Web Bluetooth API is available, attempting to scan for devices...');
          // Request any Bluetooth device with all available filters to maximize results
          const device = await navigator.bluetooth.requestDevice({
            // Use acceptAllDevices to show all available Bluetooth devices
            acceptAllDevices: true,
            // Include common services that smartwatches might have
            optionalServices: [
              'heart_rate',
              'health_thermometer', 
              'battery_service', 
              'device_information',
              'generic_access'
            ]
          });
          
          console.log('Found Bluetooth device:', device);
          
          if (device) {
            setError(null);
            setIsLoading(false);
            // Return the real device with some default values for UI display
            return [{
              id: device.id,
              name: device.name || 'Unknown Device',
              type: 'watch', // Default type
              batteryLevel: 100, // Default value
              signalStrength: 5 // Default value
            }];
          }
        } catch (error: any) {
          // If user cancels the browser dialog or there's a permission error,
          // log the error and fall back to simulation mode
          console.error('Web Bluetooth scanning error:', error);
          
          if (error.name === 'NotFoundError') {
            setError('No Bluetooth devices found. Showing simulated devices...');
          } else if (error.name === 'NotAllowedError') {
            setError('Bluetooth permission denied by user. Showing simulated devices...');
          } else if (error.name === 'SecurityError') {
            setError('Bluetooth request blocked by the browser. Please ensure you are using HTTPS. Showing simulated devices...');
          } else {
            setError(`Bluetooth error: ${error.message || 'Unknown error'}. Showing simulated devices...`);
          }
        }
      } else {
        console.warn('Web Bluetooth API is not available in this browser. Falling back to simulated devices.');
        setError('Web Bluetooth API is not supported in this browser. Showing simulated devices...');
      }
      
      // Simulation fallback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockDevices = [
        { 
          id: 'device-001', 
          name: 'Apple Watch Series 8', 
          type: 'watch',
          batteryLevel: 87,
          signalStrength: 5
        },
        { 
          id: 'device-002', 
          name: 'Fitbit Sense', 
          type: 'fitness',
          batteryLevel: 64,
          signalStrength: 4
        },
        { 
          id: 'device-003', 
          name: 'Samsung Galaxy Watch', 
          type: 'watch',
          batteryLevel: 92,
          signalStrength: 3
        },
        { 
          id: 'device-004', 
          name: 'Withings ScanWatch', 
          type: 'medical',
          batteryLevel: 78,
          signalStrength: 2
        }
      ];
      
      setError(null);
      setIsLoading(false);
      return mockDevices;
    } catch (err: any) {
      setError(`Failed to scan for devices: ${err.message || 'Unknown error'}.`);
      setIsLoading(false);
      console.error(err);
      return [];
    }
  };

  // Add updateHealthMetrics function
  const updateHealthMetrics = (data: Partial<HealthMetrics>): void => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      ...data,
      lastUpdated: new Date()
    }));
  };

  // Check for saved manual health data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('manualHealthData');
    if (savedData && !device) {
      try {
        const parsedData = JSON.parse(savedData);
        // Only update if we don't have device data and there's saved manual data
        if (!metrics.lastUpdated && parsedData) {
          updateHealthMetrics({
            heartRate: parsedData.heartRate || null,
            sleepQuality: parsedData.sleepQuality || null,
            steps: parsedData.steps || null,
            activity: parsedData.activity || null,
            stressLevel: parsedData.stressLevel || null,
            spO2: parsedData.spO2 || null,
            temperature: parsedData.temperature || null,
            lastUpdated: parsedData.lastUpdated ? new Date(parsedData.lastUpdated) : new Date()
          });
        }
      } catch (error) {
        console.error('Error parsing saved health data:', error);
      }
    }
  }, []);

  return (
    <HealthMetricsContext.Provider 
      value={{ 
        metrics, 
        device, 
        isLoading, 
        error, 
        requestDeviceConnection, 
        disconnectDevice,
        hasUserConsent,
        requestUserConsent,
        revokeUserConsent,
        isBluetoothAvailable,
        scanForDevices,
        updateHealthMetrics
      }}
    >
      {children}
    </HealthMetricsContext.Provider>
  );
};

export default HealthMetricsProvider; 