import type { Player } from '../data';
import type { GridPosition } from '../formations';
import { PositionSlot } from './position-slot';
import type { DisplayMode } from './position-slot';
import { setPlayerDragImage } from './drag-image';

interface PitchProps {
    assignments: Record<string, Player>;  // slotId -> Player
    positions: GridPosition[];
    draggingPlayer: Player | null;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player) => void;
    displayMode: DisplayMode;
    onDrop: (e: React.DragEvent<HTMLDivElement>, slotId: string) => void;
}

// ── Pitch SVG markings ───────────────────────────────────────────────────────
function PitchMarkings() {
    const s = 'rgba(255,255,255,0.22)';
    const f = 'rgba(255,255,255,0.14)';
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 420"
            preserveAspectRatio="none"
        >
            {/* Border */}
            <rect x="8" y="8" width="284" height="404" fill="none" stroke={s} strokeWidth="1.5" rx="2"/>
            {/* Halfway */}
            <line x1="8" y1="210" x2="292" y2="210" stroke={s} strokeWidth="1.5"/>
            {/* Centre circle */}
            <circle cx="150" cy="210" r="38" fill="none" stroke={f} strokeWidth="1.5"/>
            <circle cx="150" cy="210" r="2.5" fill={s}/>
            {/* Top box */}
            <rect x="75"  y="8"   width="150" height="72" fill="none" stroke={f} strokeWidth="1.2"/>
            <rect x="112" y="8"   width="76"  height="30" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1"/>
            <circle cx="150" cy="62" r="2" fill={f}/>
            <path d="M110 80 A38 38 0 0 0 190 80" fill="none" stroke={f} strokeWidth="1.2"/>
            <rect x="124" y="2"  width="52" height="10" fill="rgba(255,255,255,0.06)" stroke={f} strokeWidth="1"/>
            {/* Bottom box */}
            <rect x="75"  y="340" width="150" height="72" fill="none" stroke={f} strokeWidth="1.2"/>
            <rect x="112" y="382" width="76"  height="30" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1"/>
            <circle cx="150" cy="358" r="2" fill={f}/>
            <path d="M110 340 A38 38 0 0 1 190 340" fill="none" stroke={f} strokeWidth="1.2"/>
            <rect x="124" y="410" width="52" height="10" fill="rgba(255,255,255,0.06)" stroke={f} strokeWidth="1"/>
            {/* Corners */}
            <path d="M8 20 A10 10 0 0 1 20 8"       fill="none" stroke={f} strokeWidth="1"/>
            <path d="M280 8 A10 10 0 0 1 292 20"    fill="none" stroke={f} strokeWidth="1"/>
            <path d="M8 400 A10 10 0 0 0 20 412"    fill="none" stroke={f} strokeWidth="1"/>
            <path d="M280 412 A10 10 0 0 0 292 400" fill="none" stroke={f} strokeWidth="1"/>
        </svg>
    );
}

// ── Alternating grass stripes ─────────────────────────────────────────────────
function GrassStripes() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                        top:        `${(i / 8) * 100}%`,
                        height:     `${100 / 8}%`,
                        background: i % 2 === 0 ? 'rgba(0,0,0,0.055)' : 'transparent',
                    }}
                />
            ))}
        </>
    );
}

// ── Pitch ─────────────────────────────────────────────────────────────────────
export function Pitch({ assignments, positions, draggingPlayer, displayMode, onDragStart, onDrop }: PitchProps) {
    const handleSlotDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player) => {
        setPlayerDragImage(e, player);
        e.dataTransfer.setData('player', JSON.stringify(player));
        onDragStart(e, player);
    };

    return (
        <div
            className="relative select-none"
            style={{
                width:       '100%',
                aspectRatio: '3 / 4',
                maxWidth:    500,
                borderRadius: 14,
                overflow:    'hidden',
                boxShadow:   '0 24px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
        >
            {/* Grass */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(175deg, #1b5230 0%, #1e5e34 30%, #1a5230 60%, #1e5e34 100%)',
                }}
            />
            <GrassStripes />
            <PitchMarkings />

            {/* Slots — absolutely positioned */}
            <div className="absolute inset-0">
                {positions.map(slot => (
                    <PositionSlot
                        key={slot.id}
                        slot={slot}
                        player={assignments[slot.id]}
                        draggingPlayer={draggingPlayer}
                        displayMode={displayMode}
                        onDrop={onDrop}
                        onDragStart={handleSlotDragStart}
                    />
                ))}
            </div>
        </div>
    );
}