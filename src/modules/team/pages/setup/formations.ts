export interface GridPosition {
    row: number; // 0-5 (6 rows)
    col: number; // 0-4 (5 cols)
    label?: string; // Optional position label like 'GK', 'ST'
}

export interface Formation {
    name: string;
    positions: GridPosition[];
}

export const FIELD_ROWS = 6;
export const FIELD_COLS = 5;

// Helper to create grid index
export const getGridIndex = (row: number, col: number) => row * FIELD_COLS + col;

export const FORMATIONS: Record<string, Formation> = {
    '4-4-2': {
        name: '4-4-2',
        positions: [
            // GK - Row 6 (index 5) Bottom
            { row: 5, col: 2, label: 'GK' },

            // Defenders - Row 5 (index 4)
            { row: 4, col: 0, label: 'DL' },
            { row: 4, col: 1, label: 'DC' },
            { row: 4, col: 3, label: 'DC' },
            { row: 4, col: 4, label: 'DR' },

            // Midfielders - Row 3 (index 2)
            { row: 2, col: 0, label: 'ML' },
            { row: 2, col: 1, label: 'MC' },
            { row: 2, col: 3, label: 'MC' },
            { row: 2, col: 4, label: 'MR' },

            // Forwards - Row 1 (index 0) Top
            { row: 0, col: 1, label: 'ST' },
            { row: 0, col: 3, label: 'ST' },
        ]
    },
    '3-5-2': {
        name: '3-5-2',
        positions: [
            // GK
            { row: 5, col: 2, label: 'GK' },

            // 3 Defenders - Row 5 (index 4)
            { row: 4, col: 1, label: 'DC' },
            { row: 4, col: 2, label: 'DC' },
            { row: 4, col: 3, label: 'DC' },

            // 5 Midfielders
            // Wingbacks - Row 4 (index 3)
            { row: 3, col: 0, label: 'WBL' },
            { row: 3, col: 4, label: 'WBR' },

            // Center Mids - Row 3 (index 2)
            { row: 2, col: 1, label: 'MC' },
            { row: 2, col: 3, label: 'MC' },

            // CAM - Row 2 (index 1)
            { row: 1, col: 2, label: 'AMC' },

            // 2 Forwards - Row 1 (index 0)
            { row: 0, col: 1, label: 'ST' },
            { row: 0, col: 3, label: 'ST' },
        ]
    }
};

export const DEFAULT_FORMATION = '4-4-2';
