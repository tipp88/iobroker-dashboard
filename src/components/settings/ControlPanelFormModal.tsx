import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { StateValidator } from './StateValidator';
import type { UserControlPanelConfig, StateConfig, ActionElementType } from '../../types/userConfig';
import { iobrokerClient } from '../../api/iobroker';
import { generateUUID } from '../../utils/uuid';

interface ControlPanelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (panel: UserControlPanelConfig) => void;
  initialPanel?: UserControlPanelConfig;
  mode: 'add' | 'edit';
}

const ACTION_ELEMENTS: Array<{ value: ActionElementType | 'LevelBody'; label: string }> = [
  { value: 'SwitchAction', label: 'Switch (On/Off)' },
  { value: 'TimePickerAction', label: 'Time Picker' },
  { value: 'DropdownAction', label: 'Dropdown' },
  { value: 'InputAction', label: 'Input Field' },
  { value: 'ButtonAction', label: 'Button' },
  { value: 'LevelBody', label: 'Slider/Level' },
];

export const ControlPanelFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialPanel,
  mode,
}: ControlPanelFormModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [panelData, setPanelData] = useState<Partial<UserControlPanelConfig>>({
    uuid: initialPanel?.uuid || generateUUID(),
    name: initialPanel?.name || '',
    icon: initialPanel?.icon || '',
    label: initialPanel?.label || '',
    function: initialPanel?.function || '',
    states: initialPanel?.states || {},
    isUserAdded: true,
  });

  const [newStateForm, setNewStateForm] = useState<Partial<StateConfig & {
    bodyElement?: string;
    unit?: string;
    properties?: { min?: number; max?: number };
    LevelBodyConfig?: { step?: string; markStep?: string };
  }>>({
    stateKey: '',
    state: '',
    label: '',
    showState: true,
    actionElement: 'SwitchAction',
  });

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Fetch metadata when LevelBody is selected and state ID is provided
  const fetchStateMetadata = async (stateId: string) => {
    if (!stateId) return;

    setIsFetchingMetadata(true);
    try {
      const metadata = await iobrokerClient.getStateMetadata(stateId);
      if (metadata) {
        setNewStateForm((prev) => ({
          ...prev,
          unit: metadata.unit,
          properties: {
            min: metadata.min ?? 0,
            max: metadata.max ?? 100,
          },
          LevelBodyConfig: {
            step: metadata.step?.toString() || '1',
            markStep: '20',
          },
        }));
      }
    } catch (error) {
      console.error('Failed to fetch state metadata:', error);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Sync form data when initialPanel changes
  useEffect(() => {
    if (isOpen) {
      if (initialPanel) {
        setPanelData({
          uuid: initialPanel.uuid,
          name: initialPanel.name || '',
          icon: initialPanel.icon || '',
          label: initialPanel.label || '',
          function: initialPanel.function || '',
          states: initialPanel.states || {},
          isUserAdded: initialPanel.isUserAdded ?? true,
        });
      } else {
        // Reset for "Add" mode
        setPanelData({
          uuid: generateUUID(),
          name: '',
          icon: '',
          label: '',
          function: '',
          states: {},
          isUserAdded: true,
        });
      }
    }
  }, [initialPanel, isOpen]);

  if (!isOpen) return null;

  const handleAddState = () => {
    if (!newStateForm.stateKey || !newStateForm.state) {
      alert('State key and State ID are required');
      return;
    }

    const isLevelBody = newStateForm.actionElement === 'LevelBody';

    const stateConfig: any = {
      stateKey: newStateForm.stateKey,
      label: newStateForm.label || newStateForm.stateKey,
      showState: newStateForm.showState ?? true,
    };

    if (isLevelBody) {
      // For LevelBody (sliders), use 'action' instead of 'state' and set bodyElement
      stateConfig.action = newStateForm.state;
      stateConfig.bodyElement = 'LevelBody';
      stateConfig.actionElement = null;
      stateConfig.unit = newStateForm.unit;
      stateConfig.properties = newStateForm.properties;
      stateConfig.LevelBodyConfig = newStateForm.LevelBodyConfig;
    } else {
      // For other action elements, use standard 'state' field
      stateConfig.state = newStateForm.state;
      stateConfig.actionElement = newStateForm.actionElement;
    }

    setPanelData({
      ...panelData,
      states: {
        ...panelData.states,
        [newStateForm.stateKey]: stateConfig,
      },
    });

    // Reset form
    setNewStateForm({
      stateKey: '',
      state: '',
      label: '',
      showState: true,
      actionElement: 'SwitchAction',
      bodyElement: undefined,
      unit: undefined,
      properties: undefined,
      LevelBodyConfig: undefined,
    });
  };

  const handleRemoveState = (stateKey: string) => {
    if (!confirm(`Remove state "${stateKey}"?`)) return;

    const { [stateKey]: removed, ...remainingStates } = panelData.states || {};
    setPanelData({
      ...panelData,
      states: remainingStates,
    });
  };

  const handleSave = () => {
    if (!panelData.name) {
      alert('Panel name is required');
      return;
    }

    onSave(panelData as UserControlPanelConfig);
    onClose();
  };

  const stateCount = Object.keys(panelData.states || {}).length;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
      onClick={(e) => e.target === modalRef.current && onClose()}
    >
      <div className="bg-neutral-surface1 rounded-xl shadow-card border border-stroke-default w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stroke-subtle">
          <h2 className="text-h1 text-text-primary font-bold">
            {mode === 'add' ? 'Add' : 'Edit'} Control Panel
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Panel Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-body text-text-secondary font-medium">
                Panel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={panelData.name}
                onChange={(e) => setPanelData({ ...panelData, name: e.target.value })}
                placeholder="e.g. Heizung"
                className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-body text-text-secondary font-medium">Icon</label>
              <input
                type="text"
                value={panelData.icon}
                onChange={(e) => setPanelData({ ...panelData, icon: e.target.value })}
                placeholder="e.g. heating"
                className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-body text-text-secondary font-medium">Label</label>
              <input
                type="text"
                value={panelData.label}
                onChange={(e) => setPanelData({ ...panelData, label: e.target.value })}
                placeholder="e.g. Heizung.Info"
                className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-body text-text-secondary font-medium">Function</label>
              <input
                type="text"
                value={panelData.function}
                onChange={(e) => setPanelData({ ...panelData, function: e.target.value })}
                placeholder="e.g. heating, blind"
                className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-stroke-subtle"></div>

          {/* States Section */}
          <div className="space-y-4">
            <h3 className="text-h2 text-text-primary font-bold">
              States ({stateCount})
            </h3>

            {/* Existing States */}
            {stateCount > 0 && (
              <div className="space-y-2">
                {Object.entries(panelData.states || {}).map(([key, state]) => {
                  const stateId = (state as any).state || (state as any).action || '';
                  const actionEl = state.actionElement || (state as any).bodyElement || 'None';

                  return (
                    <div
                      key={key}
                      className="p-3 bg-neutral-surface2 rounded-lg border border-stroke-default flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-body font-medium text-text-primary">{state.label || key}</p>
                        <p className="text-sm text-text-secondary mt-1">
                          State ID: <code className="text-cyan-400">{stateId || '(not set)'}</code>
                        </p>
                        <p className="text-sm text-text-secondary">
                          Element: {actionEl}
                          {(state as any).unit && <span className="ml-2">• Unit: {(state as any).unit}</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveState(key)}
                        className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New State Form */}
            <div className="p-4 bg-neutral-surface2 rounded-lg border-2 border-dashed border-stroke-default space-y-4">
              <h4 className="text-body font-medium text-text-primary">Add New State</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium">State Key *</label>
                  <input
                    type="text"
                    value={newStateForm.stateKey}
                    onChange={(e) => setNewStateForm({ ...newStateForm, stateKey: e.target.value })}
                    placeholder="e.g. Temperature"
                    className="w-full px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium">Label</label>
                  <input
                    type="text"
                    value={newStateForm.label}
                    onChange={(e) => setNewStateForm({ ...newStateForm, label: e.target.value })}
                    placeholder="e.g. Room Temperature"
                    className="w-full px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>

              <StateValidator
                stateId={newStateForm.state || ''}
                onStateIdChange={(value) => setNewStateForm({ ...newStateForm, state: value })}
                label="State ID"
                required
                placeholder="e.g. 0_userdata.0.Heizung.Temperature"
              />

              <div className="space-y-2">
                <label className="text-sm text-text-secondary font-medium">Action Element</label>
                <div className="flex gap-2">
                  <select
                    value={newStateForm.actionElement}
                    onChange={(e) => {
                      const newValue = e.target.value as ActionElementType | 'LevelBody';
                      setNewStateForm({ ...newStateForm, actionElement: newValue as any });

                      // Auto-fetch metadata when LevelBody is selected
                      if (newValue === 'LevelBody' && newStateForm.state) {
                        fetchStateMetadata(newStateForm.state);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {ACTION_ELEMENTS.map((action) => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                  {newStateForm.actionElement === 'LevelBody' && newStateForm.state && (
                    <button
                      onClick={() => fetchStateMetadata(newStateForm.state!)}
                      disabled={isFetchingMetadata}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                      title="Fetch min/max/unit from IoBroker"
                    >
                      {isFetchingMetadata ? '...' : 'Fetch Metadata'}
                    </button>
                  )}
                </div>
              </div>

              {/* Slider/Level Configuration */}
              {newStateForm.actionElement === 'LevelBody' && (
                <div className="p-3 bg-neutral-surface1 border border-stroke-default rounded-lg space-y-3">
                  <h5 className="text-sm font-medium text-text-primary">Slider Configuration</h5>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-text-secondary">Min</label>
                      <input
                        type="number"
                        value={newStateForm.properties?.min ?? ''}
                        onChange={(e) =>
                          setNewStateForm({
                            ...newStateForm,
                            properties: {
                              ...newStateForm.properties,
                              min: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                        className="w-full px-2 py-1 bg-neutral-surface2 border border-stroke-default rounded text-text-primary text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-text-secondary">Max</label>
                      <input
                        type="number"
                        value={newStateForm.properties?.max ?? ''}
                        onChange={(e) =>
                          setNewStateForm({
                            ...newStateForm,
                            properties: {
                              ...newStateForm.properties,
                              max: parseFloat(e.target.value) || 100,
                            },
                          })
                        }
                        placeholder="100"
                        className="w-full px-2 py-1 bg-neutral-surface2 border border-stroke-default rounded text-text-primary text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-text-secondary">Unit</label>
                      <input
                        type="text"
                        value={newStateForm.unit ?? ''}
                        onChange={(e) => setNewStateForm({ ...newStateForm, unit: e.target.value })}
                        placeholder="°C"
                        className="w-full px-2 py-1 bg-neutral-surface2 border border-stroke-default rounded text-text-primary text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-text-secondary">Step</label>
                      <input
                        type="text"
                        value={newStateForm.LevelBodyConfig?.step ?? ''}
                        onChange={(e) =>
                          setNewStateForm({
                            ...newStateForm,
                            LevelBodyConfig: {
                              step: e.target.value || '1',
                              markStep: newStateForm.LevelBodyConfig?.markStep || '20',
                            },
                          })
                        }
                        placeholder="1"
                        className="w-full px-2 py-1 bg-neutral-surface2 border border-stroke-default rounded text-text-primary text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-text-secondary">Mark Step</label>
                      <input
                        type="text"
                        value={newStateForm.LevelBodyConfig?.markStep ?? ''}
                        onChange={(e) =>
                          setNewStateForm({
                            ...newStateForm,
                            LevelBodyConfig: {
                              step: newStateForm.LevelBodyConfig?.step || '1',
                              markStep: e.target.value || '20',
                            },
                          })
                        }
                        placeholder="20"
                        className="w-full px-2 py-1 bg-neutral-surface2 border border-stroke-default rounded text-text-primary text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddState}
                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Add State
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stroke-subtle flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-neutral-surface2 text-text-primary rounded-lg font-medium hover:bg-neutral-surface3"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600"
          >
            {mode === 'add' ? 'Create' : 'Update'} Panel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
