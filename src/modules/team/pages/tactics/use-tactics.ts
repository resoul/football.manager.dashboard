import { useState, useMemo, useCallback } from 'react';
import type { Player } from './data';
import { FORMATIONS, type Formation, DEFAULT_FORMATION, FIELD_ROWS, FIELD_COLS } from './formations';

// Helper to generate key
const getKey = (row: number, col: number) => `${row}-${col}`;

export function useTactics(initialPlayers: Player[]) {
    const [formationKey, setFormationKey] = useState<string>(DEFAULT_FORMATION);

    // State: Map "row-col" -> Player
    const [gridAssignments, setGridAssignments] = useState<Record<string, Player>>({});

    const formation = useMemo(() => FORMATIONS[formationKey], [formationKey]);

    // Initial Auto-pick when formation changes or on mount
    // We'll expose a function to do this, but maybe not auto-trigger on simple formation switch to preserve players?
    // User requirement: "Switching tactics". Usually we want to try to keep players or reset?
    // Let's implement autoPick that resets based on formation.

    const autoPick = useCallback(() => {
        const newAssignments: Record<string, Player> = {};
        const availablePlayers = [...initialPlayers];

        // Helper to find and remove player
        const popPlayer = (rolePreference: string) => {
            // Simplified matching: match string in position?
            // Real logic would be more complex.
            const idx = availablePlayers.findIndex(p => p.position.includes(rolePreference));
            if (idx !== -1) {
                const [p] = availablePlayers.splice(idx, 1);
                return p;
            }
            // Fallback: any player
            return availablePlayers.shift();
        };

        // 1. Assign GK
        const gkPos = formation.positions.find(p => p.label === 'GK');
        if (gkPos) {
            const gk = availablePlayers.find(p => p.position === 'GK') || availablePlayers[0];
            if (gk) {
                newAssignments[getKey(gkPos.row, gkPos.col)] = gk;
                const idx = availablePlayers.indexOf(gk);
                if (idx > -1) availablePlayers.splice(idx, 1);
            }
        }

        // 2. Assign others based on formation slots
        formation.positions.forEach(pos => {
            if (pos.label === 'GK') return; // already done
            const player = popPlayer(pos.label?.charAt(0) || ''); // Rough match "D", "M", "S"
            if (player) {
                newAssignments[getKey(pos.row, pos.col)] = player;
            }
        });

        setGridAssignments(newAssignments);
    }, [formation, initialPlayers]);


    const clearPitch = () => {
        setGridAssignments({});
    };

    // Initialize once if empty? 
    // For now we'll start empty or let the page component call autoPick.
    // Let's initialize with an autopick for 4-4-2
    useMemo(() => {
        // We can't set state in useMemo easily without effects, but we can init state lazy.
        // Let's just default to empty, and let the user click "Reset" or "Auto" 
        // OR we init state in useState.
    }, []);

    const handleFormationChange = (newKey: string) => {
        setFormationKey(newKey);
        // Optional: Re-arrange players?
        // For now, let's just clear or keep them if they are in valid slots?
        // The user request implies changing tactics re-arranges the field.
        // "Select tactics: 4-4-2 ... GK -> row 1 col 3"
        // This suggests selecting a tactic APPLIES that arrangement.
        // So we should probably run auto-pick or re-distribute best effort.

        // We'll allow the UI to trigger autoPick manually or we can do it here.
        // Let's just set the key, and let a useEffect or similar handle the re-shuffle if we want automatic.
        // Or better: Just implementing a smart re-shuffle here.

        // Re-shuffle logic:
        // Take all currently assigned players.
        // Map them to new slots.

        // BUT, for now, to keep it simple and robust:
        // When changing formation, we will "Auto Pick" from scratch using the Squad to fill the new slots.
        // This ensures the new structure is respected.

        // If we want to keep current players on pitch:
        // const currentOnPitch = Object.values(gridAssignments);
        // ... distribute currentOnPitch into new formation ...

        // Let's stick to the behavior: Change tactic -> Apply template (Auto Pick best fit).
        // note: we can't call autoPick() here directly if it depends on 'formation' state which hasn't updated yet.
        // So we'll accept the newKey param in a helper.

        const newFormation = FORMATIONS[newKey];
        const newAssignments: Record<string, Player> = {};
        const availablePlayers = [...initialPlayers];

        // Very basic redistribution for now: just reset using squad (Auto Pick behavior)
        // Ideally we prioritize players ALREADY on the pitch.

        const currentPitchPlayers = Object.values(gridAssignments);

        // We'll prioritize players currently on pitch to keep them in the team
        const pool = [...currentPitchPlayers, ...initialPlayers.filter(p => !currentPitchPlayers.includes(p))];
        // Unique
        const uniquePool = Array.from(new Set(pool));

        const popPool = (label: string) => {
            let idx = uniquePool.findIndex(p => p.position === label); // Exact match
            if (idx === -1) idx = uniquePool.findIndex(p => p.position.includes(label.charAt(0))); // Partial
            if (idx === -1) idx = 0; // Any

            if (idx !== -1 && uniquePool[idx]) {
                const [p] = uniquePool.splice(idx, 1);
                return p;
            }
            return null;
        };

        newFormation.positions.forEach(pos => {
            const p = popPool(pos.label || '');
            if (p) newAssignments[getKey(pos.row, pos.col)] = p;
        });

        setGridAssignments(newAssignments);
    };

    const movePlayer = (player: Player, toRow: number, toCol: number) => {
        setGridAssignments(prev => {
            const next = { ...prev };
            const targetKey = getKey(toRow, toCol);

            // Checks
            if (toRow < 0 || toRow >= FIELD_ROWS || toCol < 0 || toCol >= FIELD_COLS) return prev;

            // Remove player from old source if they are already on pitch
            const sourceEntry = Object.entries(next).find(([k, p]) => p.id === player.id);
            if (sourceEntry) {
                delete next[sourceEntry[0]];
            }

            // Check target
            const targetOccupant = next[targetKey];

            if (targetOccupant) {
                // Swap
                // If source existed (we just deleted it), put targetOccupant there
                if (sourceEntry) {
                    next[sourceEntry[0]] = targetOccupant;
                } else {
                    // dragged from list -> target occupied.
                    // "Cannot place two players in one cell" -> Reject or Swap?
                    // User said: "Cannot place two players in one cell"
                    // If we strictly follow "Cannot", we should block.
                    // But standard UX is swap or replace.
                    // Let's implement SWAP (target goes to bench if source came from bench? Or just replace?)
                    // If source came from list, and target is occupied, we replace target (target goes to list).
                }
            }

            // Place player
            next[targetKey] = player;
            return next;
        });
    };

    const removePlayer = (playerId: string) => {
        setGridAssignments(prev => {
            const next = { ...prev };
            const entry = Object.entries(next).find(([k, p]) => p.id === playerId);
            if (entry) {
                delete next[entry[0]];
            }
            return next;
        });
    };

    return {
        formation,
        gridAssignments,
        handleFormationChange,
        movePlayer,
        removePlayer,
        autoPick,
        clearPitch
    };
}
