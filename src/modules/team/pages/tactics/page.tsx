import { useState } from 'react';
import { SQUAD_PLAYERS, type Player } from './data';
import { Pitch } from './components/pitch';
import { PlayerList } from './components/player-list';
import { Helmet } from '@packages/react-helmet-async';
import { useTactics } from './use-tactics';
import { FORMATIONS } from './formations';
import { ChevronDown, RefreshCcw, Wand2, Trash2 } from 'lucide-react';
import { setPlayerDragImage } from './components/drag-image';
import type { DisplayMode } from './components/position-slot';

export function SetupPage() {
    const {
        formation,
        formationKey,
        assignments,
        handleFormationChange,
        movePlayer,
        removePlayer,
        autoPick,
        clearPitch,
    } = useTactics(SQUAD_PLAYERS);

    const [draggingPlayer, setDraggingPlayer] = useState<Player | null>(null);
    const [formationMenuOpen, setFormationMenuOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<DisplayMode>('role');

    // ── Drag handlers ──────────────────────────────────────────────────────
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player) => {
        e.dataTransfer.setData('player', JSON.stringify(player));
        setDraggingPlayer(player);
    };
    const handleDragEnd = () => setDraggingPlayer(null);
    const handlePitchDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
        setDraggingPlayer(null);
        try {
            const player = JSON.parse(e.dataTransfer.getData('player')) as Player;
            movePlayer(player, slotId);
        } catch { /* ignore */ }
    };
    const handleListDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingPlayer(null);
        try {
            const player = JSON.parse(e.dataTransfer.getData('player')) as Player;
            removePlayer(player.id);
        } catch { /* ignore */ }
    };

    const assignedCount = Object.keys(assignments).length;

    return (
        <div
            className="flex flex-col h-screen bg-[#0f1115] text-white font-sans"
            onDragEnd={handleDragEnd}
        >
            <Helmet>
                <title>Tactics | Football Manager</title>
            </Helmet>

            {/* ── Header ── */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-3 pb-2 relative z-30 bg-[#0f1115] border-b border-white/5">
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-500 uppercase">Formation</p>

                <div className="relative">
                    <button
                        onClick={() => setFormationMenuOpen(v => !v)}
                        className="flex items-center gap-2 text-[22px] font-extrabold text-white hover:text-green-300 transition-colors tracking-wide"
                    >
                        {formation.displayName}
                        <ChevronDown size={18} className={`opacity-60 transition-transform ${formationMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {formationMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setFormationMenuOpen(false)} />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#1b1e2b] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
                                {Object.entries(FORMATIONS).map(([key, f]) => (
                                    <button
                                        key={key}
                                        onClick={() => { handleFormationChange(key); setFormationMenuOpen(false); }}
                                        className={`w-full px-5 py-3 text-left text-sm font-bold transition-colors border-b border-zinc-800 last:border-0
                                            ${formationKey === key ? 'bg-green-600/15 text-green-400' : 'text-white hover:bg-white/5'}`}
                                    >
                                        {f.displayName}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <button onClick={autoPick} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold text-amber-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors">
                        <Wand2 size={11} /> Auto Pick
                    </button>
                    <button onClick={clearPitch} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold text-red-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors">
                        <Trash2 size={11} /> Clear
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-hidden px-4 pb-4 pt-3 relative z-10">
                <div className="grid grid-cols-12 gap-4 h-full max-w-[1920px] mx-auto">

                    {/* Pitch */}
                    <div className="col-span-8 flex items-center justify-center relative">

                        {/* ── Display mode switcher (FM-style 3 icon buttons, top-left of pitch) ── */}
                        <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
                            <DisplayModeButton
                                mode="role"
                                active={displayMode === 'role'}
                                onClick={() => setDisplayMode('role')}
                                tooltip="Show Role and Duty"
                                icon={
                                    // Person + shield icon (role)
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                        <circle cx="7" cy="4" r="2.5" />
                                        <path d="M2 13 Q2 9 7 9 Q12 9 12 13" />
                                    </svg>
                                }
                            />
                            <DisplayModeButton
                                mode="info"
                                active={displayMode === 'info'}
                                onClick={() => setDisplayMode('info')}
                                tooltip="Show Extra Player Information"
                                icon={
                                    // Bar chart icon
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                        <rect x="1" y="5" width="3" height="8" rx="0.5" />
                                        <rect x="5.5" y="2" width="3" height="11" rx="0.5" />
                                        <rect x="10" y="7" width="3" height="6" rx="0.5" />
                                    </svg>
                                }
                            />
                            <DisplayModeButton
                                mode="familiarity"
                                active={displayMode === 'familiarity'}
                                onClick={() => setDisplayMode('familiarity')}
                                tooltip="Show Tactical Familiarity"
                                icon={
                                    // Up arrow icon
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                        <path d="M7 2 L11 7 H8.5 V12 H5.5 V7 H3 Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <Pitch
                            assignments={assignments}
                            positions={formation.positions}
                            draggingPlayer={draggingPlayer}
                            displayMode={displayMode}
                            onDragStart={handleDragStart}
                            onDrop={handlePitchDrop}
                        />

                        {/* Team Fluidity */}
                        <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur px-2.5 py-1.5 rounded-lg text-xs">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-green-400">Team Fluidity</div>
                            <div className="flex items-center gap-1 text-white text-[11px] mt-0.5">
                                <RefreshCcw size={10} className="text-green-400" /> Fluid
                            </div>
                        </div>

                        {/* Player count */}
                        <div className="absolute bottom-2 right-2 bg-black/55 backdrop-blur px-2 py-1 rounded-lg text-[11px] text-gray-400">
                            <span className={assignedCount === 11 ? 'text-green-400 font-bold' : ''}>{assignedCount}</span>
                            <span className="text-gray-600"> / 11</span>
                        </div>
                    </div>

                    {/* Squad list */}
                    <div className="col-span-4 h-full overflow-hidden">
                        <PlayerList
                            players={SQUAD_PLAYERS}
                            assignments={assignments}
                            positions={formation.positions}
                            onDragStart={(e, player) => { setPlayerDragImage(e, player); handleDragStart(e, player); }}
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleListDrop}
                            onAssign={(player, slotId) => movePlayer(player, slotId)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Display mode button ────────────────────────────────────────────────────────
interface DisplayModeButtonProps {
    mode: DisplayMode;
    active: boolean;
    onClick: () => void;
    tooltip: string;
    icon: React.ReactNode;
}

function DisplayModeButton({ active, onClick, tooltip, icon }: DisplayModeButtonProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors
                    ${active
                    ? 'bg-[#4a3a8a] text-white'
                    : 'bg-[#1e2030] text-gray-400 hover:bg-[#2a2d42] hover:text-white'
                }`}
            >
                {icon}
            </button>
            {showTooltip && (
                <div className="absolute top-full left-0 mt-1.5 z-50 whitespace-nowrap bg-[#1b1e2b] border border-zinc-700 text-white text-xs px-3 py-1.5 rounded shadow-xl pointer-events-none">
                    {tooltip}
                </div>
            )}
        </div>
    );
}