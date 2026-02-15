import { useRef } from 'react';
import type { Player } from '../data';
import { PitchCell } from './pitch-cell';
import { FIELD_ROWS, FIELD_COLS, type GridPosition } from '../formations';

interface PitchProps {
    gridAssignments: Record<string, Player>;
    positions: GridPosition[]; // From current formation, to show labels
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'pitch') => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => void;
}

export function Pitch({ gridAssignments, positions, onDragStart, onDrop }: PitchProps) {
    const pitchRef = useRef<HTMLDivElement>(null);

    // Create grid cells
    const cells = [];
    for (let row = 0; row < FIELD_ROWS; row++) {
        for (let col = 0; col < FIELD_COLS; col++) {
            const key = `${row}-${col}`;
            const player = gridAssignments[key];
            const positionLabel = positions.find(p => p.row === row && p.col === col)?.label;

            cells.push(
                <PitchCell
                    key={key}
                    row={row}
                    col={col}
                    player={player}
                    label={positionLabel}
                    onDrop={onDrop}
                    onDragStart={(e, p) => onDragStart(e, p, 'pitch')}
                />
            );
        }
    }

    return (
        <div
            ref={pitchRef}
            className="relative w-full aspect-[5/6] max-w-[500px] bg-[#1a4a2c] rounded overflow-hidden shadow-2xl border border-white/20 select-none"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 49px,
                    rgba(255,255,255,0.05) 50px
                )`
            }}
        >
            {/* Field Markings Layer - Absolute behind grid */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Center Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 transform -translate-y-1/2"></div>
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 w-[20%] aspect-square border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                {/* Penalty Areas */}
                <div className="absolute top-0 left-1/2 w-[40%] h-[15%] border border-white/20 transform -translate-x-1/2 border-t-0"></div>
                <div className="absolute bottom-0 left-1/2 w-[40%] h-[15%] border border-white/20 transform -translate-x-1/2 border-b-0"></div>

                {/* Goal Areas */}
                <div className="absolute top-0 left-1/2 w-[20%] h-[6%] border border-white/20 transform -translate-x-1/2 border-t-0"></div>
                <div className="absolute bottom-0 left-1/2 w-[20%] h-[6%] border border-white/20 transform -translate-x-1/2 border-b-0"></div>
            </div>

            {/* Grid Layer */}
            <div className="grid grid-rows-6 grid-cols-5 w-full h-full relative z-10">
                {cells}
            </div>
        </div>
    );
}
