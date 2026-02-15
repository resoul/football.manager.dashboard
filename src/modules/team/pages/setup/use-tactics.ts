import { useState, useMemo, useCallback } from 'react';
import type { Player } from './data';
import { FORMATIONS, type LineId, DEFAULT_FORMATION } from './formations';

export interface PitchPlayer {
    player: Player;
    lineId: LineId;
    index: number; // Index within the line (0 to max-1) for sorting/display
}

export function useTactics(initialPlayers: Player[]) {
    const [formationKey, setFormationKey] = useState<string>(DEFAULT_FORMATION);

    // Store assignment by LineId. 
    // We map lineId -> array of players. 
    // This makes it easy to "distribute evenly" because we just render the array length.
    // Helper to get initial assignments (Auto Pick logic)
    const getAutoPickAssignments = (currentFormation: any, players: Player[]) => {
        const assignments: Record<string, Player[]> = {};
        const availablePlayers = [...players];

        // 1. Pick Goalkeeper
        const gkLine = currentFormation.lines.find((l: any) => l.id === 'GK');
        if (gkLine) {
            assignments['GK'] = [];
            // Find a GK
            const gkIndex = availablePlayers.findIndex(p => p.position === 'GK');
            if (gkIndex !== -1) {
                assignments['GK'].push(availablePlayers[gkIndex]);
                availablePlayers.splice(gkIndex, 1);
            } else if (availablePlayers.length > 0) {
                // Fallback to first player
                assignments['GK'].push(availablePlayers[0]);
                availablePlayers.shift();
            }
        }

        // 2. Fill other lines
        currentFormation.lines.forEach((line: any) => {
            if (line.id === 'GK') return; // Already done
            assignments[line.id] = [];
            for (let i = 0; i < line.max; i++) {
                if (availablePlayers.length > 0) {
                    // Simple fill for now (could be position smart later)
                    assignments[line.id].push(availablePlayers[0]);
                    availablePlayers.shift();
                }
            }
        });

        return assignments;
    };

    const [lineAssignments, setLineAssignments] = useState<Record<string, Player[]>>(() => {
        return getAutoPickAssignments(FORMATIONS[DEFAULT_FORMATION], initialPlayers);
    });

    const autoPick = () => {
        setLineAssignments(getAutoPickAssignments(FORMATIONS[formationKey], initialPlayers));
    };

    const formation = useMemo(() => FORMATIONS[formationKey], [formationKey]);

    // Derived state: Flatten players for the PlayerList to know who is selected
    const pitchPlayersList = useMemo(() => {
        const list: { player: Player; position: { x: number; y: number } }[] = [];
        formation.lines.forEach(line => {
            const playersInLine = lineAssignments[line.id] || [];
            playersInLine.forEach((player, index) => {
                // Calculate X based on even distribution
                // 1 player: 50%
                // 2 players: 33%, 66% ? Or spread wider?
                // Let's use: (index + 1) * (100 / (count + 1))
                const count = playersInLine.length;
                const x = (index + 1) * (100 / (count + 1));
                list.push({
                    player,
                    position: { x, y: line.y }
                });
            });
        });
        return list;
    }, [formation, lineAssignments]);

    const handleFormationChange = (newFormationKey: string) => {
        setFormationKey(newFormationKey);
        const newFormation = FORMATIONS[newFormationKey];

        // Redistribute players to fit new limits
        // Gather all current players
        const allPlayers: Player[] = [];
        Object.values(lineAssignments).forEach(players => allPlayers.push(...players));

        const newAssignments: Record<string, Player[]> = {};
        let playerIdx = 0;

        // Fill lines according to new max
        newFormation.lines.forEach(line => {
            newAssignments[line.id] = [];
            for (let i = 0; i < line.max; i++) {
                if (playerIdx < allPlayers.length) {
                    newAssignments[line.id].push(allPlayers[playerIdx]);
                    playerIdx++;
                }
            }
        });

        // If we have excess players (e.g. going 4-4-2 to 4-3-3, 1 player left out), 
        // they are removed from pitch (returned to squad implicitly) state-wise.
        setLineAssignments(newAssignments);
    };

    const addPlayerToLine = (player: Player, lineId: string) => {
        setLineAssignments(prev => {
            const currentLine = prev[lineId] || [];
            const lineConfig = formation.lines.find(l => l.id === lineId);

            if (!lineConfig) return prev;

            // If line is full, do we swap? Or reject?
            // Requirement: "If line is filled - return player back"
            if (currentLine.length >= lineConfig.max) {
                return prev;
            }

            // Check if player is already in THIS line
            if (currentLine.find(p => p.id === player.id)) return prev;

            // Check if player is in OTHER lines, remove them first
            const nextState = { ...prev };
            Object.keys(nextState).forEach(key => {
                nextState[key] = nextState[key].filter(p => p.id !== player.id);
            });

            // Add to new line
            nextState[lineId] = [...(nextState[lineId] || []), player];
            return nextState;
        });
    };

    const removePlayer = (playerId: string) => {
        setLineAssignments(prev => {
            const nextState = { ...prev };
            Object.keys(nextState).forEach(key => {
                nextState[key] = nextState[key].filter(p => p.id !== playerId);
            });
            return nextState;
        });
    };

    const isLineFull = useCallback((lineId: string) => {
        const currentLine = lineAssignments[lineId] || [];
        const lineConfig = formation.lines.find(l => l.id === lineId);
        return lineConfig ? currentLine.length >= lineConfig.max : true;
    }, [formation, lineAssignments]);

    const swapPlayers = (playerA: Player, playerB: Player) => {
        setLineAssignments(prev => {
            const nextState = { ...prev };
            let lineA: string | undefined;
            let lineB: string | undefined;

            // Find lines for both players
            Object.keys(nextState).forEach(key => {
                if (nextState[key].find(p => p.id === playerA.id)) lineA = key;
                if (nextState[key].find(p => p.id === playerB.id)) lineB = key;
            });

            // Case 1: Both on pitch (Swap positions)
            // Case 1: Both on pitch (Swap positions)
            if (lineA && lineB) {
                if (lineA === lineB) {
                    // Same line swap
                    nextState[lineA] = nextState[lineA].map(p => {
                        if (p.id === playerA.id) return playerB;
                        if (p.id === playerB.id) return playerA;
                        return p;
                    });
                } else {
                    // Different line swap
                    // Replace A with B in line A
                    nextState[lineA] = nextState[lineA].map(p => p.id === playerA.id ? playerB : p);
                    // Replace B with A in line B
                    nextState[lineB] = nextState[lineB].map(p => p.id === playerB.id ? playerA : p);
                }
                return nextState;
            }

            // Case 2: A is from List, B is on Pitch (Substitution)
            if (!lineA && lineB) {
                // Remove B from line B and add A
                // Effectively replacing B with A
                nextState[lineB] = nextState[lineB].map(p => p.id === playerB.id ? playerA : p);
                return nextState;
            }

            // Case 3: A on Pitch, B from List (Reverse substitution? Drag pitch player to list player?)
            // Not typical drag flow but handled logic wise:
            if (lineA && !lineB) {
                nextState[lineA] = nextState[lineA].map(p => p.id === playerA.id ? playerB : p);
                return nextState;
            }

            return prev;
        });
    };

    return {
        formation,
        pitchPlayersList,
        lineAssignments,
        setLineAssignments,
        handleFormationChange,
        addPlayerToLine,
        removePlayer,
        isLineFull,
        swapPlayers,
        autoPick
    };
}
