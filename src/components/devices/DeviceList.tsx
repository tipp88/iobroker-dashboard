import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface DeviceListProps {
  title: string;
  children: ReactNode;
}

export const DeviceList = ({ title, children }: DeviceListProps) => {
  return (
    <Card>
      <h3 className="text-h2 text-text-primary font-semibold mb-4">{title}</h3>
      <div className="space-y-0">
        {children}
      </div>
    </Card>
  );
};
