import { useState, useRef, useEffect } from 'react';
import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { cn } from '../../utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  unit?: string;
  className?: string;
}

export const Slider = ({
  value,
  onChange,
  onChangeComplete,
  min,
  max,
  step = 1,
  disabled = false,
  showValue = false,
  unit = '',
  className,
}: SliderProps) => {
  const { scheme } = useColorScheme();
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentValueRef = useRef(value);

  // Keep track of the current value without triggering re-renders
  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = min + ((max - min) * percent) / 100;
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    currentValueRef.current = clampedValue;
    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        onChangeComplete?.(currentValueRef.current);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, onChangeComplete]);

  return (
    <div className={cn('space-y-2', className)}>
      <div
        ref={sliderRef}
        className={cn(
          'relative h-2 rounded-pill bg-neutral-surface2 cursor-pointer touch-none',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track fill */}
        <div
          className="absolute h-full rounded-pill transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: scheme.primary,
            boxShadow: `0 0 8px ${scheme.glow}`,
          }}
        />

        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 w-5 h-5 rounded-full bg-white shadow-raised-control',
            'transition-transform hover:scale-110',
            isDragging && 'scale-125'
          )}
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.25)' : ''}`,
            boxShadow: `0 0 12px ${scheme.glow}`,
          }}
        />
      </div>

      {showValue && (
        <div className="flex justify-between text-caption text-text-muted">
          <span>{min}{unit}</span>
          <span className="text-text-primary font-semibold">{value}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
};
