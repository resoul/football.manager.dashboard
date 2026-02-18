import { useState } from 'react';
import type { Player } from '../data';
import type { GridPosition } from '../formations';
import { ChevronDown } from 'lucide-react';

interface PositionSlotProps {
    slot: GridPosition;
    player: Player | undefined;
    draggingPlayer: Player | null;
    onDrop: (e: React.DragEvent<HTMLDivElement>, slotId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player) => void;
}

const DUTY_COLOR: Record<string, string> = {
    Attack: '#9b6eec', attack: '#9b6eec',
    Support: '#2ecc71', support: '#2ecc71',
    Defend: '#e74c3c', defend: '#e74c3c',
};
const DUTY_ABBR: Record<string, string> = {
    Attack: 'At', attack: 'At',
    Support: 'Su', support: 'Su',
    Defend: 'De', defend: 'De',
};

function roleBg(label: string, isGK: boolean): string {
    if (isGK) return '#3d2b10';
    if (['WB','DL','DR','DC','CD','BPD'].includes(label)) return '#1a2a44';
    if (['DM','BWM','CM','MC'].includes(label)) return '#1e2236';
    return '#1e1e36';
}

type Compat = 'natural' | 'accomplished' | 'incompatible';

function getCompat(player: Player, slot: GridPosition): Compat {
    const pos = player.position;
    const matches = (codes: string[]) =>
        codes.some(c => pos === c || pos.startsWith(c) || c.startsWith(pos));
    if (matches(slot.naturalFor)) return 'natural';
    if (matches(slot.accomplishedFor)) return 'accomplished';
    return 'incompatible';
}

const COMPAT_RING: Record<Compat, string> = {
    natural:      '74, 222, 128',
    accomplished: '251, 146, 60',
    incompatible: '248, 113, 113',
};

function GhostShirt({ isGK }: { isGK: boolean }) {
    return (
        <svg width="56" height="56" viewBox="0 0 40 40">
            <path
                d="M8 12 L4 18 L10 20 L10 34 L30 34 L30 20 L36 18 L32 12 L26 10 Q20 14 14 10 Z"
                fill={isGK ? 'rgba(150,60,40,0.18)' : 'rgba(255,255,255,0.09)'}
                stroke={isGK ? 'rgba(180,80,50,0.5)' : 'rgba(255,255,255,0.38)'}
                strokeWidth="1"
            />
            <path d="M14 10 Q20 16 26 10" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <path d="M8 12 L4 18 L10 20 L10 16" fill="rgba(255,255,255,0.04)" />
            <path d="M32 12 L36 18 L30 20 L30 16" fill="rgba(255,255,255,0.04)" />
        </svg>
    );
}

function PlayerShirt({ number, isGK }: { number: number; isGK: boolean }) {
    const fill = isGK ? '#1a7a6e' : '#1c1c2e';
    const collar = isGK ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)';
    const numColor = isGK ? '#ffffff' : '#f5a623';
    return (
        <svg width="68" height="68" viewBox="0 0 40 40"
             style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.75))' }}>
            <path
                d="M8 12 L4 18 L10 20 L10 34 L30 34 L30 20 L36 18 L32 12 L26 10 Q20 14 14 10 Z"
                fill={fill} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"
            />
            {isGK && (
                <path d="M10 20 L10 34 L20 34 L20 20 Z M20 27 L30 27 L30 34 L20 34 Z"
                      fill="rgba(255,255,255,0.06)" />
            )}
            <path d="M14 10 Q20 16 26 10" fill="none" stroke={collar} strokeWidth="1" />
            <path d="M8 12 L4 18 L10 20 L10 16" fill="rgba(255,255,255,0.07)" />
            <path d="M32 12 L36 18 L30 20 L30 16" fill="rgba(255,255,255,0.07)" />
            <text x="20" y="26" textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="bold" fill={numColor} fontFamily="Georgia, serif">
                {number}
            </text>
        </svg>
    );
}

