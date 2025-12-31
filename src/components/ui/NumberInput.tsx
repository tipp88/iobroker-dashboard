interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled = false,
}: NumberInputProps) => {
  const handleChange = (newValue: number) => {
    let validValue = newValue;

    if (min !== undefined && validValue < min) {
      validValue = min;
    }
    if (max !== undefined && validValue > max) {
      validValue = max;
    }

    onChange(validValue);
  };

  const increment = () => {
    handleChange(value + step);
  };

  const decrement = () => {
    handleChange(value - step);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className="px-2 py-1 rounded-l-lg bg-neutral-surface2 border border-r-0 border-stroke-default text-text-primary hover:bg-neutral-surface3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-20 px-3 py-1 bg-neutral-surface2 border-t border-b border-stroke-default text-text-primary text-body text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-bg0 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className="px-2 py-1 rounded-r-lg bg-neutral-surface2 border border-l-0 border-stroke-default text-text-primary hover:bg-neutral-surface3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {unit && (
        <span className="text-body text-text-secondary">{unit}</span>
      )}
    </div>
  );
};
