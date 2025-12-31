import { useViewMode } from '../contexts/ViewModeContext';
import { SolarControls } from '../components/devices/SolarControls';
import { GRAFANA_DASHBOARDS } from '../config/grafana.config';

export const Solar = () => {
  const { viewMode } = useViewMode();

  // Change View: Show SolarControls
  if (viewMode === 'change') {
    return (
      <div className="space-y-6">
        <SolarControls />
      </div>
    );
  }

  // Dashboard View: Energy Monitoring Grafana
  const energyDashboard = GRAFANA_DASHBOARDS[1]; // Index 1 = Energy Monitoring (QTY4PR14z)

  return (
    <div className="h-[calc(100vh-6rem)] rounded-lg overflow-hidden">
      <iframe
        src={energyDashboard.url}
        width="100%"
        height="100%"
        className="border-0"
        title={energyDashboard.name}
      />
    </div>
  );
};
