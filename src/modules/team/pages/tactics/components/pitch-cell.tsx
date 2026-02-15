import type { Player } from '../data';
import { PitchPlayer } from './pitch-player';

interface PitchCellProps {
    row: number;
    col: number;
    player: Player | undefined; // Player occupying this cell, if any
    label?: string; // e.g. "GK", "ST" from formation
    onDrop: (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player) => void;
}

export function PitchCell({ row, col, player, label, onDrop, onDragStart }: PitchCellProps) {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e, row, col);
    };

    return (
        <div
            className={`
                relative border border-white/5 w-full h-full flex items-center justify-center
                ${label ? 'bg-white/5' : ''}
                transition-colors hover:bg-white/10
            `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Valid Position Indicator (from Formation) */}
            {label && !player && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <span className="text-sm font-bold text-white">{label}</span>
                </div>
            )}

            {player ? (
                <div className="z-10">
                    <PitchPlayer
                        player={player}
                        position={{ x: 50, y: 50 }} // Centered in relative cell
                        onDragStart={(e, p) => onDragStart(e, p)}
                    />
                </div>
            ) : (
                // Empty state or drop target
                <div className="w-full h-full"></div>
            )}
        </div>
    );
}
