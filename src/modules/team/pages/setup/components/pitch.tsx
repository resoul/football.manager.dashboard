import { useRef } from 'react';
import type { Player } from '../data';
import { PitchPlayer } from './pitch-player';


interface PitchProps {
    players: Array<{ player: Player | null; position: { x: number; y: number }; lineId: string; index: number }>;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'pitch') => void;
    onSwap: (source: Player, target: Player) => void;
    onAssign: (source: Player, lineId: string, targetId?: string, index?: number) => void;
}

export function Pitch({ players, onDragStart, onSwap, onAssign }: PitchProps) {
    const pitchRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    return (
        <div
            ref={pitchRef}
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
                <div
                    key={`${p.lineId}-${p.index}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20"
                    style={{ left: `${p.position.x}%`, top: `${p.position.y}%` }}
                >
                    {p.player ? (
                        <PitchPlayer
                            player={p.player}
                            position={p.position}
                            onDragStart={onDragStart}
                            onSwap={onSwap}
                        />
                    ) : (
                        <div
                            className="w-12 h-12 rounded-full border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                    const sourceData = JSON.parse(e.dataTransfer.getData('player')) as Player;
                                    onAssign(sourceData, p.lineId, undefined, p.index);
                                } catch (err) { console.error(err) }
                            }}
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
