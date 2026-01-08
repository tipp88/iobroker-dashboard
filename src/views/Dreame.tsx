import { ControlPanel } from '../components/controls/ControlPanel';
import { dreameConfig } from '../config/pages.config';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';
import { getEffectivePanelOrder, orderPanelsById } from '../config/panelOrder';

export const Dreame = () => {
  const { userControlPanels, userPanelOrder } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(dreameConfig.controlPanels, userControlPanels);
  const panelOrder = getEffectivePanelOrder('dreame', userPanelOrder).panelIdOrder;
  const orderedPanels = orderPanelsById(mergedPanels, panelOrder);

  return (
    <div className="space-y-6">
      {orderedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
