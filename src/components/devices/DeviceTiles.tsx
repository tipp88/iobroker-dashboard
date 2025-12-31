import { Card } from '../ui/Card';
import { DeviceTile } from './DeviceTile';
import type { SwitchDevice } from '../../types/devices';

interface DeviceTilesProps {
  title: string;
  devices: SwitchDevice[];
}

export const DeviceTiles = ({ title, devices }: DeviceTilesProps) => {
  return (
    <Card>
      <h3 className="text-h2 text-text-primary font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {devices.map((device) => (
          <DeviceTile key={device.id} device={device} />
        ))}
      </div>
    </Card>
  );
};
