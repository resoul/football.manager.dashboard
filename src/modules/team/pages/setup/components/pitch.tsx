import { useRef, useState } from 'react';
import type { Player } from '../data';
import { PitchPlayer } from './pitch-player';
import type { Formation } from '../formations';

interface PitchProps {
    players: Array<{ player: Player; position: { x: number; y: number } }>;
    formation: Formation;
    onDropLine: (player: Player, lineId: string) => void;
    onPlayerDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'pitch') => void;
    isLineFull: (lineId: string) => boolean;
    onSwap: (source: Player, target: Player) => void;
}

export function Pitch({ players, formation, onDropLine, onPlayerDragStart, isLineFull, onSwap }: PitchProps) {
    const pitchRef = useRef<HTMLDivElement>(null);
    const [activeLine, setActiveLine] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!pitchRef.current) return;

        const rect = pitchRef.current.getBoundingClientRect();
        // Calculate Y as percentage
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Find closest line
        let closestLine = null;
        let minDistance = 1000;

        formation.lines.forEach(line => {
            const dist = Math.abs(line.y - y);
            if (dist < 10) { // Snap range 10%
                if (dist < minDistance) {
                    minDistance = dist;
                    closestLine = line.id;
                }
            }
        });

        setActiveLine(closestLine);
    };

    const handleDragLeave = () => {
        setActiveLine(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActiveLine(null);

        try {
            const player = JSON.parse(e.dataTransfer.getData('player')) as Player;

            // Re-calculate drop line to be sure
            if (!pitchRef.current) return;
            const rect = pitchRef.current.getBoundingClientRect();
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Find closest line logic again (or just use activeLine if we trust sync)
            // Better to recalculate for robustness
            let foundLine: string | null = null;
            let minDist = 1000;

            formation.lines.forEach(line => {
                const dist = Math.abs(line.y - y);
                if (dist < 10 && dist < minDist) {
                    minDist = dist;
                    foundLine = line.id;
                }
            });

            if (foundLine) {
                onDropLine(player, foundLine);
            }

        } catch (error) {
            console.error("Drop error", error);
        }
    };

    return (
        <div
            ref={pitchRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative w-full aspect-[1] bg-[#1a4a2c] rounded overflow-hidden shadow-2xl border border-white/20 select-none"
            style={{
                backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 49px,
                    rgba(255,255,255,0.05) 50px
                )`
            }}
        >
            {/* Virtual Grid / Lines */}
            {formation.lines.map(line => {
                const isFull = isLineFull(line.id);
                const isActive = activeLine === line.id;

                return (
                    <div
                        key={line.id}
                        className={`absolute w-[90%] left-[5%] height-[1px] border-t-2 border-dashed transition-all duration-300 flex items-center justify-center
                            ${isActive ? (isFull ? 'border-red-500 bg-red-500/10 h-[10%]' : 'border-yellow-400 bg-yellow-400/20 h-[10%]') : 'border-white/10 h-0'}
                        `}
                        style={{ top: `${line.y}%`, transform: 'translateY(-50%)' }}
                    >
                        {isActive && (
                            <span className={`text-xs font-bold uppercase ${isFull ? 'text-red-400' : 'text-yellow-400'} bg-black/50 px-2 py-1 rounded`}>
                                {line.id} {isFull ? '(Full)' : ''}
                            </span>
                        )}
                    </div>
                );
            })}

            {/* Field Markings */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[15%] aspect-square border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="absolute top-0 left-1/2 w-[30%] h-[10%] border border-white/20 transform -translate-x-1/2 border-t-0"></div>
            <div className="absolute top-0 left-1/2 w-[15%] h-[4%] border border-white/20 transform -translate-x-1/2 border-t-0"></div>

            <div className="absolute bottom-0 left-1/2 w-[30%] h-[10%] border border-white/20 transform -translate-x-1/2 border-b-0"></div>
            <div className="absolute bottom-0 left-1/2 w-[15%] h-[4%] border border-white/20 transform -translate-x-1/2 border-b-0"></div>

            <div className="absolute top-[2%] left-[2%] text-white/10 text-6xl font-black tracking-tighter rotate-90 origin-top-left">
                TACTICS
            </div>

            {players.map((p) => (
                <PitchPlayer
                    key={p.player.id}
                    player={p.player}
                    position={p.position}
                    onDragStart={onPlayerDragStart}
                    onSwap={onSwap}
                />
            ))}
        </div>
    );
}
