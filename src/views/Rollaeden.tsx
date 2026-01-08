import { ControlPanel } from '../components/controls/ControlPanel';
import { rollaedenConfig } from '../config/pages.config';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';
import { getEffectivePanelOrder, orderPanelsById } from '../config/panelOrder';

export const Rollaeden = () => {
  const { userControlPanels, userPanelOrder } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(rollaedenConfig.controlPanels, userControlPanels);
  const panelOrder = getEffectivePanelOrder('rollaeden', userPanelOrder).panelIdOrder;
  const orderedPanels = orderPanelsById(mergedPanels, panelOrder);

  return (
    <div className="space-y-6">
      {orderedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
