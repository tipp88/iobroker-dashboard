import { DialGauge } from '../components/devices/DialGauge';
import { DeviceList } from '../components/devices/DeviceList';
import { DeviceRow } from '../components/devices/DeviceRow';
import { DeviceTiles } from '../components/devices/DeviceTiles';
import { Card } from '../components/ui/Card';
import { mergeDevices } from '../config/deviceMerger';
import { useUserConfigStore } from '../store/userConfigStore';
import { useBulkDeviceStates } from '../hooks/useDeviceState';
import type { ClimateDevice, SensorDevice, SwitchDevice, ShutterDevice } from '../types/devices';

export const Dashboard = () => {
  // Get user devices from store
  const { userDevices } = useUserConfigStore();

  // Merge hardcoded devices with user-added devices
  const allDevices = mergeDevices(userDevices);

  // Get typed device arrays
  const climateDevices = allDevices.climate as ClimateDevice[];
  const sensorDevices = allDevices.sensors as SensorDevice[];
  const switchDevices = allDevices.switches as SwitchDevice[];
  const shutterDevices = allDevices.shutters as ShutterDevice[];

  // Initialize all device states
  const allDeviceIds = [
    ...climateDevices.flatMap(d => [d.states.currentTemp, d.states.targetTemp]),
    ...sensorDevices.map(d => d.id),
    ...switchDevices.map(d => d.id),
    ...shutterDevices.map(d => d.states.level),
  ];

  useBulkDeviceStates(allDeviceIds);

  return (
    <div className="space-y-6">
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_32%_38%] gap-4">

        {/* LEFT COLUMN: Climate Control + Quick Stats */}
        <div className="space-y-4">
          {/* Climate Control */}
          {climateDevices.map((device) => (
            <DialGauge key={device.id} device={device} />
          ))}

          {/* Quick Stats Card */}
          <Card>
            <h3 className="text-h2 text-text-primary font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Climate Devices</span>
                <span className="text-text-primary font-semibold">
                  {climateDevices.length}
                </span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Sensors</span>
                <span className="text-text-primary font-semibold">
                  {sensorDevices.length}
                </span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Switches</span>
                <span className="text-text-primary font-semibold">
                  {switchDevices.length}
                </span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Shutters</span>
                <span className="text-text-primary font-semibold">
                  {shutterDevices.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* CENTER COLUMN: Device List with Sensors & Shutters */}
        <div className="space-y-4">
          {sensorDevices.length > 0 && (
            <DeviceList title="Sensors">
              {sensorDevices.map((device) => (
                <DeviceRow
                  key={device.id}
                  id={device.id}
                  name={device.name}
                  room={device.room}
                  unit={device.unit}
                  min={0}
                  max={device.sensorType === 'temperature' ? 40 : 100}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
              ))}
            </DeviceList>
          )}

          {shutterDevices.length > 0 && (
            <DeviceList title="Shutters">
              {shutterDevices.map((device) => (
                <DeviceRow
                  key={device.id}
                  id={device.states.level}
                  name={device.name}
                  room={device.room}
                  unit="%"
                  min={0}
                  max={100}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  }
                />
              ))}
            </DeviceList>
          )}
        </div>

        {/* RIGHT COLUMN: Device Tiles + Placeholder */}
        <div className="space-y-4">
          {switchDevices.length > 0 && (
            <DeviceTiles title="Switches" devices={switchDevices} />
          )}

          {/* Camera Feed Placeholder */}
          <Card>
            <h3 className="text-h2 text-text-primary font-semibold mb-3">Security Cameras</h3>
            <div className="aspect-video bg-neutral-bg2 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
