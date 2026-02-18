// 17 static ghost slots: 1 GK, 5 DEF, 5 MID, 3 AM, 3 ST
export interface GhostSlot {
    id: string;
    x: number; // % from left
    y: number; // % from top
    isGK: boolean;
}

export const GHOST_SLOTS: GhostSlot[] = [
    // GK (1)
    { id: 'ghost-gk',    x: 50, y: 90, isGK: true },

    // Defenders (5)
    { id: 'ghost-d1',    x: 10, y: 73, isGK: false },
    { id: 'ghost-d2',    x: 28, y: 73, isGK: false },
    { id: 'ghost-d3',    x: 50, y: 73, isGK: false },
    { id: 'ghost-d4',    x: 72, y: 73, isGK: false },
    { id: 'ghost-d5',    x: 90, y: 73, isGK: false },

    // Midfielders (5)
    { id: 'ghost-m1',    x: 10, y: 52, isGK: false },
    { id: 'ghost-m2',    x: 28, y: 52, isGK: false },
    { id: 'ghost-m3',    x: 50, y: 52, isGK: false },
    { id: 'ghost-m4',    x: 72, y: 52, isGK: false },
    { id: 'ghost-m5',    x: 90, y: 52, isGK: false },

    // Attacking mids (3)
    { id: 'ghost-am1',   x: 25, y: 33, isGK: false },
    { id: 'ghost-am2',   x: 50, y: 33, isGK: false },
    { id: 'ghost-am3',   x: 75, y: 33, isGK: false },

    // Strikers (3)
    { id: 'ghost-st1',   x: 25, y: 14, isGK: false },
    { id: 'ghost-st2',   x: 50, y: 14, isGK: false },
    { id: 'ghost-st3',   x: 75, y: 14, isGK: false },
];

// Snap radius in % units (pitch-relative)
export const SNAP_RADIUS = 8;