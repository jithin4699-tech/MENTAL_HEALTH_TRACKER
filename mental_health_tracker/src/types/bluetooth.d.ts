// Type definitions for Web Bluetooth API
// https://webbluetoothcg.github.io/web-bluetooth/

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  readonly connected: boolean;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic[]>;
  readonly uuid: string;
}

interface BluetoothRemoteGATTCharacteristic {
  readonly uuid: string;
  readonly value: DataView | null;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface BluetoothDevice {
  readonly id: string;
  readonly name?: string;
  readonly gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface Bluetooth extends EventTarget {
  getAvailability(): Promise<boolean>;
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface Navigator {
  bluetooth?: Bluetooth;
}

type BluetoothServiceUUID = string | number;
type BluetoothCharacteristicUUID = string | number; 