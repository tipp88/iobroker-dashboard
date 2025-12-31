import type { ReactNode } from 'react';
import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { Slider } from '../ui/Slider';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';

interface DeviceRowProps {
  id: string;
  name: string;
  room: string;
  icon: ReactNode;
  min?: number;
  max?: number;
  unit?: string;
}

export const DeviceRow = ({
  id,
  name,
  room,
  icon,
  min = 0,
  max = 100,
  unit = '',
}: DeviceRowProps) => {
  const { scheme } = useColorScheme();
  const { data } = useDeviceState(id);
  const { mutate: setValue } = useDeviceControl(id);

  const value = data !== undefined ? Number(data) : min;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-stroke-subtle last:border-0">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${scheme.primary}33`, color: scheme.primary }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-body text-text-primary font-medium truncate">{name}</div>
        <div className="text-caption text-text-muted">{room}</div>
      </div>

      {/* Slider */}
      <div className="w-32">
        <Slider
          value={value}
          onChange={setValue}
          onChangeComplete={setValue}
          min={min}
          max={max}
        />
      </div>

      {/* Value Display */}
      <div className="w-16 text-right text-body text-text-primary font-semibold">
        {value.toFixed(1)}{unit}
      </div>
    </div>
  );
};
