import { SQUAD_PLAYERS, type Player } from './data';
import { Pitch } from './components/pitch';
import { PlayerList } from './components/player-list';
import { Helmet } from '@packages/react-helmet-async';
import { useTactics } from './use-tactics';
import { FORMATIONS } from './formations';

export function SetupPage() {
    const {
        formation,
        pitchPlayersList,
        handleFormationChange,
        addPlayerToLine,
        removePlayer,
        isLineFull,
        swapPlayers,
        autoPick,
        lineAssignments
    } = useTactics(SQUAD_PLAYERS);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'list' | 'pitch') => {
        e.dataTransfer.setData('player', JSON.stringify(player));
        e.dataTransfer.setData('source', source);
    };

    // Passed to Pitch - handles dropping on a specific line
    const handlePitchDrop = (player: Player, lineId: string) => {
        addPlayerToLine(player, lineId);
    };

    // Passed to List - handles removing player from pitch
    const handleListDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        try {
            const player = JSON.parse(e.dataTransfer.getData('player')) as Player;
            const source = e.dataTransfer.getData('source') as 'list' | 'pitch';

            if (source === 'pitch') {
                removePlayer(player.id);
            }
        } catch (error) {
            console.error("Drag and drop error", error);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleAssignPlayer = (sourcePlayer: Player, targetLineId: string, targetPlayerId?: string) => {
        if (targetPlayerId) {
            // Swap with specific player
            const targetPlayer = SQUAD_PLAYERS.find(p => p.id === targetPlayerId);
            if (targetPlayer) {
                swapPlayers(sourcePlayer, targetPlayer);
            }
        } else {
            // Add to empty slot
            addPlayerToLine(sourcePlayer, targetLineId);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#111318] text-white relative font-sans selection:bg-green-500/30">
            <Helmet>
                <title>Team Setup | Football Manager</title>
            </Helmet>

            <div className="flex-1 overflow-hidden p-4 relative z-10">
                <div className="grid grid-cols-12 gap-4 h-full max-w-[1920px] mx-auto">

                    {/* Middle Column - Pitch */}
                    <div className="col-span-8 relative flex flex-col">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-black/40 backdrop-blur rounded p-1 border border-white/10 shadow-xl">
                            {Object.keys(FORMATIONS).map(key => (
                                <button
                                    key={key}
                                    onClick={() => handleFormationChange(key)}
                                    className={`px-3 py-1 text-sm font-bold rounded transition-colors ${formation.name === key
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {key}
                                </button>
                            ))}

                            <div className="w-[1px] h-6 bg-white/20 mx-2"></div>

                            <button
                                onClick={autoPick}
                                className="px-3 py-1 text-sm font-bold rounded text-yellow-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                RESET
                            </button>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center">
                            <Pitch
                                players={pitchPlayersList}
                                formation={formation}
                                onDropLine={handlePitchDrop}
                                onPlayerDragStart={handleDragStart}
                                isLineFull={isLineFull}
                                onSwap={swapPlayers}
                            />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded backdrop-blur text-white text-xs">
                            <div className="font-bold uppercase text-green-400">Team Fluidity</div>
                            <div className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Structured</div>
                        </div>
                    </div>

                    {/* Right Column - Player List */}
                    <div className="col-span-4 h-full overflow-hidden">
                        <PlayerList
                            players={SQUAD_PLAYERS}
                            pitchPlayers={pitchPlayersList}
                            formation={formation}
                            onAssign={handleAssignPlayer}
                            lineAssignments={lineAssignments}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleListDrop}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
