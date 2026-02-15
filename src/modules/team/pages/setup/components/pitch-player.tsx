import type { Player } from '../data';

interface PitchPlayerProps {
    player: Player;
    position: { x: number; y: number };
    onDragStart: (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'pitch') => void;
    onSwap: (source: Player, target: Player) => void;
}

export function PitchPlayer({ player, position, onDragStart, onSwap }: PitchPlayerProps) {
    const getRoleColor = (duty: string) => {
        switch (duty.toLowerCase()) {
            case 'attack': return 'bg-orange-500';
            case 'support': return 'bg-green-500';
            case 'defend': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const draggedPlayer = JSON.parse(e.dataTransfer.getData('player')) as Player;
            // Determine if we should swap. 
            // If dropping on self, do nothing.
            if (draggedPlayer.id !== player.id) {
                onSwap(draggedPlayer, player);
            }
        } catch (error) {
            console.error("Swap error", error);
        }
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, player, 'pitch')}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'grab',
                zIndex: 10,
            }}
            className="flex flex-col items-center group w-24 select-none"
        >
            {/* Jersey / Circle */}
            <div className="relative shadow-xl transition-transform transform group-hover:scale-110">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-black/20">
                    {player.number}
                </div>
                {/* Rating / Form Circle indicator - optional */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold ${getRoleColor(player.duty)}`}>
                    {player.duty[0]}
                </div>
            </div>

            {/* Name Box */}
            <div className="mt-1 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow backdrop-blur-sm text-center min-w-[60px] truncate border border-white/10">
                {player.name}
            </div>

            {/* Role Box */}
            <div className="mt-0.5 bg-green-700/90 text-white text-[9px] px-1.5 py-0.5 rounded shadow font-semibold uppercase tracking-wider flex items-center space-x-1 border border-green-600/50">
                <span>{player.role}</span>
                <span className="opacity-75">-</span>
                <span className={`text-[8px] ${player.duty === 'Attack' ? 'text-orange-200' : 'text-blue-100'}`}>{player.duty.substring(0, 2)}</span>
            </div>
        </div>
    );
}
