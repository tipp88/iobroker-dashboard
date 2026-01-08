import pagesData from '../../data/todo.json';
import type { UserPanelOrder } from '../types/userConfig';

export interface PageSection {
  key: string;
  title: string;
  panelIds: string[];
}

const getPage = (pageKey: string) =>
  (pagesData.pages as any[]).find((page) => page.key === pageKey);

export const getPageSections = (pageKey: string): PageSection[] => {
  const page = getPage(pageKey);
  if (!page) return [];

  const layout = page.changeView?.layout || page.views?.change?.layout;
  if (!layout?.sections) return [];

  return layout.sections.map((section: any) => ({
    key: section.key || section.title,
    title: section.title || section.key,
    panelIds: section.controlPanelIds || section.panelIds || [],
  }));
};

const mergeOrder = (base: string[], override?: string[]) => {
  if (!override || override.length === 0) return base;
  const filtered = override.filter((item) => base.includes(item));
  const missing = base.filter((item) => !filtered.includes(item));
  return [...filtered, ...missing];
};

export const getEffectivePanelOrder = (
  pageKey: string,
  userPanelOrder: Record<string, UserPanelOrder>
) => {
  const sections = getPageSections(pageKey);
  const defaultSectionOrder = sections.map((section) => section.key);
  const defaultPanelOrder = sections.reduce<Record<string, string[]>>((acc, section) => {
    acc[section.key] = section.panelIds;
    return acc;
  }, {});

  const userOrder = userPanelOrder[pageKey];
  const sectionOrder = mergeOrder(defaultSectionOrder, userOrder?.sectionOrder);
  const panelOrder = sectionOrder.reduce<Record<string, string[]>>((acc, sectionKey) => {
    const basePanels = defaultPanelOrder[sectionKey] || [];
    acc[sectionKey] = mergeOrder(basePanels, userOrder?.panelOrder?.[sectionKey]);
    return acc;
  }, {});

  const panelIdOrder = sectionOrder.flatMap((sectionKey) => panelOrder[sectionKey] || []);

  return {
    sections,
    sectionOrder,
    panelOrder,
    panelIdOrder,
  };
};

export const orderPanelsById = <T extends { id?: string }>(
  panels: T[],
  panelIdOrder: string[]
) => {
  if (!panelIdOrder.length) return panels;

  const panelMap = new Map(panels.map((panel) => [panel.id, panel]));
  const ordered: T[] = [];

  panelIdOrder.forEach((id) => {
    const panel = panelMap.get(id);
    if (panel) {
      ordered.push(panel);
      panelMap.delete(id);
    }
  });

  return [...ordered, ...panelMap.values()];
};
