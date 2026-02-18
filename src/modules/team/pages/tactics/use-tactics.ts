import { useState, useMemo, useCallback } from 'react';
import type { Player } from './data';
import { FORMATIONS, DEFAULT_FORMATION } from './formations';

export function useTactics(initialPlayers: Player[]) {
    const [formationKey, setFormationKey] = useState<string>(DEFAULT_FORMATION);
    // slotId -> Player
    const [assignments, setAssignments] = useState<Record<string, Player>>({});

    const formation = useMemo(() => FORMATIONS[formationKey], [formationKey]);

    // ── Move / swap ─────────────────────────────────────────────────────────
    const movePlayer = useCallback((player: Player, toSlotId: string) => {
        setAssignments(prev => {
            const next = { ...prev };

            // Find current slot of this player (if on pitch)
            const fromSlot = Object.entries(next).find(([, p]) => p.id === player.id)?.[0] ?? null;

            // Remove player from current slot
            if (fromSlot) delete next[fromSlot];

            // If target has occupant AND player came from pitch → swap occupant to fromSlot
            const occupant = next[toSlotId];
            if (occupant && fromSlot) {
                const fromSlotDef = formation.positions.find(s => s.id === fromSlot);
                // Adapt occupant to the slot it's moving into (fromSlot)
                next[fromSlot] = fromSlotDef
                    ? { ...occupant, role: fromSlotDef.defaultRole, duty: fromSlotDef.defaultDuty }
                    : occupant;
            }

            // Adapt player to target slot role/duty
            const toSlotDef = formation.positions.find(s => s.id === toSlotId);
            next[toSlotId] = toSlotDef
                ? { ...player, role: toSlotDef.defaultRole, duty: toSlotDef.defaultDuty }
                : player;

            return next;
        });
    }, [formation]);

    // ── Remove from pitch ───────────────────────────────────────────────────
    const removePlayer = useCallback((playerId: string) => {
        setAssignments(prev => {
            const next = { ...prev };
            const slot = Object.entries(next).find(([, p]) => p.id === playerId)?.[0];
            if (slot) delete next[slot];
            return next;
        });
    }, []);

    // ── Auto pick ───────────────────────────────────────────────────────────
    const autoPick = useCallback(() => {
        const pool = [...initialPlayers];

        const popBest = (naturalFor: string[], accomplishedFor: string[]): Player | undefined => {
            for (const code of naturalFor) {
                const idx = pool.findIndex(p =>
                    p.position === code || p.position.startsWith(code) || code.startsWith(p.position),
                );
                if (idx !== -1) return pool.splice(idx, 1)[0];
            }
            for (const code of accomplishedFor) {
                const idx = pool.findIndex(p =>
                    p.position === code || p.position.startsWith(code) || code.startsWith(p.position),
                );
                if (idx !== -1) return pool.splice(idx, 1)[0];
            }
            return pool.shift();
        };

        const next: Record<string, Player> = {};

        // GK first
        const gkSlot = formation.positions.find(s => s.label === 'GK');
        if (gkSlot) {
            const gk = pool.find(p => p.position === 'GK');
            if (gk) {
                next[gkSlot.id] = { ...gk, role: gkSlot.defaultRole, duty: gkSlot.defaultDuty };
                pool.splice(pool.indexOf(gk), 1);
            }
        }

        formation.positions.forEach(slot => {
            if (slot.label === 'GK') return;
            const p = popBest(slot.naturalFor, slot.accomplishedFor);
            if (p) next[slot.id] = { ...p, role: slot.defaultRole, duty: slot.defaultDuty };
        });

        setAssignments(next);
    }, [formation, initialPlayers]);

    // ── Clear ───────────────────────────────────────────────────────────────
    const clearPitch = useCallback(() => setAssignments({}), []);

    // ── Formation change ────────────────────────────────────────────────────
    const handleFormationChange = useCallback((newKey: string) => {
        const newFormation = FORMATIONS[newKey];

        const onPitch = Object.values(assignments);
        const rest = initialPlayers.filter(p => !onPitch.find(op => op.id === p.id));
        const pool = [...onPitch, ...rest];

        const popBest = (naturalFor: string[], accomplishedFor: string[]): Player | undefined => {
            for (const code of naturalFor) {
                const idx = pool.findIndex(p =>
                    p.position === code || p.position.startsWith(code) || code.startsWith(p.position),
                );
                if (idx !== -1) return pool.splice(idx, 1)[0];
            }
            for (const code of accomplishedFor) {
                const idx = pool.findIndex(p =>
                    p.position === code || p.position.startsWith(code) || code.startsWith(p.position),
                );
                if (idx !== -1) return pool.splice(idx, 1)[0];
            }
            return pool.shift();
        };

        const next: Record<string, Player> = {};

        const gkSlot = newFormation.positions.find(s => s.label === 'GK');
        if (gkSlot) {
            const gk = pool.find(p => p.position === 'GK');
            if (gk) {
                next[gkSlot.id] = { ...gk, role: gkSlot.defaultRole, duty: gkSlot.defaultDuty };
                pool.splice(pool.indexOf(gk), 1);
            }
        }
        newFormation.positions.forEach(slot => {
            if (slot.label === 'GK') return;
            const p = popBest(slot.naturalFor, slot.accomplishedFor);
            if (p) next[slot.id] = { ...p, role: slot.defaultRole, duty: slot.defaultDuty };
        });

        setFormationKey(newKey);
        setAssignments(next);
    }, [assignments, initialPlayers]);

    return {
        formation,
        formationKey,
        assignments,
        handleFormationChange,
        movePlayer,
        removePlayer,
        autoPick,
        clearPitch,
    };
}