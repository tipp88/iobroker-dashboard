export type DeviceType = 'climate' | 'sensor' | 'switch' | 'shutter';
export type SensorType = 'temperature' | 'humidity' | 'pressure' | 'light';
export type ClimateMode = 'heat' | 'cool' | 'auto' | 'off';

export interface BaseDevice {
  id: string;
  name: string;
  room: string;
  type: DeviceType;
  icon?: string;
  isUserAdded?: boolean;
}

export interface ClimateDevice extends BaseDevice {
  type: 'climate';
  capabilities: string[];
  states: {
    currentTemp: string;
    targetTemp: string;
    mode?: string;
  };
  config: {
    minTemp: number;
    maxTemp: number;
    step: number;
    unit: string;
  };
}

export interface SensorDevice extends BaseDevice {
  type: 'sensor';
  sensorType: SensorType;
  unit: string;
}

export interface SwitchDevice extends BaseDevice {
  type: 'switch';
}

export interface ShutterDevice extends BaseDevice {
  type: 'shutter';
  states: {
    level: string;
    working?: string;
  };
  config: {
    invertLevel: boolean;
    step: number;
  };
}

export type Device = ClimateDevice | SensorDevice | SwitchDevice | ShutterDevice;

export interface Room {
  name: string;
  icon: string;
  order: number;
}

export interface DeviceState {
  value: any;
  timestamp: number;
  ack: boolean;
}
