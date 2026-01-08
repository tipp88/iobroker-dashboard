import type { ControlPanelConfig } from '../types/controls';
import type { UserControlPanelConfig } from '../types/userConfig';

/**
 * Merges user-modified control panels with existing panels from pages.config
 * User modifications override existing panels with the same UUID
 */
export const mergeControlPanels = (
  existingPanels: ControlPanelConfig[],
  userPanels: Record<string, UserControlPanelConfig>
): ControlPanelConfig[] => {
  return existingPanels.map((panel: any) => {
    const panelId = panel.id;
    const userPanel = userPanels[panelId];

    // If user has modified this panel, use their version
    if (userPanel) {
      return {
        id: panelId,
        name: userPanel.name,
        states: userPanel.states as any,
      };
    }

    // Otherwise use the original panel from todo.json
    return panel;
  });
};
