import { cn } from "@/lib/utils.ts";

export function JuveBadge({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
    const sz = size === 'lg' ? 'size-16' : size === 'md' ? 'size-10' : size === 'sm' ? 'size-6' : 'size-4';
    return (
        <div className={cn('rounded flex items-center justify-center bg-zinc-900 border border-zinc-600 shrink-0', sz)}>
            <svg viewBox="0 0 40 50" className="w-3/4 h-3/4" fill="white">
                <path d="M20 2L4 8v16c0 12 7 22 16 24 9-2 16-12 16-24V8L20 2z" fill="white" />
                <path d="M20 6L8 11v13c0 9 5 17 12 19 7-2 12-10 12-19V11L20 6z" fill="black" />
            </svg>
        </div>
    );
}