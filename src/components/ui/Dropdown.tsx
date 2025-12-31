interface DropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  placeholder?: string;
}

export const Dropdown = ({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select...',
}: DropdownProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          const selectedValue = e.target.value;
          // Try to convert to number if the original option value was a number
          const option = options.find(opt => String(opt.value) === selectedValue);
          onChange(option?.value ?? selectedValue);
        }}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-neutral-surface2 border border-stroke-default text-text-primary text-body appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-surface3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-bg0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2.5rem',
        }}
      >
        {!value && value !== 0 && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
