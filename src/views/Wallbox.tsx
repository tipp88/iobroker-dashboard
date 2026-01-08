import { ControlPanel } from '../components/controls/ControlPanel';
import { wallboxConfig } from '../config/pages.config';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';
import { getEffectivePanelOrder, orderPanelsById } from '../config/panelOrder';

export const Wallbox = () => {
  const { userControlPanels, userPanelOrder } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(wallboxConfig.controlPanels, userControlPanels);
  const panelOrder = getEffectivePanelOrder('wallbox', userPanelOrder).panelIdOrder;
  const orderedPanels = orderPanelsById(mergedPanels, panelOrder);

  return (
    <div className="space-y-6">
      {orderedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
