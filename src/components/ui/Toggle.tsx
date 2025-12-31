import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Toggle = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: ToggleProps) => {
  const { scheme } = useColorScheme();

  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translateX: 16 },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translateX: 20 },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translateX: 28 },
  };

  const currentSize = sizes[size];

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            currentSize.track,
            'rounded-pill transition-all duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            backgroundColor: checked ? `${scheme.primary}60` : '#2C2C2E',
            boxShadow: checked ? `0 0 12px ${scheme.glow}` : 'none',
          }}
        >
          <div
            className={cn(
              currentSize.thumb,
              'absolute top-1/2 left-0.5 bg-white rounded-full shadow-md transition-all duration-200'
            )}
            style={{
              transform: `translateY(-50%) ${checked ? `translateX(${currentSize.translateX}px)` : 'translateX(0px)'}`,
              backgroundColor: checked ? scheme.primary : 'white',
            }}
          />
        </div>
      </div>
      {label && <span className="text-body text-text-primary">{label}</span>}
    </label>
  );
};
