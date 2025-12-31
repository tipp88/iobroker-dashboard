import pagesData from '../../data/todo.json';

// Export existing control panels from todo.json
export const EXISTING_CONTROL_PANELS = (pagesData.controlPanels || {}) as Record<string, any>;

// Helper to get all panel UUIDs
export const getExistingPanelIds = (): string[] => {
  return Object.keys(EXISTING_CONTROL_PANELS);
};

// Helper to get a specific panel
export const getExistingPanel = (uuid: string) => {
  return EXISTING_CONTROL_PANELS[uuid];
};

// Helper to find which pages and sections use a control panel
export const getPanelUsage = (panelUuid: string): Array<{ page: string; section: string }> => {
  const usage: Array<{ page: string; section: string }> = [];

  (pagesData.pages as any[]).forEach((page: any) => {
    // Check both dashboardView and changeView
    const views = [page.dashboardView, page.changeView].filter(Boolean);

    views.forEach((view) => {
      if (view?.layout?.sections) {
        view.layout.sections.forEach((section: any) => {
          const panelIds = section.controlPanelIds || [];
          if (panelIds.includes(panelUuid)) {
            usage.push({
              page: page.title || page.key,
              section: section.title || section.key,
            });
          }
        });
      }
    });
  });

  // Remove duplicates
  return Array.from(new Map(usage.map((item) => [`${item.page}|${item.section}`, item])).values());
};
