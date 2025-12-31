import { ControlPanel } from '../components/controls/ControlPanel';
import { lueftungConfig } from '../config/pages.config';
import { BatteryStatus } from '../components/devices/BatteryStatus';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';

export const Lueftung = () => {
  const { userControlPanels } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(lueftungConfig.controlPanels || [], userControlPanels);

  return (
    <div className="space-y-6">
      {/* Battery Status Display */}
      <BatteryStatus
        stateId="zigbee.0.a4c13842f717d048.battery"
        batteryLevelStateId="zigbee.0.a4c13842f717d048.battery"
      />

      {/* Control Panels */}
      {mergedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
