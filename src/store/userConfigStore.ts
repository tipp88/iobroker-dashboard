import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Device } from '../types/devices';
import type {
  UserControlPanelConfig,
  UserDevicesConfig,
  TodoJsonStructure,
  UserPanelOrder,
} from '../types/userConfig';
import type { LinkConfig } from '../types/links';
import { generateUUID } from '../utils/uuid';
import { DEFAULT_LINKS } from '../config/links.config';

interface UserConfigState {
  // User devices
  userDevices: UserDevicesConfig;

  // User control panels
  userControlPanels: Record<string, UserControlPanelConfig>;

  // User links
  userLinks: LinkConfig[];

  // Panel order overrides by page
  userPanelOrder: Record<string, UserPanelOrder>;

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

  // Actions for links
  addLink: (link: LinkConfig) => void;
  updateLink: (id: string, updates: Partial<LinkConfig>) => void;
  removeLink: (id: string) => void;
  replaceLinks: (links: LinkConfig[]) => void;

  // Actions for panel ordering
  setPanelOrder: (pageKey: string, order: UserPanelOrder) => void;
  resetPanelOrder: (pageKey: string) => void;

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
      userLinks: DEFAULT_LINKS,
      userPanelOrder: {},

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

      addLink: (link) =>
        set((state) => ({
          userLinks: [...state.userLinks, link],
        })),

      updateLink: (id, updates) =>
        set((state) => ({
          userLinks: state.userLinks.map((link) =>
            link.id === id ? { ...link, ...updates } : link
          ),
        })),

      removeLink: (id) =>
        set((state) => ({
          userLinks: state.userLinks.filter((link) => link.id !== id),
        })),

      replaceLinks: (links) =>
        set(() => ({
          userLinks: links,
        })),

      setPanelOrder: (pageKey, order) =>
        set((state) => ({
          userPanelOrder: {
            ...state.userPanelOrder,
            [pageKey]: order,
          },
        })),

      resetPanelOrder: (pageKey) =>
        set((state) => {
          const { [pageKey]: removed, ...rest } = state.userPanelOrder;
          return { userPanelOrder: rest };
        }),

      exportConfig: () => {
        const state = get();
        return {
          userDevices: state.userDevices,
          userControlPanels: state.userControlPanels,
          userLinks: state.userLinks,
          userPanelOrder: state.userPanelOrder,
        };
      },

      importConfig: (config) =>
        set((state) => ({
          userDevices: config.userDevices || state.userDevices,
          userControlPanels: config.userControlPanels || state.userControlPanels,
          userLinks: config.userLinks || state.userLinks,
          userPanelOrder: config.userPanelOrder || state.userPanelOrder,
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
          userLinks: todoData.userLinks || DEFAULT_LINKS,
          userPanelOrder: todoData.userPanelOrder || {},
        }),

      getTodoJsonStructure: (existingTodo) => {
        const state = get();
        return {
          ...existingTodo,
          userDevices: state.userDevices,
          userControlPanels: state.userControlPanels,
          userLinks: state.userLinks,
          userPanelOrder: state.userPanelOrder,
        };
      },
    }),
    {
      name: 'user-config-storage',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as UserConfigState;
        return {
          ...state,
          userLinks: state.userLinks || DEFAULT_LINKS,
          userPanelOrder: state.userPanelOrder || {},
        };
      },
    }
  )
);
