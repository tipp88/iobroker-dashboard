import { useState, useEffect } from 'react';
import { useDeviceState } from '../../hooks/useDeviceState';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import Icon from '@mdi/react';
import { mdiSnowflake, mdiWhiteBalanceSunny, mdiFan } from '@mdi/js';

interface AirConditionerCardProps {
  title: string;
  powerStateId: string;
  modeStateId: string;
  currentTempStateId: string;
  targetTempStateId: string;
  fanSpeedStateId: string;
  connectionStateId: string;
  minTemp?: number;
  maxTemp?: number;
}

export const AirConditionerCard = ({
  title,
  powerStateId,
  modeStateId,
  currentTempStateId,
  targetTempStateId,
  fanSpeedStateId,
  connectionStateId,
  minTemp = 16,
  maxTemp = 31,
}: AirConditionerCardProps) => {
  const { data: powerData, isLoading: powerLoading } = useDeviceState(powerStateId);
  const { data: modeData } = useDeviceState(modeStateId);
  const { data: currentTemp } = useDeviceState(currentTempStateId);
  const { data: targetTemp } = useDeviceState(targetTempStateId);
  const { data: fanSpeedData } = useDeviceState(fanSpeedStateId);
  const { data: connectionData } = useDeviceState(connectionStateId);

  const { mutate: setPower, isPending: powerPending } = useDeviceControl(powerStateId);
  const { mutate: setMode, isPending: modePending } = useDeviceControl(modeStateId);
  const { mutate: setTargetTemp } = useDeviceControl(targetTempStateId);
  const { mutate: setFanSpeed, isPending: fanPending } = useDeviceControl(fanSpeedStateId);

  const [localTemp, setLocalTemp] = useState(20);

  const isPowerOn = Boolean(powerData);
  const currentMode = modeData !== undefined ? Number(modeData) : 4; // default to auto
  const currentTemperature = currentTemp !== undefined ? Number(currentTemp) : 0;
  const currentFanSpeed = fanSpeedData !== undefined ? Number(fanSpeedData) : 7; // default to auto
  const isConnected = Boolean(connectionData);

  useEffect(() => {
    if (targetTemp !== undefined) {
      setLocalTemp(Number(targetTemp));
    }
  }, [targetTemp]);

  // Mode mapping: 0=cold, 1=hot, 2=wet, 3=wind, 4=auto
  const modes = [
    { value: 4, label: 'Auto', icon: null },
    { value: 0, label: 'Cool', icon: mdiSnowflake },
    { value: 1, label: 'Heat', icon: mdiWhiteBalanceSunny },
    { value: 3, label: 'Fan', icon: mdiFan },
  ];

  // Fan speed mapping: 0=strong, 1=high, 2=mid_high, 3=mid, 4=mid_low, 5=low, 6=mute, 7=auto
  const fanSpeeds = [
    { value: 7, label: 'Auto' },
    { value: 0, label: 'Strong' },
    { value: 1, label: 'High' },
    { value: 2, label: 'Mid-High' },
    { value: 3, label: 'Mid' },
    { value: 4, label: 'Mid-Low' },
    { value: 5, label: 'Low' },
    { value: 6, label: 'Mute' },
  ];

  const handlePowerToggle = (checked: boolean) => {
    setPower(checked);
  };

  const handleModeChange = (modeValue: number) => {
    setMode(modeValue);
  };

  const handleTempIncrease = () => {
    if (localTemp < maxTemp) {
      const newTemp = localTemp + 1;
      setLocalTemp(newTemp);
      setTargetTemp(newTemp);
    }
  };

  const handleTempDecrease = () => {
    if (localTemp > minTemp) {
      const newTemp = localTemp - 1;
      setLocalTemp(newTemp);
      setTargetTemp(newTemp);
    }
  };

  const handleFanSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = Number(e.target.value);
    setFanSpeed(speed);
  };

  // Calculate percentage for circular gauge
  const tempRange = maxTemp - minTemp;
  const tempPercentage = ((currentTemperature - minTemp) / tempRange) * 100;
  const circumference = 2 * Math.PI * 70; // radius 70
  const strokeDashoffset = circumference - (tempPercentage / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 relative">
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-h2 text-text-primary font-semibold">{title}</h3>
            <div
              className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              title={isConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
          <Toggle
            checked={isPowerOn}
            onChange={handlePowerToggle}
            disabled={powerPending || powerLoading}
          />
        </div>

        {/* Circular Temperature Gauge */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-48 h-48 pointer-events-none">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke={isPowerOn ? '#06b6d4' : 'rgba(255,255,255,0.2)'}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-1">
                  {Math.round(currentTemperature)}°
                </div>
                <div className="text-caption text-text-secondary">temperature</div>
              </div>
            </div>

            {/* Tick marks */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) - 90; // Start from top
                const x1 = 96 + 85 * Math.cos((angle * Math.PI) / 180);
                const y1 = 96 + 85 * Math.sin((angle * Math.PI) / 180);
                const x2 = 96 + 75 * Math.cos((angle * Math.PI) / 180);
                const y2 = 96 + 75 * Math.sin((angle * Math.PI) / 180);

                return (
                  <svg key={i} className="absolute inset-0">
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                  </svg>
                );
              })}
            </div>
          </div>

          {/* Min/Max Temperature */}
          <div className="flex justify-between w-48 mt-4 text-caption text-text-secondary pointer-events-none">
            <span>{minTemp}°C</span>
            <span>{maxTemp}°C</span>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleModeChange(mode.value)}
              disabled={modePending}
              className={`
                p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer
                ${
                  currentMode === mode.value
                    ? 'bg-cyan-500/20 border-2 border-cyan-500'
                    : 'bg-neutral-surface2/50 border-2 border-transparent hover:bg-neutral-surface3/50'
                }
                ${modePending ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {mode.icon ? (
                <Icon
                  path={mode.icon}
                  size={1}
                  className={currentMode === mode.value ? 'text-cyan-500' : 'text-text-secondary'}
                />
              ) : (
                <span
                  className={`text-body font-semibold ${
                    currentMode === mode.value ? 'text-cyan-500' : 'text-text-secondary'
                  }`}
                >
                  Auto
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Target Temperature Controls */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-surface2/50">
          <span className="text-body text-text-secondary">Target Temperature</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTempDecrease}
              disabled={localTemp <= minTemp}
              className={`w-10 h-10 rounded-full bg-neutral-surface3 hover:bg-cyan-500/20 text-text-primary hover:text-cyan-500 transition-colors ${
                localTemp <= minTemp ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              -
            </button>
            <span className="text-h2 font-bold text-white min-w-[60px] text-center">
              {localTemp}°C
            </span>
            <button
              onClick={handleTempIncrease}
              disabled={localTemp >= maxTemp}
              className={`w-10 h-10 rounded-full bg-neutral-surface3 hover:bg-cyan-500/20 text-text-primary hover:text-cyan-500 transition-colors ${
                localTemp >= maxTemp ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              +
            </button>
          </div>
        </div>

        {/* Fan Speed Control */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-surface2/50">
          <span className="text-body text-text-secondary">Fan Speed</span>
          <select
            value={currentFanSpeed}
            onChange={handleFanSpeedChange}
            disabled={fanPending}
            className={`bg-neutral-surface3 text-text-primary rounded-lg px-3 py-2 text-body font-medium transition-colors cursor-pointer
              hover:bg-cyan-500/20 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50
              ${fanPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {fanSpeeds.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};