export function PositionSlot({ slot, player, draggingPlayer, onDrop, onDragStart }: PositionSlotProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const compat: Compat | null = draggingPlayer ? getCompat(draggingPlayer, slot) : null;
    const rgb = compat ? COMPAT_RING[compat] : null;

    // Always render box-shadow — transparent when no drag, coloured when dragging.
    // This prevents layout shift / jerk when shadow appears.
    const cardShadow = rgb
        ? `0 0 0 2px rgba(${rgb}, 0.9), 0 0 14px rgba(${rgb}, 0.25)`
        : '0 0 0 2px rgba(255,255,255,0)';  // transparent placeholder — no jerk

    const isGKSlot = slot.label === 'GK';
    const isGKPlayer = player?.position === 'GK';

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        onDrop(e, slot.id);
    };

    const duty    = player ? player.duty : slot.defaultDuty;
    const role    = player ? player.role : slot.defaultRole;
    const dutyClr = DUTY_COLOR[duty] ?? '#888';
    const dutyAbbr = DUTY_ABBR[duty] ?? 'Su';
    const bg = roleBg(slot.label, isGKSlot);

    const shortName = player
        ? (player.name.length > 12 ? player.name.split(' ').pop()! : player.name)
        : null;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${slot.x}%`,
                top:  `${slot.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: isDragOver ? 20 : 10,
                opacity: draggingPlayer && player?.id === draggingPlayer.id ? 0.4 : 1,
                transition: 'opacity 0.15s',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Shirt */}
            {player ? (
                <div
                    draggable
                    onDragStart={e => onDragStart(e, player)}
                    className="transition-transform hover:scale-105"
                    style={{ cursor: 'grab' }}
                >
                    <PlayerShirt number={player.number} isGK={isGKPlayer} />
                </div>
            ) : (
                <div style={{ opacity: draggingPlayer ? 0.6 : 0.38, pointerEvents: 'none' }}>
                    <GhostShirt isGK={isGKSlot} />
                </div>
            )}

            {/* FM card — always has box-shadow placeholder to prevent jerk */}
            <div
                style={{
                    marginTop: -2,
                    minWidth: 104,
                    maxWidth: 128,
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: cardShadow,
                    transition: 'box-shadow 0.12s ease',
                    cursor: player ? 'grab' : 'default',
                    pointerEvents: player && draggingPlayer?.id === player.id ? 'none' : 'auto',
                }}
                draggable={!!player}
                onDragStart={player ? e => onDragStart(e, player) : undefined}
            >
                {/* Role – Duty row */}
                <div style={{
                    background: bg,
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    gap: 4,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#c8c8d8', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                            {role}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>-</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: dutyClr, fontFamily: 'monospace' }}>
                            {dutyAbbr}
                        </span>
                    </div>
                    <ChevronDown size={11} color="rgba(255,255,255,0.35)" />
                </div>

                {/* Player name row */}
                <div style={{
                    background: 'rgba(10,12,22,0.94)',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4,
                }}>
                    {player ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                                <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0, opacity: 0.5 }}>
                                    <circle cx="5" cy="3" r="2" fill="rgba(255,255,255,0.7)" />
                                    <path d="M1 10 Q1 7 5 7 Q9 7 9 10" fill="rgba(255,255,255,0.7)" />
                                </svg>
                                <span style={{
                                    fontSize: 12, color: '#eaeaf5', fontWeight: 600,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    fontFamily: 'system-ui, sans-serif',
                                }}>
                                    {shortName}
                                </span>
                            </div>
                            <ChevronDown size={11} color="rgba(255,255,255,0.35)" />
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: 11, color: 'rgba(200,200,220,0.45)', fontFamily: 'system-ui, sans-serif', fontStyle: 'italic' }}>
                                Pick Player
                            </span>
                            <ChevronDown size={11} color="rgba(255,255,255,0.2)" />
                        </>
                    )}
                </div>
            </div>
            {/* NO text label — only the ring highlight */}
        </div>
    );
}