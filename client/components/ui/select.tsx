import * as React from 'react';
import { cn } from '../../lib/utils';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: React.PropsWithChildren<SelectProps>) {
  return (
    <select
      className={cn(
        'w-full rounded-lg border border-white/10 bg-black/40 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select; 