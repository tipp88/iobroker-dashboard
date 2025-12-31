import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card = ({ children, className, variant = 'default' }: CardProps) => {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-neutral-surface0/55 rounded-xl p-4 border border-white/20 shadow-lg',
        variant === 'default' && 'shadow-card',
        variant === 'elevated' && 'shadow-raised-control',
        variant === 'bordered' && 'border-2 border-white/30',
        className
      )}
    >
      {children}
    </div>
  );
};
