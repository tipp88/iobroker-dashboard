import pagesData from '../../../ToAdd/todo.json';
import type { PageConfig, ControlPanelConfig, StateConfig } from '../types/controls';

// Transform state from JSON format to our StateConfig format
const transformState = (key: string, state: any, panelFunction?: string): StateConfig => {
  const config: StateConfig = {
    stateKey: key,
    showState: state.showState,
    state: state.state,
    label: state.label || key,
    unit: state.unit,
    bodyElement: state.bodyElement,
    actionElement: state.actionElement,
  };

  // Use action if provided for control operations
  if (state.action && state.action !== '') {
    config.action = state.action;
  }

  // Handle properties
  if (state.properties) {
    config.properties = {
      min: state.properties.min ? parseFloat(state.properties.min) : undefined,
      max: state.properties.max ? parseFloat(state.properties.max) : undefined,
    };

    // Create options from display mapping if it's a dropdown
    if (state.display && state.actionElement === 'DropdownAction') {
      config.properties.options = Object.entries(state.display).map(([value, label]) => ({
        value,
        label: String(label),
      }));
    }
  }

  // Handle LevelBodyConfig
  if (state.LevelBodyConfig) {
    config.LevelBodyConfig = {
      step: state.LevelBodyConfig.step,
    };
  }

  // Handle display mappings for dropdowns
  if (state.display) {
    config.displayAs = state.display;

    // If we have display but no options yet, create them
    if (!config.properties?.options && state.actionElement === 'DropdownAction') {
      if (!config.properties) config.properties = {};
      config.properties.options = Object.entries(state.display).map(([value, label]) => ({
        value,
        label: String(label),
      }));
    }
  }

  // Convert blind level inputs to sliders (do this last after all properties are set)
  if (panelFunction === 'blind' && key === 'level' && state.actionElement === 'InputAction') {
    config.bodyElement = 'LevelBody';
    config.actionElement = undefined;
    if (!config.properties) {
      config.properties = {};
    }
    if (!config.properties.min) config.properties.min = 0;
    if (!config.properties.max) config.properties.max = 100;
    if (!config.LevelBodyConfig) {
      config.LevelBodyConfig = { step: '1' };
    }
  }

  return config;
};

// Transform the raw JSON data into our typed PageConfig format
const transformPages = (): Record<string, PageConfig> => {
  const result: Record<string, PageConfig> = {};

  pagesData.pages.forEach((page: any) => {
    // Get control panels for this page
    const controlPanels: ControlPanelConfig[] = [];

    // New JSON structure uses changeView instead of views.change
    const changeLayout = page.changeView?.layout || page.views?.change?.layout;

    if (changeLayout?.sections) {
      changeLayout.sections.forEach((section: any) => {
        // New JSON uses controlPanelIds instead of panelIds
        const panelIds = section.controlPanelIds || section.panelIds || [];

        panelIds.forEach((panelId: string) => {
          // Control panels are now at root level: pagesData.controlPanels
          const panel = (pagesData.controlPanels as any)?.[panelId] || (page.controlPanels as any)?.[panelId];

          if (panel && panel.states) {
            // Transform all states in this panel
            const transformedStates: Record<string, StateConfig> = {};
            Object.entries(panel.states).forEach(([key, state]: [string, any]) => {
              transformedStates[key] = transformState(key, state, panel.function);
            });

            controlPanels.push({
              name: panel.name || section.title,
              states: transformedStates,
              id: panelId, // Preserve panel ID for merging with user modifications
            } as any);
          }
        });
      });
    }

    // Determine dashboard view type
    // New JSON uses dashboardView.type instead of views.dashboard.type
    const dashboardType = page.dashboardView?.type || page.views?.dashboard?.type;
    const dashboardView = dashboardType === 'grafana' ? 'grafana' : 'sameAsChange';
    const grafanaKey = page.dashboardView?.grafanaUid || page.views?.dashboard?.grafanaDashboardUid;

    result[page.key] = {
      key: page.key,
      name: page.title || page.name,
      path: page.route || `/${page.key}`,
      dashboardView,
      grafanaKey,
      changeView: 'controls',
      controlPanels,
    };
  });

  return result;
};

export const PAGES_CONFIG = transformPages();

// Export individual page configs for convenience
export const heizungConfig = PAGES_CONFIG.heizung;
export const klimaanlageConfig = PAGES_CONFIG.klimaanlage;
export const lueftungConfig = PAGES_CONFIG.lueftung;
export const wasserConfig = PAGES_CONFIG.wasser;
export const autosConfig = PAGES_CONFIG.autos;
export const dreameConfig = PAGES_CONFIG.dreame;
export const wallboxConfig = PAGES_CONFIG.wallbox;
export const rollaedenConfig = PAGES_CONFIG.rollaeden;
