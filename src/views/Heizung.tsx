import { useViewMode } from '../contexts/ViewModeContext';
import { ControlPanel } from '../components/controls/ControlPanel';
import { getGrafanaByUid } from '../config/grafana.config';
import { heizungConfig } from '../config/pages.config';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';

export const Heizung = () => {
  const { viewMode } = useViewMode();
  const { userControlPanels } = useUserConfigStore();

  // Change View: Control Panels
  if (viewMode === 'change') {
    const mergedPanels = mergeControlPanels(heizungConfig.controlPanels, userControlPanels);

    return (
      <div className="space-y-6">
        {mergedPanels.map((panel, idx) => (
          <ControlPanel key={idx} title={panel.name} states={panel.states} />
        ))}
      </div>
    );
  }

  // Dashboard View: Grafana
  const dashboard = getGrafanaByUid(heizungConfig.grafanaKey || '');

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <p className="text-text-secondary">Dashboard not found</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] rounded-lg overflow-hidden">
      <iframe
        src={dashboard.url}
        width="100%"
        height="100%"
        className="border-0"
        title={dashboard.name}
      />
    </div>
  );
};
