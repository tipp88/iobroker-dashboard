import type { ReactNode } from 'react';
import { useDeviceState } from '../../hooks/useDeviceState';

interface BatteryStatusProps {
  stateId: string;
  batteryLevelStateId?: string;
}

interface StatusConfig {
  label: string;
  icon: ReactNode;
  gradient: string;
  textColor: string;
  animate?: boolean;
}

interface BatteryIconProps {
  level: number;
  isCharging: boolean;
}

const BatteryIcon = ({ level, isCharging }: BatteryIconProps) => {
  // Determine battery color based on level
  const getBatteryColor = () => {
    if (level <= 20) return '#f5576c'; // Red for low
    if (level <= 50) return '#fa709a'; // Orange/Pink for medium
    if (level <= 80) return '#fee140'; // Yellow for good
    return '#4caf50'; // Green for high
  };

  const color = getBatteryColor();
  const fillHeight = Math.max(0, Math.min(100, level));

  return (
    <div className="relative w-20 h-20">
      {/* Battery outline */}
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
        {/* Battery body */}
        <rect x="15" y="25" width="70" height="60" rx="6" stroke="white" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
        {/* Battery terminal */}
        <rect x="40" y="15" width="20" height="10" rx="3" fill="white" />

        {/* Battery fill */}
        <rect
          x="20"
          y={25 + 50 - (fillHeight / 2)}
          width="60"
          height={fillHeight / 2}
          rx="3"
          fill={color}
          className={isCharging ? 'animate-pulse' : ''}
          style={{ filter: isCharging ? `drop-shadow(0 0 8px ${color})` : 'none' }}
        />

        {/* Charging bolt icon */}
        {isCharging && (
          <g className="animate-pulse">
            <path
              d="M 55 40 L 45 55 L 52 55 L 48 70 L 60 52 L 53 52 L 57 40 Z"
              fill="white"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
            />
          </g>
        )}
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold mt-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {Math.round(level)}%
        </span>
      </div>
    </div>
  );
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  '1': {
    label: 'OFF',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#667eea',
  },
  '2': {
    label: 'EMPTY',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#f5576c',
    animate: true,
  },
  '3': {
    label: 'DISCHARGING',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    textColor: '#fa709a',
  },
  '4': {
    label: 'CHARGING',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    textColor: '#30cfd0',
    animate: true,
  },
  '5': {
    label: 'FULL',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    textColor: '#4caf50',
  },
  '6': {
    label: 'HOLDING',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    textColor: '#4facfe',
  },
  '7': {
    label: 'TESTING',
    icon: (
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    textColor: '#a18cd1',
    animate: true,
  },
};

export const BatteryStatus = ({ stateId, batteryLevelStateId }: BatteryStatusProps) => {
  const { data, isLoading, error } = useDeviceState(stateId);
  const { data: batteryLevel } = useDeviceState(batteryLevelStateId || '');

  const statusKey = data !== undefined ? String(data) : '1';
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG['1'];
  const level = batteryLevel !== undefined ? Number(batteryLevel) : 0;
  const isCharging = statusKey === '4'; // Status 4 = CHARGING

  // Determine battery color based on level
  const getBatteryColor = () => {
    if (level <= 20) return '#f5576c'; // Red for low
    if (level <= 50) return '#fa709a'; // Orange/Pink for medium
    if (level <= 80) return '#fee140'; // Yellow for good
    return '#4caf50'; // Green for high
  };

  const batteryColor = batteryLevelStateId ? getBatteryColor() : status.textColor;
  const fillPercentage = batteryLevelStateId ? Math.max(0, Math.min(100, level)) : 0;

  return (
    <div className="rounded-xl relative overflow-hidden border-4 border-white/20" style={{ minHeight: '140px' }}>
      {/* Battery terminal (right side) */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-16 bg-white/30 rounded-r-lg z-20"></div>

      {/* Background (empty part) */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700 z-0"></div>

      {/* Battery fill (animated left-to-right) */}
      {batteryLevelStateId && (
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-out ${isCharging ? 'animate-pulse' : ''}`}
          style={{
            width: `${fillPercentage}%`,
            background: `linear-gradient(135deg, ${batteryColor} 0%, ${batteryColor}dd 100%)`,
            boxShadow: isCharging ? `0 0 30px ${batteryColor}80` : 'none',
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      )}

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 z-5"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <p className="text-caption text-white/90 tracking-widest font-semibold mb-4">
          BATTERY STATUS
        </p>

        {isLoading && (
          <div className="flex items-center gap-3 py-4">
            <p className="text-body text-white">Loading...</p>
          </div>
        )}

        {error && (
          <div className="py-4">
            <p className="text-body text-red-400">Failed to load battery status</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Small battery icon for visual reference */}
              {batteryLevelStateId ? (
                <BatteryIcon level={level} isCharging={isCharging} />
              ) : (
                <div
                  className={`text-white ${status.animate ? 'animate-pulse' : ''}`}
                  style={{ filter: status.animate ? 'drop-shadow(0 0 12px currentColor)' : 'none' }}
                >
                  {status.icon}
                </div>
              )}
              <div>
                <h3 className="text-display text-white font-bold tracking-tight mb-1" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
                  {status.label}
                </h3>
                <p className="text-caption text-white/70 font-medium uppercase tracking-wider">
                  State Code: {statusKey}
                </p>
              </div>
            </div>

            {/* Large percentage display */}
            {batteryLevelStateId && (
              <div className="text-right">
                <p className="text-6xl font-bold text-white" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
                  {Math.round(level)}
                  <span className="text-3xl">%</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
