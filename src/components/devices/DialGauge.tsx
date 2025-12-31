import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import type { ClimateDevice } from '../../types/devices';

interface DialGaugeProps {
  device: ClimateDevice;
}

export const DialGauge = ({ device }: DialGaugeProps) => {
  const { scheme } = useColorScheme();
  const { data: currentTemp } = useDeviceState(device.states.currentTemp);
  const { data: targetTemp } = useDeviceState(device.states.targetTemp);
  const { mutate: setTargetTemp, isPending } = useDeviceControl(device.states.targetTemp);

  const current = currentTemp !== undefined ? Number(currentTemp) : 0;
  const target = targetTemp !== undefined ? Number(targetTemp) : device.config.minTemp;

  const handleIncrement = () => {
    const newValue = Math.min(device.config.maxTemp, target + device.config.step);
    setTargetTemp(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(device.config.minTemp, target - device.config.step);
    setTargetTemp(newValue);
  };

  // Calculate gauge arc
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentage = ((target - device.config.minTemp) / (device.config.maxTemp - device.config.minTemp));
  const strokeDashoffset = circumference * (1 - percentage * 0.75); // 75% of circle

  return (
    <Card className="w-full">
      <div className="flex flex-col items-center">
        <h3 className="text-h2 text-text-primary mb-4">{device.name}</h3>

        {/* SVG Gauge */}
        <div className="relative w-56 h-56">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 200 200">
            {/* Background arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#2C2C2E"
              strokeWidth="12"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
            />

            {/* Progress arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={scheme.primary}
              strokeWidth="12"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.3s ease',
                filter: `drop-shadow(0 0 8px ${scheme.glow})`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-display font-bold text-text-primary">
              {target.toFixed(1)}
            </span>
            <span className="text-body text-text-secondary">{device.config.unit}</span>

            <div className="mt-2 text-caption text-text-muted">
              Current: {current.toFixed(1)}{device.config.unit}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="icon"
            onClick={handleDecrement}
            disabled={isPending || target <= device.config.minTemp}
            className="w-10 h-10 bg-neutral-surface2 hover:bg-neutral-surface3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </Button>

          <span className="text-h2 text-text-primary font-semibold w-16 text-center">
            {target.toFixed(1)}°
          </span>

          <Button
            variant="icon"
            onClick={handleIncrement}
            disabled={isPending || target >= device.config.maxTemp}
            className="w-10 h-10 bg-neutral-surface2 hover:bg-neutral-surface3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
};
