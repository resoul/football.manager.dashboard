import { useState, useMemo, useCallback } from 'react';
import type { Player } from './data';
import { FORMATIONS, type LineId, DEFAULT_FORMATION } from './formations';

export interface PitchPlayer {
    player: Player | null; // Can be null (empty slot)
    lineId: LineId;
    index: number; // Index within the line (0 to max-1) for sorting/display
}

export function useTactics(initialPlayers: Player[]) {
    const [formationKey, setFormationKey] = useState<string>(DEFAULT_FORMATION);

    // Store assignment by LineId. 
    // We map lineId -> array of (Player | null). 
    // Array length is ALWAYS fixed to line.max.
    // Helper to get initial assignments (Auto Pick logic)
    const getAutoPickAssignments = (currentFormation: any, players: Player[]) => {
        const assignments: Record<string, (Player | null)[]> = {};
        const availablePlayers = [...players];

        // 1. Pick Goalkeeper
        const gkLine = currentFormation.lines.find((l: any) => l.id === 'GK');
        if (gkLine) {
            assignments['GK'] = new Array(gkLine.max).fill(null);
            // Find a GK
            const gkIndex = availablePlayers.findIndex(p => p.position === 'GK');
            if (gkIndex !== -1) {
                assignments['GK'][0] = availablePlayers[gkIndex];
                availablePlayers.splice(gkIndex, 1);
            } else if (availablePlayers.length > 0) {
                // Fallback to first player
                assignments['GK'][0] = availablePlayers[0];
                availablePlayers.shift();
            }
        }

        // 2. Fill other lines
        currentFormation.lines.forEach((line: any) => {
            if (line.id === 'GK') return; // Already done
            assignments[line.id] = new Array(line.max).fill(null);
            for (let i = 0; i < line.max; i++) {
                if (availablePlayers.length > 0) {
                    // Simple fill for now (could be position smart later)
                    assignments[line.id][i] = availablePlayers[0];
                    availablePlayers.shift();
                }
            }
        });

        return assignments;
    };

    const [lineAssignments, setLineAssignments] = useState<Record<string, (Player | null)[]>>(() => {
        return getAutoPickAssignments(FORMATIONS[DEFAULT_FORMATION], initialPlayers);
    });

    const autoPick = () => {
        setLineAssignments(getAutoPickAssignments(FORMATIONS[formationKey], initialPlayers));
    };

    const clearPitch = () => {
        const formation = FORMATIONS[formationKey];
        const emptyAssignments: Record<string, (Player | null)[]> = {};
        formation.lines.forEach(line => {
            emptyAssignments[line.id] = new Array(line.max).fill(null);
        });
        setLineAssignments(emptyAssignments);
    };

    const formation = useMemo(() => FORMATIONS[formationKey], [formationKey]);

    const pitchPlayersList = useMemo(() => {
        // We need to keep providing position for layout.

        // Let's return extended object for UI
        const uiList: { player: Player | null; position: { x: number; y: number }; lineId: string; index: number }[] = [];

        formation.lines.forEach(line => {
            const playersInLine = lineAssignments[line.id] || new Array(line.max).fill(null);
            const count = line.max; // Use max capacity for distribution to keep slots fixed positions?
            // OR use playersInLine with nulls. Since we initialize with nulls, length IS count.

            playersInLine.forEach((player, index) => {
                // Calculate X based on even distribution of SLOTS
                const x = (index + 1) * (100 / (count + 1));
                uiList.push({
                    player,
                    lineId: line.id,
                    index,
                    position: { x, y: line.y }
                });
            });
        });
        return uiList;
    }, [formation, lineAssignments]);

    const handleFormationChange = (newFormationKey: string) => {
        setFormationKey(newFormationKey);
        const newFormation = FORMATIONS[newFormationKey];

        // Gather all current players (ignoring nulls)
        const allPlayers: Player[] = [];
        Object.values(lineAssignments).forEach(line => {
            line.forEach(p => {
                if (p) allPlayers.push(p);
            });
        });

        const newAssignments: Record<string, (Player | null)[]> = {};
        let playerIdx = 0;

        // Fill new formation slots
        newFormation.lines.forEach(line => {
            newAssignments[line.id] = new Array(line.max).fill(null);
            for (let i = 0; i < line.max; i++) {
                if (playerIdx < allPlayers.length) {
                    newAssignments[line.id][i] = allPlayers[playerIdx];
                    playerIdx++;
                }
            }
        });

        setLineAssignments(newAssignments);
    };

    const removePlayer = (playerId: string) => {
        setLineAssignments(prev => {
            const nextState = { ...prev };
            Object.keys(nextState).forEach(key => {
                // Replace matching player with null
                nextState[key] = nextState[key].map(p => (p && p.id === playerId) ? null : p);
            });
            return nextState;
        });
    };

    // New generic assigner: Add or Swap
    // If targetIndex is provided, we try to put player there.
    const assignPlayer = (player: Player, lineId: string, targetIndex?: number) => {
        setLineAssignments(prev => {
            const nextState = { ...prev };

            // 1. Remove player from any existing position
            Object.keys(nextState).forEach(key => {
                nextState[key] = nextState[key].map(p => (p && p.id === player.id) ? null : p);
            });

            // 2. Add to target
            const targetLine = [...(nextState[lineId] || [])];
            const lineConfig = formation.lines.find(l => l.id === lineId);

            if (!lineConfig) return prev;

            // Allow array to be created if missing (shouldn't happen with init)
            if (targetLine.length !== lineConfig.max) {
                // resize/reset if corrupted?
                while (targetLine.length < lineConfig.max) targetLine.push(null);
            }

            if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < lineConfig.max) {
                // specific slot
                const occupant = targetLine[targetIndex];
                if (occupant) {
                    // Swap? For now, we are "assigning" so we overwrite?
                    // But logically if I drag A to B, B should go... where? 
                    // If B is Player, they go to list (removed). 
                    // OR we can swap them to A's old position?
                    // A's old position is already cleared in step 1.
                    // Let's just overwrite for specific assignment (B goes to bench), 
                    // unless we implement explicit Swap function.
                    // User interaction: "Assign" usually implies placement.
                    // If we want swap, we should use swapPlayers.
                }
                targetLine[targetIndex] = player;
            } else {
                // First empty slot
                const emptyIndex = targetLine.findIndex(p => p === null);
                if (emptyIndex !== -1) {
                    targetLine[emptyIndex] = player;
                } else {
                    // Line full. Replace first one? Or reject?
                    // Let's reject for now if full and no specific index
                    return prev;
                }
            }

            nextState[lineId] = targetLine;
            return nextState;
        });
    };

    // Wrapper for legacy addPlayerToLine compatibility
    const addPlayerToLine = (player: Player, lineId: string) => {
        assignPlayer(player, lineId);
    };

    const isLineFull = useCallback((lineId: string) => {
        const currentLine = lineAssignments[lineId] || [];
        return currentLine.every(p => p !== null);
    }, [lineAssignments]);

    const swapPlayers = (playerA: Player, playerB: Player) => {
        setLineAssignments(prev => {
            const nextState = { ...prev };
            let lineA = ''; let indexA = -1;
            let lineB = ''; let indexB = -1;

            // Find locations
            Object.keys(nextState).forEach(key => {
                nextState[key].forEach((p, idx) => {
                    if (p && p.id === playerA.id) { lineA = key; indexA = idx; }
                    if (p && p.id === playerB.id) { lineB = key; indexB = idx; }
                });
            });

            if (lineA && lineB) {
                // Swap in place
                const valA = nextState[lineA][indexA];
                const valB = nextState[lineB][indexB]; // Should be playerB

                // Clone arrays
                nextState[lineA] = [...nextState[lineA]];
                nextState[lineB] = [...nextState[lineB]];

                // If same line, we are manipulating same array reference if we don't be careful
                if (lineA === lineB) {
                    nextState[lineA][indexA] = valB;
                    nextState[lineA][indexB] = valA;
                } else {
                    nextState[lineA][indexA] = valB;
                    nextState[lineB][indexB] = valA;
                }
                return nextState;
            }
            // Handle List <-> Pitch swap
            // If A is list (not found), B is pitch (found)
            if (!lineA && lineB) {
                nextState[lineB] = [...nextState[lineB]];
                nextState[lineB][indexB] = playerA; // Replace B with A
                return nextState;
            }

            // If A pitch, B list
            if (lineA && !lineB) {
                nextState[lineA] = [...nextState[lineA]];
                nextState[lineA][indexA] = playerB;
                return nextState;
            }

            return prev;
        });
    };

    return {
        formation,
        pitchPlayersList,
        lineAssignments, // Now Record<string, (Player|null)[]>
        setLineAssignments,
        handleFormationChange,
        addPlayerToLine,
        assignPlayer, // New specific assign
        removePlayer,
        isLineFull,
        swapPlayers,
        autoPick,
        clearPitch
    };
}
