import { SQUAD_PLAYERS, type Player } from './data';
import { Pitch } from './components/pitch';
import { PlayerList } from './components/player-list';
import { Helmet } from '@packages/react-helmet-async';
import { useTactics } from './use-tactics';
import { FORMATIONS } from './formations';

export function SetupPage() {
    const {
        formation,
        gridAssignments,
        handleFormationChange,
        movePlayer,
        removePlayer,
        autoPick,
        clearPitch
    } = useTactics(SQUAD_PLAYERS);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player, source: 'list' | 'pitch') => {
        e.dataTransfer.setData('player', JSON.stringify(player));
        e.dataTransfer.setData('source', source);
    };

    // Passed to List - handles removing player from pitch (drop to bench)
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

    // Passed to Pitch - handles placing player on grid
    const handlePitchDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        try {
            const player = JSON.parse(e.dataTransfer.getData('player')) as Player;
            // movePlayer handles both new assignment and movement within grid
            movePlayer(player, row, col);
        } catch (error) {
            console.error("Drop error", error);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
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
                                AUTO
                            </button>

                            <div className="w-[1px] h-6 bg-white/20 mx-2"></div>

                            <button
                                onClick={clearPitch}
                                className="px-3 py-1 text-sm font-bold rounded text-red-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                CLEAR
                            </button>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center p-8">
                            <Pitch
                                gridAssignments={gridAssignments}
                                positions={formation.positions}
                                onDragStart={handleDragStart}
                                onDrop={handlePitchDrop}
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
                            gridAssignments={gridAssignments}
                            positions={formation.positions}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleListDrop}
                            onAssign={(player, row, col) => movePlayer(player, row, col)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
