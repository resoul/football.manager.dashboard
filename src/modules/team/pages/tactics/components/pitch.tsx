import { useRef } from 'react';
import type { Player } from '../data';
import { PitchCell } from './pitch-cell';
import { FIELD_ROWS, FIELD_COLS, type GridPosition } from '../formations';

interface PitchProps {
    gridAssignments: Record<string, Player>;
    positions: GridPosition[];
    draggingPlayer: Player | null;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'pitch') => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => void;
}

function PitchMarkings() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 420"
            preserveAspectRatio="none"
        >
            <rect x="8" y="8" width="284" height="404" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" rx="2" />
            <line x1="8" y1="210" x2="292" y2="210" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <circle cx="150" cy="210" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <circle cx="150" cy="210" r="2.5" fill="rgba(255,255,255,0.35)" />

            <rect x="75" y="8" width="150" height="72" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <rect x="112" y="8" width="76" height="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="150" cy="62" r="2" fill="rgba(255,255,255,0.3)" />
            <path d="M 110 80 A 38 38 0 0 0 190 80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
            <rect x="124" y="3" width="52" height="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

            <rect x="75" y="340" width="150" height="72" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <rect x="112" y="382" width="76" height="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="150" cy="358" r="2" fill="rgba(255,255,255,0.3)" />
            <path d="M 110 340 A 38 38 0 0 1 190 340" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
            <rect x="124" y="409" width="52" height="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

            <path d="M 8 20 A 10 10 0 0 1 20 8"    fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <path d="M 280 8 A 10 10 0 0 1 292 20"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <path d="M 8 400 A 10 10 0 0 0 20 412"  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <path d="M 280 412 A 10 10 0 0 0 292 400" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </svg>
    );
}

function GrassStripes({ rows }: { rows: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                        top: `${(i / rows) * 100}%`,
                        height: `${100 / rows}%`,
                        background: i % 2 === 0 ? 'rgba(0,0,0,0.07)' : 'transparent',
                    }}
                />
            ))}
        </>
    );
}

export function Pitch({ gridAssignments, positions, draggingPlayer, onDragStart, onDrop }: PitchProps) {
    const pitchRef = useRef<HTMLDivElement>(null);

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
                    draggingPlayer={draggingPlayer}
                    onDrop={onDrop}
                    onDragStart={(e, p) => onDragStart(e, p, 'pitch')}
                />
            );
        }
    }

    return (
        <div
            ref={pitchRef}
            className="relative w-full select-none"
            style={{
                aspectRatio: '4 / 5',
                maxWidth: 520,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #1a4d28 0%, #1e5c2e 35%, #1a5228 65%, #1e5c2e 100%)',
                }}
            />
            <GrassStripes rows={FIELD_ROWS} />
            <PitchMarkings />
            <div className="grid grid-rows-6 grid-cols-5 w-full h-full relative z-10">
                {cells}
            </div>
        </div>
    );
}