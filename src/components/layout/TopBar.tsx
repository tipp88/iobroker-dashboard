import { useState } from 'react';
import { SettingsModal } from '../ui/SettingsModal';
import { Button } from '../ui/Button';
import { useViewMode } from '../../contexts/ViewModeContext';
import { useColorScheme } from '../../contexts/ColorSchemeContext';

export const TopBar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { viewMode, setViewMode } = useViewMode();
  const { scheme } = useColorScheme();

  return (
    <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-cyan-900/30 border-b border-cyan-400/20 shadow-lg shadow-cyan-500/10 relative">
      <div className="flex items-center gap-3">
        <div className="inline-flex bg-neutral-surface2/70 border border-stroke-subtle rounded-full p-1">
          <button
            onClick={() => setViewMode('dashboard')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
            style={
              viewMode === 'dashboard'
                ? { backgroundColor: scheme.primary, color: 'white' }
                : { color: '#9ca3af' }
            }
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('change')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
            style={
              viewMode === 'change'
                ? { backgroundColor: scheme.primary, color: 'white' }
                : { color: '#9ca3af' }
            }
          >
            Change
          </button>
        </div>
      </div>

      {/* Brand */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <h1 className="text-h1 font-semibold text-white tracking-wide">Smart Home</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="icon" className="text-white/60 hover:text-white" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Button>

        <Button
          variant="icon"
          className="text-white/60 hover:text-white"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-caption">
          U
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};
