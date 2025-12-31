import { ControlPanel } from '../components/controls/ControlPanel';
import { rollaedenConfig } from '../config/pages.config';
import { useUserConfigStore } from '../store/userConfigStore';
import { mergeControlPanels } from '../config/controlPanelMerger';

export const Rollaeden = () => {
  const { userControlPanels } = useUserConfigStore();
  const mergedPanels = mergeControlPanels(rollaedenConfig.controlPanels, userControlPanels);

  return (
    <div className="space-y-6">
      {mergedPanels.map((panel, idx) => (
        <ControlPanel key={idx} title={panel.name} states={panel.states} />
      ))}
    </div>
  );
};
