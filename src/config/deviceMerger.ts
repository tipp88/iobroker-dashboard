import { DEVICES as HARDCODED_DEVICES } from './devices.config';
import type { Device } from '../types/devices';
import type { UserDevicesConfig } from '../types/userConfig';

/**
 * Merge hardcoded devices with user-added devices
 */
export const mergeDevices = (userDevices: UserDevicesConfig | undefined) => {
  return {
    climate: [...HARDCODED_DEVICES.climate, ...(userDevices?.climate || [])],
    sensors: [...HARDCODED_DEVICES.sensors, ...(userDevices?.sensors || [])],
    switches: [...HARDCODED_DEVICES.switches, ...(userDevices?.switches || [])],
    shutters: [...HARDCODED_DEVICES.shutters, ...(userDevices?.shutters || [])],
  };
};

/**
 * Get all merged devices as a single flat array
 */
export const getAllMergedDevices = (userDevices: UserDevicesConfig | undefined): Device[] => {
  const merged = mergeDevices(userDevices);
  return [...merged.climate, ...merged.sensors, ...merged.switches, ...merged.shutters];
};

/**
 * Get merged devices by room
 */
export const getMergedDevicesByRoom = (
  room: string,
  userDevices: UserDevicesConfig | undefined
): Device[] => {
  return getAllMergedDevices(userDevices).filter((device) => device.room === room);
};

/**
 * Get merged devices by type
 */
export const getMergedDevicesByType = (
  type: 'climate' | 'sensors' | 'switches' | 'shutters',
  userDevices: UserDevicesConfig | undefined
): Device[] => {
  const merged = mergeDevices(userDevices);
  return merged[type];
};
