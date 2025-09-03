import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    outline: 'border border-white/20 hover:bg-white/10',
    ghost: 'hover:bg-white/10'
  } as const;
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  } as const;
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export default Button; 