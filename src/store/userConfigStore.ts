import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Device } from '../types/devices';
import type {
  UserControlPanelConfig,
  UserDevicesConfig,
  TodoJsonStructure,
} from '../types/userConfig';
import { generateUUID } from '../utils/uuid';

interface UserConfigState {
  // User devices
  userDevices: UserDevicesConfig;

  // User control panels
  userControlPanels: Record<string, UserControlPanelConfig>;

  // Actions for devices
  addDevice: (
    type: 'climate' | 'sensors' | 'switches' | 'shutters',
    device: Device
  ) => void;
  updateDevice: (
    type: 'climate' | 'sensors' | 'switches' | 'shutters',
    deviceId: string,
    updates: Partial<Device>
  ) => void;
  removeDevice: (type: 'climate' | 'sensors' | 'switches' | 'shutters', deviceId: string) => void;
  duplicateDevice: (type: 'climate' | 'sensors' | 'switches' | 'shutters', deviceId: string) => void;

  // Actions for control panels
  addControlPanel: (panel: UserControlPanelConfig) => void;
  updateControlPanel: (uuid: string, updates: Partial<UserControlPanelConfig>) => void;
  removeControlPanel: (uuid: string) => void;
  duplicateControlPanel: (uuid: string) => void;

  // Import/Export
  exportConfig: () => Partial<TodoJsonStructure>;
  importConfig: (config: Partial<TodoJsonStructure>) => void;

  // Load from todo.json (initial load)
  loadFromTodoJson: (todoData: Partial<TodoJsonStructure>) => void;

  // Get merged todo.json structure
  getTodoJsonStructure: (existingTodo: TodoJsonStructure) => TodoJsonStructure;
}

export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set, get) => ({
      userDevices: {
        climate: [],
        sensors: [],
        switches: [],
        shutters: [],
      },
      userControlPanels: {},

      addDevice: (type, device) =>
        set((state) => ({
          userDevices: {
            ...state.userDevices,
            [type]: [...state.userDevices[type], { ...device, isUserAdded: true }],
          },
        })),

      updateDevice: (type, deviceId, updates) =>
        set((state) => ({
          userDevices: {
            ...state.userDevices,
            [type]: state.userDevices[type].map((d) =>
              d.id === deviceId ? { ...d, ...updates } : d
            ),
          },
        })),

      removeDevice: (type, deviceId) =>
        set((state) => ({
          userDevices: {
            ...state.userDevices,
            [type]: state.userDevices[type].filter((d) => d.id !== deviceId),
          },
        })),

      duplicateDevice: (type, deviceId) =>
        set((state) => {
          const device = state.userDevices[type].find((d) => d.id === deviceId);
          if (!device) return state;

          const duplicated = {
            ...device,
            id: `${device.id}_copy_${Date.now()}`,
            name: `${device.name} (Copy)`,
          };

          return {
            userDevices: {
              ...state.userDevices,
              [type]: [...state.userDevices[type], duplicated],
            },
          };
        }),

      addControlPanel: (panel) =>
        set((state) => ({
          userControlPanels: {
            ...state.userControlPanels,
            [panel.uuid]: { ...panel, isUserAdded: true },
          },
        })),

      updateControlPanel: (uuid, updates) =>
        set((state) => {
          // If panel exists in userControlPanels, merge updates
          // If not (it's from existing panels), add it as a new entry
          const existing = state.userControlPanels[uuid];
          const newPanel: UserControlPanelConfig = existing
            ? { ...existing, ...updates }
            : { uuid, name: '', states: {}, ...updates } as UserControlPanelConfig;

          return {
            userControlPanels: {
              ...state.userControlPanels,
              [uuid]: newPanel,
            },
          };
        }),

      removeControlPanel: (uuid) =>
        set((state) => {
          const { [uuid]: removed, ...rest } = state.userControlPanels;
          return { userControlPanels: rest };
        }),

      duplicateControlPanel: (uuid) =>
        set((state) => {
          const panel = state.userControlPanels[uuid];
          if (!panel) return state;

          const newUuid = generateUUID();
          const duplicated = {
            ...panel,
            uuid: newUuid,
            name: `${panel.name} (Copy)`,
          };

          return {
            userControlPanels: {
              ...state.userControlPanels,
              [newUuid]: duplicated,
            },
          };
        }),

      exportConfig: () => {
        const state = get();
        return {
          userDevices: state.userDevices,
          userControlPanels: state.userControlPanels,
        };
      },

      importConfig: (config) =>
        set((state) => ({
          userDevices: config.userDevices || state.userDevices,
          userControlPanels: config.userControlPanels || state.userControlPanels,
        })),

      loadFromTodoJson: (todoData) =>
        set({
          userDevices: todoData.userDevices || {
            climate: [],
            sensors: [],
            switches: [],
            shutters: [],
          },
          userControlPanels: todoData.userControlPanels || {},
        }),

      getTodoJsonStructure: (existingTodo) => {
        const state = get();
        return {
          ...existingTodo,
          userDevices: state.userDevices,
          userControlPanels: state.userControlPanels,
        };
      },
    }),
    {
      name: 'user-config-storage',
      version: 1,
    }
  )
);
