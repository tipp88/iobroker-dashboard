import { ControlPanel } from '../components/controls/ControlPanel';
import { lueftungConfig } from '../config/pages.config';
import { BatteryStatus } from '../components/devices/BatteryStatus';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';
import { getEffectivePanelOrder, orderPanelsById } from '../config/panelOrder';

export const Lueftung = () => {
  const { userControlPanels, userPanelOrder } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(lueftungConfig.controlPanels || [], userControlPanels);
  const panelOrder = getEffectivePanelOrder('lueftung', userPanelOrder).panelIdOrder;
  const orderedPanels = orderPanelsById(mergedPanels, panelOrder);

  return (
    <div className="space-y-6">
      {/* Battery Status Display */}
      <BatteryStatus
        stateId="zigbee.0.a4c13842f717d048.battery"
        batteryLevelStateId="zigbee.0.a4c13842f717d048.battery"
      />

      {/* Control Panels */}
      {orderedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
