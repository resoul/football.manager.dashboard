import { useRef, useState, useEffect } from 'react';
import type { Player } from '../data';
import { MoreHorizontal } from 'lucide-react';
import type { Formation } from '../formations';


interface PlayerListProps {
    players: Player[];
    pitchPlayers: Array<{ player: Player; position: { x: number; y: number } }>;
    lineAssignments: Record<string, Player[]>;
    formation: Formation;
    onAssign: (sourcePlayer: Player, targetLineId: string, targetPlayerId?: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'list') => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function PlayerList({ players, pitchPlayers, lineAssignments, formation, onAssign, onDragStart, onDrop, onDragOver }: PlayerListProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent, playerId: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === playerId ? null : playerId);
    };

    // Sort players: On Pitch first, then by Position/ID
    const sortedPlayers = [...players].sort((a, b) => {
        const aOnPitch = pitchPlayers.some(p => p.player.id === a.id);
        const bOnPitch = pitchPlayers.some(p => p.player.id === b.id);

        if (aOnPitch && !bOnPitch) return -1;
        if (!aOnPitch && bOnPitch) return 1;
        return 0;
    });

    const getAssignedLine = (playerId: string) => {
        for (const [lineId, players] of Object.entries(lineAssignments)) {
            if (players.find(p => p.id === playerId)) {
                return lineId;
            }
        }
        return '-';
    };

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="bg-[#1b1e2b] text-gray-300 rounded-lg shadow-lg border border-zinc-800 h-full flex flex-col text-xs font-medium relative"
        >
            <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-[#252836]">
                <div className="font-bold text-white uppercase tracking-wider text-xs">Squad</div>
                <div className="flex space-x-2">
                    <button className="px-2 py-0.5 bg-[#374151] rounded text-white text-[10px] hover:bg-[#4b5563]">Filter</button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[40px_60px_1fr_30px] gap-2 p-2 border-b border-zinc-800 bg-[#2b2f3e] text-gray-500 uppercase text-[10px]">
                <div className="text-center">PK</div>
                <div className="text-center">Position</div>
                <div>Player</div>
                <div></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-40"> {/* Extra padding for menu */}
                {sortedPlayers.map((player) => {
                    const isOnPitch = pitchPlayers.some(p => p.player.id === player.id);
                    const assignedLine = getAssignedLine(player.id);
                    const isMenuOpen = openMenuId === player.id;

                    return (
                        <div
                            key={player.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, player, 'list')}
                            className={`grid grid-cols-[40px_60px_1fr_30px] gap-2 p-2 border-b border-zinc-800 hover:bg-[#2c3040] items-center cursor-grab select-none relative ${isOnPitch ? 'bg-[#1a4a2c]/20' : ''}`}
                        >
                            {/* PK (Assigned Position) */}
                            <div className={`text-center font-bold ${isOnPitch ? 'text-green-400' : 'text-gray-600'}`}>
                                {assignedLine}
                            </div>

                            {/* Natural Position */}
                            <div className="text-center font-bold text-blue-300">
                                {player.position}
                            </div>

                            {/* Player Name & Number */}
                            <div className="flex items-center space-x-2 truncate">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${isOnPitch ? 'bg-green-600' : 'bg-gray-700'}`}>
                                    {player.number}
                                </div>
                                <span className={`font-semibold truncate ${isOnPitch ? 'text-green-100' : 'text-white'}`}>{player.name}</span>
                            </div>

                            {/* Menu Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={(e) => toggleMenu(e, player.id)}
                                    className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors"
                                >
                                    <MoreHorizontal size={14} />
                                </button>

                                {isMenuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-8 top-0 z-50 w-64 bg-[#252836] border border-zinc-700 rounded-md shadow-2xl overflow-hidden flex flex-col"
                                        style={{ transform: 'translateY(10px)' }}
                                    >
                                        <div className="px-3 py-2 bg-[#1b1e2b] border-b border-zinc-700 text-[10px] font-bold text-gray-400 uppercase">
                                            Assign Position
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {formation.lines.map(line => {
                                                const currentPlayers = lineAssignments[line.id] || [];
                                                // Generate slots: max of players or max slots
                                                const slots = [];
                                                for (let i = 0; i < line.max; i++) {
                                                    const existingPlayer = currentPlayers[i]; // May be undefined
                                                    slots.push({ index: i, player: existingPlayer });
                                                }

                                                return slots.map((slot, idx) => (
                                                    <button
                                                        key={`${line.id}-${idx}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAssign(player, line.id, slot.player?.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-[#374151] flex items-center justify-between group transition-colors border-b border-zinc-700/50 last:border-0"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-yellow-500 w-8">{line.id}</span>
                                                            {slot.player ? (
                                                                <span className="text-white truncate">{slot.player.name}</span>
                                                            ) : (
                                                                <span className="text-gray-500 italic">Empty</span>
                                                            )}
                                                        </div>
                                                        {slot.player ? (
                                                            <div className="text-[9px] bg-blue-600/20 text-blue-400 px-1.5 rounded uppercase font-bold tracking-wider">Swap</div>
                                                        ) : (
                                                            <div className="text-[9px] bg-green-600/20 text-green-400 px-1.5 rounded uppercase font-bold tracking-wider">Assign</div>
                                                        )}
                                                    </button>
                                                ));
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
