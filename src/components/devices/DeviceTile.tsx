import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { Toggle } from '../ui/Toggle';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import type { SwitchDevice } from '../../types/devices';

interface DeviceTileProps {
  device: SwitchDevice;
}

export const DeviceTile = ({ device }: DeviceTileProps) => {
  const { scheme } = useColorScheme();
  const { data, isLoading } = useDeviceState(device.id);
  const { mutate: setState, isPending } = useDeviceControl(device.id);

  const isOn = Boolean(data);

  return (
    <div className="bg-neutral-surface0/80 rounded-xl p-4 border border-stroke-default hover:border-stroke-strong transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isOn ? `${scheme.primary}33` : '#2C2C2E',
            color: isOn ? scheme.primary : '#6B6B6F'
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <Toggle
          checked={isOn}
          onChange={(checked) => setState(checked)}
          disabled={isLoading || isPending}
          size="sm"
        />
      </div>

      <h4 className="text-body text-text-primary font-medium mb-1">{device.name}</h4>
      <p className="text-caption text-text-muted">{device.room}</p>

      <div className="mt-3 pt-3 border-t border-stroke-subtle">
        <span
          className="text-caption font-semibold"
          style={{ color: isOn ? scheme.primary : '#6B6B6F' }}
        >
          {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};
