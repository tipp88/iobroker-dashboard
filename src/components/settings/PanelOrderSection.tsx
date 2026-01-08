import { useEffect, useMemo, useState } from 'react';
import pagesData from '../../../data/todo.json';
import { EXISTING_CONTROL_PANELS } from '../../config/existingPanels.config';
import { getEffectivePanelOrder } from '../../config/panelOrder';
import { useUserConfigStore } from '../../store/userConfigStore';

type DragPayload =
  | { type: 'section'; sectionKey: string }
  | { type: 'panel'; sectionKey: string; panelId: string };

const moveItem = (items: string[], fromKey: string, toKey: string) => {
  const fromIndex = items.indexOf(fromKey);
  const toIndex = items.indexOf(toKey);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return items;

  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
};

export const PanelOrderSection = () => {
  const { userPanelOrder, setPanelOrder, resetPanelOrder } = useUserConfigStore();
  const pages = useMemo(
    () =>
      (pagesData.pages as any[]).map((page) => ({
        key: page.key,
        title: page.title || page.key,
      })),
    []
  );
  const [activePageKey, setActivePageKey] = useState(pages[0]?.key || '');
  const [sectionOrder, setSectionOrderState] = useState<string[]>([]);
  const [panelOrder, setPanelOrderState] = useState<Record<string, string[]>>({});
  const [sections, setSections] = useState<{ key: string; title: string }[]>([]);

  useEffect(() => {
    if (!activePageKey) return;
    const effective = getEffectivePanelOrder(activePageKey, userPanelOrder);
    setSections(effective.sections.map((section) => ({ key: section.key, title: section.title })));
    setSectionOrderState(effective.sectionOrder);
    setPanelOrderState(effective.panelOrder);
  }, [activePageKey, userPanelOrder]);

  const commitOrder = (nextSectionOrder: string[], nextPanelOrder: Record<string, string[]>) => {
    setSectionOrderState(nextSectionOrder);
    setPanelOrderState(nextPanelOrder);
    setPanelOrder(activePageKey, { sectionOrder: nextSectionOrder, panelOrder: nextPanelOrder });
  };

  const getPanelLabel = (panelId: string) =>
    EXISTING_CONTROL_PANELS[panelId]?.name || panelId;

  const handleDropSection = (targetKey: string, payload: DragPayload) => {
    if (payload.type !== 'section') return;
    const next = moveItem(sectionOrder, payload.sectionKey, targetKey);
    commitOrder(next, panelOrder);
  };

  const handleDropPanel = (sectionKey: string, targetPanelId: string, payload: DragPayload) => {
    if (payload.type !== 'panel' || payload.sectionKey !== sectionKey) return;
    const current = panelOrder[sectionKey] || [];
    const next = moveItem(current, payload.panelId, targetPanelId);
    commitOrder(sectionOrder, { ...panelOrder, [sectionKey]: next });
  };

  const onDragStart = (event: React.DragEvent, payload: DragPayload) => {
    event.dataTransfer.setData('application/json', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'move';
  };

  const parsePayload = (event: React.DragEvent): DragPayload | null => {
    try {
      const raw = event.dataTransfer.getData('application/json');
      return raw ? (JSON.parse(raw) as DragPayload) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h2 text-text-primary font-bold">Panel Order</h3>
          <p className="text-sm text-text-secondary">
            Drag sections or panels to reorder how they appear on a page.
          </p>
        </div>
        <button
          onClick={() => resetPanelOrder(activePageKey)}
          className="px-3 py-1.5 text-sm bg-neutral-surface3 text-text-primary rounded hover:bg-neutral-surface1 transition-colors"
        >
          Reset Page Order
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-sm text-text-secondary">Page</label>
        <select
          value={activePageKey}
          onChange={(event) => setActivePageKey(event.target.value)}
          className="px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        >
          {pages.map((page) => (
            <option key={page.key} value={page.key}>
              {page.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {sectionOrder.map((sectionKey) => {
          const section = sections.find((item) => item.key === sectionKey);
          const panels = panelOrder[sectionKey] || [];

          return (
            <div
              key={sectionKey}
              className="border border-stroke-default rounded-lg bg-neutral-surface2"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const payload = parsePayload(event);
                if (payload) {
                  handleDropSection(sectionKey, payload);
                }
              }}
            >
              <div
                className="px-4 py-3 border-b border-stroke-subtle flex items-center justify-between cursor-move"
                draggable
                onDragStart={(event) => onDragStart(event, { type: 'section', sectionKey })}
              >
                <span className="text-body text-text-primary font-medium">
                  {section?.title || sectionKey}
                </span>
                <span className="text-xs text-text-secondary">{panels.length} panels</span>
              </div>

              <div className="p-4 space-y-2">
                {panels.map((panelId) => (
                  <div
                    key={panelId}
                    className="px-3 py-2 rounded-lg bg-neutral-surface1 border border-stroke-subtle flex items-center justify-between cursor-move"
                    draggable
                    onDragStart={(event) =>
                      onDragStart(event, { type: 'panel', sectionKey, panelId })
                    }
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      const payload = parsePayload(event);
                      if (payload) {
                        handleDropPanel(sectionKey, panelId, payload);
                      }
                    }}
                  >
                    <span className="text-sm text-text-primary">{getPanelLabel(panelId)}</span>
                    <span className="text-xs text-text-secondary">{panelId}</span>
                  </div>
                ))}
                {panels.length === 0 && (
                  <p className="text-sm text-text-secondary">No panels in this section.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
