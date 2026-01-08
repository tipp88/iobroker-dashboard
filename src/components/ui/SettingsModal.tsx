import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useColorScheme, COLOR_SCHEMES } from '../../contexts/ColorSchemeContext';
import { useViewMode } from '../../contexts/ViewModeContext';
import type { ColorSchemeName } from '../../contexts/ColorSchemeContext';
import { cn } from '../../utils/cn';
import { ControlPanelsTab } from '../settings/ControlPanelsTab';
import { ImportExportTab } from '../settings/ImportExportTab';
import { LinksSection } from '../settings/LinksSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'controlPanels' | 'importExport';

interface Tab {
  id: SettingsTab;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'controlPanels', label: 'Control Panels', icon: '🎛️' },
  { id: 'importExport', label: 'Import/Export', icon: '💾' },
];

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { scheme, currentScheme, setScheme } = useColorScheme();
  const { viewMode, setViewMode } = useViewMode();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
    >
      <div className="bg-neutral-surface1 rounded-xl shadow-card border border-stroke-default w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stroke-subtle">
          <h2 className="text-h1 text-text-primary font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stroke-subtle px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-body font-medium transition-all relative',
                activeTab === tab.id
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: scheme.primary }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* View Mode Section */}
              <div className="space-y-3">
                <label className="text-body text-text-secondary font-medium">View Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('dashboard')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-body font-medium transition-all',
                      viewMode === 'dashboard'
                        ? 'text-white shadow-accent-glow'
                        : 'bg-neutral-surface2 text-text-primary hover:bg-neutral-surface3'
                    )}
                    style={viewMode === 'dashboard' ? { backgroundColor: scheme.primary } : undefined}
                  >
                    Dashboard View
                  </button>
                  <button
                    onClick={() => setViewMode('change')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-body font-medium transition-all',
                      viewMode === 'change'
                        ? 'text-white shadow-accent-glow'
                        : 'bg-neutral-surface2 text-text-primary hover:bg-neutral-surface3'
                    )}
                    style={viewMode === 'change' ? { backgroundColor: scheme.primary } : undefined}
                  >
                    Change View
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-stroke-subtle"></div>

              {/* Color Scheme Section */}
              <div className="space-y-3">
                <label className="text-body text-text-secondary font-medium">Color Scheme</label>
                <div className="space-y-2">
                  {Object.entries(COLOR_SCHEMES).map(([name, colorScheme]) => (
                    <button
                      key={name}
                      onClick={() => setScheme(name as ColorSchemeName)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        'hover:bg-neutral-surface2',
                        currentScheme === name && 'bg-neutral-surface2'
                      )}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: colorScheme.primary }}
                      />
                      <span className="text-body text-text-primary capitalize">{name}</span>
                      {currentScheme === name && (
                        <svg
                          className="w-5 h-5 ml-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: scheme.primary }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-stroke-subtle"></div>

              <LinksSection />
            </>
          )}

          {/* Control Panels Tab */}
          {activeTab === 'controlPanels' && <ControlPanelsTab />}

          {/* Import/Export Tab */}
          {activeTab === 'importExport' && <ImportExportTab />}
        </div>
      </div>
    </div>,
    document.body
  );
};
