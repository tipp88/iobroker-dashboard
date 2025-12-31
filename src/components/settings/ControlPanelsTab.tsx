import { useState } from 'react';
import { useUserConfigStore } from '../../store/userConfigStore';
import { ControlPanelFormModal } from './ControlPanelFormModal';
import { EXISTING_CONTROL_PANELS, getPanelUsage } from '../../config/existingPanels.config';
import type { UserControlPanelConfig } from '../../types/userConfig';
import { cn } from '../../utils/cn';

export const ControlPanelsTab = () => {
  const { userControlPanels, addControlPanel, updateControlPanel, removeControlPanel, duplicateControlPanel } =
    useUserConfigStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<UserControlPanelConfig | null>(null);

  // Combine existing panels from todo.json with user-created panels
  // User panels override existing panels with the same UUID
  const allPanels = {
    ...EXISTING_CONTROL_PANELS,
    ...userControlPanels,
  };

  const handleAddPanel = () => {
    setEditingPanel(null);
    setIsFormOpen(true);
  };

  const handleEditPanel = (uuid: string, panel: any) => {
    // Check if this is an existing panel from todo.json or a user-created panel
    const isExisting = uuid in EXISTING_CONTROL_PANELS;

    setEditingPanel({
      uuid,
      name: panel.name,
      icon: panel.icon,
      label: panel.label,
      function: panel.function,
      states: panel.states || {},
      isUserAdded: !isExisting,
    });
    setIsFormOpen(true);
  };

  const handleSavePanel = (panel: UserControlPanelConfig) => {
    if (editingPanel) {
      updateControlPanel(panel.uuid, panel);
    } else {
      addControlPanel(panel);
    }

    // Keep the panel expanded so user can see their changes
    setExpandedPanels((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.add(panel.uuid);
      return newExpanded;
    });

    setIsFormOpen(false);
    setEditingPanel(null);
  };

  const handleDeletePanel = (uuid: string) => {
    if (confirm('Are you sure you want to delete this control panel?')) {
      removeControlPanel(uuid);
    }
  };

  const handleDuplicatePanel = (uuid: string) => {
    duplicateControlPanel(uuid);
  };

  const togglePanel = (uuid: string) => {
    const newExpanded = new Set(expandedPanels);
    if (newExpanded.has(uuid)) {
      newExpanded.delete(uuid);
    } else {
      newExpanded.add(uuid);
    }
    setExpandedPanels(newExpanded);
  };

  // Filter panels by search query
  const filteredPanels = Object.entries(allPanels).filter(([uuid, panel]: [string, any]) => {
    return (
      panel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uuid.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const userPanelCount = Object.keys(userControlPanels).length;
  const existingPanelCount = Object.keys(EXISTING_CONTROL_PANELS).length;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/50 rounded-lg">
        <p className="text-sm text-cyan-400">
          🎛️ <strong>{existingPanelCount}</strong> existing panel{existingPanelCount !== 1 ? 's' : ''} from
          todo.json • <strong>{userPanelCount}</strong> user-created panel{userPanelCount !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-cyan-400/80 mt-1">
          You can edit existing panels to add new states (creates an override) or create entirely new control
          panels. Each state can have switches, time pickers, dropdowns, etc.
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search control panels..."
          className="flex-1 px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <button
          onClick={handleAddPanel}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Panel
        </button>
      </div>

      {/* Panel List */}
      <div className="space-y-3">
        {filteredPanels.length === 0 ? (
          <div className="text-center py-12 bg-neutral-surface2 rounded-lg border border-stroke-subtle">
            <p className="text-text-secondary">
              {searchQuery ? 'No panels match your search' : 'No panels found'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddPanel}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Add Your First Panel
              </button>
            )}
          </div>
        ) : (
          filteredPanels.map(([uuid, panel]: [string, any]) => {
            const stateCount = Object.keys(panel.states || {}).length;
            const isExpanded = expandedPanels.has(uuid);
            const isExistingPanel = uuid in EXISTING_CONTROL_PANELS;
            const isOverride = isExistingPanel && uuid in userControlPanels;
            const usage = getPanelUsage(uuid);

            return (
              <div
                key={uuid}
                className="p-4 rounded-lg border transition-all bg-neutral-surface2 border-stroke-default hover:border-stroke-subtle"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePanel(uuid)}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <svg
                          className={cn('w-5 h-5 transition-transform', isExpanded && 'rotate-90')}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <h3 className="text-body font-medium text-text-primary flex items-center gap-2">
                        {panel.icon && <span>{panel.icon}</span>}
                        {panel.name}
                      </h3>
                      {isOverride && (
                        <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/50">
                          Modified
                        </span>
                      )}
                      {isExistingPanel && !isOverride && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded border border-blue-500/50">
                          From todo.json
                        </span>
                      )}
                      {!isExistingPanel && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/50">
                          User-created
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1 ml-7">
                      {stateCount} state{stateCount !== 1 ? 's' : ''}
                      {panel.function && ` • ${panel.function} function`}
                      {panel.label && ` • ${panel.label}`}
                    </p>
                    {usage.length > 0 && (
                      <p className="text-xs text-text-secondary mt-1 ml-7">
                        📍 Used in:{' '}
                        {usage.map((u, i) => (
                          <span key={i}>
                            {i > 0 && ', '}
                            <span className="text-cyan-400">
                              {u.page} → {u.section}
                            </span>
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary mt-1 ml-7 font-mono">
                      UUID: {uuid}
                    </p>

                    {/* Expanded state list */}
                    {isExpanded && stateCount > 0 && (
                      <div className="mt-3 ml-7 space-y-2">
                        {Object.entries(panel.states).map(([key, state]: [string, any]) => {
                          const stateId = state.state || state.action || '';
                          const element = state.actionElement || state.bodyElement || 'None';

                          return (
                            <div key={key} className="p-2 bg-neutral-surface1 rounded border border-stroke-subtle">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-text-primary">{state.label || key}</p>
                                  <p className="text-xs text-text-secondary mt-1">
                                    State ID: <code className="text-cyan-400">{stateId || '(not set)'}</code>
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    Element: {element}
                                    {state.unit && <span className="ml-2">• Unit: {state.unit}</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditPanel(uuid, panel)}
                      className="px-3 py-1.5 text-sm bg-neutral-surface3 text-text-primary rounded hover:bg-neutral-surface1 transition-colors"
                      title="Edit panel"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicatePanel(uuid)}
                      className="px-3 py-1.5 text-sm bg-neutral-surface3 text-text-primary rounded hover:bg-neutral-surface1 transition-colors"
                      title="Duplicate panel"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDeletePanel(uuid)}
                      className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete panel"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      <ControlPanelFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPanel(null);
        }}
        onSave={handleSavePanel}
        initialPanel={editingPanel || undefined}
        mode={editingPanel ? 'edit' : 'add'}
      />
    </div>
  );
};
