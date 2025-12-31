import { create } from 'zustand';
import type { DeviceState } from '../types/devices';

interface DeviceStoreState {
  deviceStates: Record<string, DeviceState>;
  updateDeviceState: (deviceId: string, value: any) => void;
  setDeviceStates: (states: Record<string, any>) => void;
  getDeviceValue: (deviceId: string) => any;
}

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  deviceStates: {},

  updateDeviceState: (deviceId: string, value: any) => {
    set((state) => ({
      deviceStates: {
        ...state.deviceStates,
        [deviceId]: {
          value,
          timestamp: Date.now(),
          ack: true,
        },
      },
    }));
  },

  setDeviceStates: (states: Record<string, any>) => {
    const newDeviceStates: Record<string, DeviceState> = {};
    Object.entries(states).forEach(([key, value]) => {
      newDeviceStates[key] = {
        value,
        timestamp: Date.now(),
        ack: true,
      };
    });

    set({ deviceStates: { ...get().deviceStates, ...newDeviceStates } });
  },

  getDeviceValue: (deviceId: string) => {
    return get().deviceStates[deviceId]?.value;
  },
}));
