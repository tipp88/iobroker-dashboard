import type { Device, Room } from '../types/devices';

// Example device configurations
// Replace these with your actual Iobroker state IDs
export const DEVICES: {
  climate: Device[];
  sensors: Device[];
  switches: Device[];
  shutters: Device[];
} = {
  climate: [
    {
      id: 'hm-rpc.0.NEQ1234567.1.SET_TEMPERATURE',
      name: 'Living Room Thermostat',
      room: 'living-room',
      type: 'climate',
      capabilities: ['heating', 'temperature'],
      states: {
        currentTemp: 'hm-rpc.0.NEQ1234567.1.ACTUAL_TEMPERATURE',
        targetTemp: 'hm-rpc.0.NEQ1234567.1.SET_TEMPERATURE',
        mode: 'hm-rpc.0.NEQ1234567.1.CONTROL_MODE',
      },
      config: {
        minTemp: 15,
        maxTemp: 30,
        step: 0.5,
        unit: '°C',
      },
      icon: 'thermostat',
    },
  ],
  sensors: [
    {
      id: 'hm-rpc.0.ABC7654321.1.TEMPERATURE',
      name: 'Bedroom Temperature',
      room: 'bedroom',
      type: 'sensor',
      sensorType: 'temperature',
      unit: '°C',
      icon: 'thermostat',
    },
    {
      id: 'hm-rpc.0.ABC7654321.1.HUMIDITY',
      name: 'Bedroom Humidity',
      room: 'bedroom',
      type: 'sensor',
      sensorType: 'humidity',
      unit: '%',
      icon: 'water_drop',
    },
  ],
  switches: [
    {
      id: '0_userdata.0.devices.outlet1',
      name: 'Desk Lamp',
      room: 'office',
      type: 'switch',
      icon: 'lightbulb',
    },
    {
      id: '0_userdata.0.devices.outlet2',
      name: 'Coffee Maker',
      room: 'kitchen',
      type: 'switch',
      icon: 'power',
    },
  ],
  shutters: [
    {
      id: 'hm-rpc.0.XYZ9876543.3.LEVEL',
      name: 'Living Room Blinds',
      room: 'living-room',
      type: 'shutter',
      states: {
        level: 'hm-rpc.0.XYZ9876543.3.LEVEL',
        working: 'hm-rpc.0.XYZ9876543.3.WORKING',
      },
      config: {
        invertLevel: false,
        step: 5,
      },
      icon: 'blinds',
    },
  ],
};

export const ROOMS: Record<string, Room> = {
  'living-room': { name: 'Living Room', icon: 'living', order: 1 },
  'bedroom': { name: 'Bedroom', icon: 'bed', order: 2 },
  'kitchen': { name: 'Kitchen', icon: 'kitchen', order: 3 },
  'office': { name: 'Office', icon: 'desk', order: 4 },
};

// Get all devices flattened
export const getAllDevices = (): Device[] => {
  return [
    ...DEVICES.climate,
    ...DEVICES.sensors,
    ...DEVICES.switches,
    ...DEVICES.shutters,
  ];
};

// Get devices by room
export const getDevicesByRoom = (room: string): Device[] => {
  return getAllDevices().filter((device) => device.room === room);
};

// Get devices by type
export const getDevicesByType = (type: string): Device[] => {
  return getAllDevices().filter((device) => device.type === type);
};
