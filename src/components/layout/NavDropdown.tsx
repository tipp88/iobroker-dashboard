import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface NavItem {
  label: string;
  path: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
    ]
  },
  {
    label: 'Energy',
    items: [
      { label: 'Solar', path: '/solar' },
      { label: 'EVCC', path: '/evcc' },
      { label: 'Wallbox', path: '/wallbox' },
    ]
  },
  {
    label: 'Climate',
    items: [
      { label: 'Heizung', path: '/heizung' },
      { label: 'Klimaanlage', path: '/klimaanlage' },
      { label: 'Lüftung', path: '/lueftung' },
    ]
  },
  {
    label: 'Systems',
    items: [
      { label: 'Wasser', path: '/wasser' },
      { label: 'Autos', path: '/autos' },
      { label: 'Dreame', path: '/dreame' },
      { label: 'Rolläden', path: '/rollaeden' },
    ]
  },
];

export const NavDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find current page label
  const currentPage = NAV_GROUPS.flatMap(g => g.items).find(
    item => item.path === location.pathname
  );

  // Handle click outside
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
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'px-4 py-2 rounded-lg text-body font-medium transition-all flex items-center gap-2',
          isOpen
            ? 'bg-neutral-surface2 text-text-primary'
            : 'text-text-secondary hover:bg-neutral-surface1 hover:text-text-primary'
        )}
      >
        {currentPage?.label || 'Navigation'}
        <svg
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-surface1 rounded-xl border border-stroke-default shadow-card z-50">
          <div className="p-2">
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={group.label}>
                {groupIdx > 0 && (
                  <div className="my-2 border-t border-stroke-subtle" />
                )}
                <div className="px-3 py-2">
                  <p className="text-caption text-text-secondary font-semibold uppercase tracking-wide">
                    {group.label}
                  </p>
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg text-left text-body transition-colors',
                          isActive
                            ? 'bg-neutral-surface2 text-text-primary font-medium'
                            : 'text-text-primary hover:bg-neutral-surface2'
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
