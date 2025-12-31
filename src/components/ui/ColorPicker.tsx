import { useState, useRef, useEffect } from 'react';
import { useColorScheme, COLOR_SCHEMES } from '../../contexts/ColorSchemeContext';
import type { ColorSchemeName } from '../../contexts/ColorSchemeContext';
import { cn } from '../../utils/cn';

export const ColorPicker = () => {
  const { scheme, currentScheme, setScheme } = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border-2 border-white/20 transition-transform hover:scale-110"
        style={{ backgroundColor: scheme.primary }}
        aria-label="Change color scheme"
      />

      {isOpen && (
        <div className="absolute right-0 top-12 bg-neutral-surface1 rounded-lg shadow-raised-control border border-stroke-default p-2 min-w-[140px] z-50">
          <div className="space-y-1">
            {Object.entries(COLOR_SCHEMES).map(([name, colorScheme]) => (
              <button
                key={name}
                onClick={() => {
                  setScheme(name as ColorSchemeName);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  'hover:bg-neutral-surface2',
                  currentScheme === name && 'bg-neutral-surface3'
                )}
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: colorScheme.primary }}
                />
                <span className="text-body text-text-primary capitalize">{name}</span>
                {currentScheme === name && (
                  <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
