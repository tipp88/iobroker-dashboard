import { useState } from 'react';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import { Toggle } from '../ui/Toggle';
import { Slider } from '../ui/Slider';
import { Dropdown } from '../ui/Dropdown';
import { NumberInput } from '../ui/NumberInput';
import type {
  SwitchControlItemProps,
  SliderControlItemProps,
  TimePickerControlItemProps,
  DropdownControlItemProps,
  NumberInputControlItemProps,
  BlindControlItemProps,
  ControlItemConfig,
} from '../../types/controls';

export const SwitchControlItem = ({
  label,
  stateId,
  showState,
  unit,
}: SwitchControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  const isOn = Boolean(data);

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isOn ? 'bg-green-500/20' : 'bg-neutral-surface2'
      }`}>
        <svg
          className={`w-6 h-6 ${isOn ? 'text-green-500' : 'text-text-secondary'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        {showState && data !== undefined && (
          <p className="text-caption text-text-secondary">
            {String(data)} {unit}
          </p>
        )}
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-secondary">{isOn ? 'On' : 'Off'}</span>
        <Toggle
          checked={isOn}
          onChange={(val) => setState(val)}
          disabled={isPending || isLoading}
        />
      </div>
    </div>
  );
};

export const SliderControlItem = ({
  label,
  stateId,
  min = 0,
  max = 100,
  step = 1,
  unit,
  showState,
}: SliderControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);
  const [localValue, setLocalValue] = useState<number | null>(null);

  let value = min ?? 0;
  if (typeof data === 'number' && !isNaN(data)) {
    value = data;
  } else if (data !== null && data !== undefined) {
    const parsed = parseFloat(String(data));
    value = !isNaN(parsed) ? parsed : min;
  }

  // Use local value while dragging, otherwise use server value
  const displayValue = localValue !== null ? localValue : value;

  // Calculate decimal places from step value
  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      return str.split('.')[1].length;
    }
    return 0;
  };

  const decimals = getDecimalPlaces(step);

  // Safely format the display value
  const formatValue = (val: any): string => {
    if (typeof val === 'number' && !isNaN(val)) {
      return val.toFixed(decimals);
    }
    return '—';
  };

  return (
    <div className="p-3 rounded-lg bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-body text-text-primary font-medium">{label}</p>
        {showState && (
          <p className="text-body text-text-secondary">
            {formatValue(displayValue)} {unit}
          </p>
        )}
      </div>
      <Slider
        value={typeof displayValue === 'number' && !isNaN(displayValue) ? displayValue : (min ?? 0)}
        onChange={(val) => setLocalValue(val)}
        onChangeComplete={(val) => {
          setLocalValue(null);
          setState(val);
        }}
        min={min ?? 0}
        max={max ?? 100}
        step={step}
        disabled={isPending || isLoading}
        showValue={false}
      />
    </div>
  );
};

export const TimePickerControlItem = ({
  label,
  stateId,
}: TimePickerControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  const timeValue = typeof data === 'string' ? data : '';

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        <input
          type="time"
          value={timeValue}
          onChange={(e) => setState(e.target.value)}
          disabled={isPending || isLoading}
          className="px-3 py-2 rounded-lg bg-neutral-surface2 border border-stroke-default text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export const DropdownControlItem = ({
  label,
  stateId,
  options,
  showState,
  displayAs,
}: DropdownControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  const currentValue = data !== undefined ? data : '';
  const displayValue = displayAs?.[currentValue] || currentValue;

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20">
        <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        {showState && displayValue && (
          <p className="text-caption text-text-secondary mb-1">{String(displayValue)}</p>
        )}
        <Dropdown
          value={currentValue}
          onChange={(val) => setState(val)}
          options={options}
          disabled={isPending || isLoading}
        />
      </div>
    </div>
  );
};

export const NumberInputControlItem = ({
  label,
  stateId,
  min,
  max,
  step = 1,
  unit,
}: NumberInputControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  let value = 0;
  if (typeof data === 'number' && !isNaN(data)) {
    value = data;
  } else if (data !== null && data !== undefined) {
    const parsed = parseFloat(String(data));
    value = !isNaN(parsed) ? parsed : 0;
  }

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/20">
        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        <NumberInput
          value={value}
          onChange={(val) => setState(val)}
          min={min}
          max={max}
          step={step}
          unit={unit}
          disabled={isPending || isLoading}
        />
      </div>
    </div>
  );
};

export const BlindControlItem = ({
  label,
  stateId,
  inverted = false,
}: BlindControlItemProps) => {
  const { data, isLoading } = useDeviceState(stateId);
  const { mutate: setState, isPending } = useDeviceControl(stateId);
  const [localValue, setLocalValue] = useState<number | null>(null);

  let rawValue = 0;
  if (typeof data === 'number' && !isNaN(data)) {
    rawValue = data;
  } else if (data !== null && data !== undefined) {
    const parsed = parseFloat(String(data));
    rawValue = !isNaN(parsed) ? parsed : 0;
  }

  const serverDisplayValue = inverted ? 100 - rawValue : rawValue;
  const displayValue = localValue !== null ? localValue : serverDisplayValue;

  const handleChange = (val: number) => {
    setLocalValue(val);
  };

  const handleChangeComplete = (val: number) => {
    const actualValue = inverted ? 100 - val : val;
    setLocalValue(null);
    setState(actualValue);
  };

  return (
    <div className="p-3 rounded-lg bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <p className="text-body text-text-primary font-medium">{label}</p>
        <p className="text-body text-text-secondary">{Math.round(displayValue)}%</p>
      </div>
      <Slider
        value={displayValue}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
        min={0}
        max={100}
        step={1}
        disabled={isPending || isLoading}
        showValue={false}
      />
    </div>
  );
};

export const ReadOnlyControlItem = ({
  label,
  stateId,
  unit,
  displayAs,
}: ControlItemConfig & { displayAs?: Record<string | number, string> }) => {
  const { data, isLoading } = useDeviceState(stateId);

  let displayValue = '';
  if (data !== null && data !== undefined) {
    // Use display mapping if available
    displayValue = displayAs?.[data] || String(data);
  }

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/90 flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-500/20">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        <p className="text-h2 text-text-secondary font-bold">
          {isLoading ? '...' : `${displayValue} ${unit || ''}`}
        </p>
      </div>
    </div>
  );
};

export const ButtonControlItem = ({
  label,
  stateId,
}: ControlItemConfig) => {
  const { mutate: setState, isPending } = useDeviceControl(stateId);

  return (
    <div className="p-4 rounded-2xl bg-neutral-surface1/80 hover:bg-neutral-surface2/80 transition-colors flex flex-col gap-3 border border-white/10">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-body text-text-primary font-semibold">{label}</p>
        <button
          onClick={() => setState(true)}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Wird ausgeführt...' : 'Ausführen'}
        </button>
      </div>
    </div>
  );
};
