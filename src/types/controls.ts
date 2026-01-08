export type ActionElementType =
  | 'SwitchAction'
  | 'TimePickerAction'
  | 'DropdownAction'
  | 'InputAction'
  | 'ButtonAction';

export type BodyElementType = 'LevelBody' | 'BlindLevelAction';

export interface StateConfig {
  stateKey: string;
  showState?: boolean;
  action?: string;
  state: string;
  label: string;
  unit?: string;
  bodyElement?: BodyElementType;
  actionElement?: ActionElementType;
  properties?: {
    min?: number;
    max?: number;
    options?: Array<{ value: string | number; label: string }>;
  };
  LevelBodyConfig?: {
    step?: string;
  };
  displayAs?: Record<string | number, string>;
  inverted?: boolean;
}

export interface ControlPanelConfig {
  id?: string;
  name: string;
  states: Record<string, StateConfig>;
}

export interface PageConfig {
  key: string;
  name: string;
  path: string;
  dashboardView: 'grafana' | 'sameAsChange';
  grafanaKey?: string;
  changeView: 'controls';
  controlPanels: ControlPanelConfig[];
}

export interface ControlItemConfig {
  label: string;
  stateId: string;
  showState?: boolean;
  unit?: string;
}

export interface SwitchControlItemProps extends ControlItemConfig {}

export interface SliderControlItemProps extends ControlItemConfig {
  min: number;
  max: number;
  step?: number;
}

export interface TimePickerControlItemProps {
  label: string;
  stateId: string;
}

export interface DropdownControlItemProps extends ControlItemConfig {
  options: Array<{ value: string | number; label: string }>;
  displayAs?: Record<string | number, string>;
}

export interface NumberInputControlItemProps extends ControlItemConfig {
  min?: number;
  max?: number;
  step?: number;
}

export interface BlindControlItemProps {
  label: string;
  stateId: string;
  inverted?: boolean;
}
