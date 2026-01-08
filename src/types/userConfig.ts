import type { ClimateDevice, SensorDevice, SwitchDevice, ShutterDevice } from './devices';
import type { LinkConfig } from './links';

export interface UserDevicesConfig {
  climate: ClimateDevice[];
  sensors: SensorDevice[];
  switches: SwitchDevice[];
  shutters: ShutterDevice[];
}

export interface StateConfig {
  stateKey: string;
  showState: boolean;
  state: string;
  label?: string;
  unit?: string;
  bodyElement?: string;
  actionElement?: string;
  action?: string;
  properties?: {
    min?: number;
    max?: number;
    options?: Array<{ value: string | number; label: string }>;
  };
  LevelBodyConfig?: {
    step: string;
    markStep?: string;
  };
  displayAs?: Record<string | number, string>;
}

export interface UserControlPanelConfig {
  uuid: string;
  name: string;
  icon?: string;
  label?: string;
  function?: string;
  isUserAdded?: boolean;
  states: Record<string, StateConfig>;
}

export interface TodoJsonStructure {
  plan?: {
    type: string;
    notes?: string[];
  };
  pages: any[];
  controlPanels: Record<string, any>;
  userDevices?: UserDevicesConfig;
  userControlPanels?: Record<string, UserControlPanelConfig>;
  userLinks?: LinkConfig[];
}

export interface DeviceValidationResult {
  isValid: boolean;
  stateId: string;
  error?: string;
  value?: any;
}

export type ActionElementType =
  | 'SwitchAction'
  | 'TimePickerAction'
  | 'DropdownAction'
  | 'InputAction'
  | 'ButtonAction';

export type BodyElementType = 'LevelBody' | 'BlindLevelAction';
