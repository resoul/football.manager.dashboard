import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
                'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                'placeholder:text-muted-foreground',
                'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10',
                'dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20',
                className,
            )}
            {...props}
        />
    );
}

function Label({ className, ...props }: React.ComponentProps<'label'>) {
    return (
        <label
            data-slot="label"
            className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className,
            )}
            {...props}
        />
    );
}

export { Input, Label };
