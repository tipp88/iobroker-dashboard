import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { useColorScheme } from '../../contexts/ColorSchemeContext';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'icon' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const { scheme } = useColorScheme();

  const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-caption',
    md: 'px-4 py-2 text-body',
    lg: 'px-6 py-3 text-h2',
  };

  const variantStyles = {
    primary: cn(
      'rounded-lg text-white font-semibold shadow-raised-control hover:shadow-hover-lift',
    ),
    icon: cn(
      'rounded-full p-2 hover:bg-neutral-surface2 transition-colors',
    ),
    ghost: cn(
      'rounded-lg hover:bg-neutral-surface1 transition-colors',
    ),
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      style={
        variant === 'primary' && !disabled
          ? {
              backgroundColor: scheme.primary,
              boxShadow: `0 0 18px ${scheme.glow}`,
            }
          : undefined
      }
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
