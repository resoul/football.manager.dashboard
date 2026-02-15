export type LineId = 'GK' | 'DEF' | 'CDM' | 'MID' | 'CAM' | 'ATT';

export interface TacticalLine {
    id: LineId;
    y: number; // Percentage from top (0-100)
    max: number; // Max players in this line for specific formation
}

export interface Formation {
    name: string;
    lines: TacticalLine[];
}

export const FORMATIONS: Record<string, Formation> = {
    '4-3-3': {
        name: '4-3-3',
        lines: [
            { id: 'GK', y: 90, max: 1 },
            { id: 'DEF', y: 70, max: 4 },
            { id: 'MID', y: 45, max: 3 },
            { id: 'ATT', y: 15, max: 3 },
        ]
    },
    '4-4-2': {
        name: '4-4-2',
        lines: [
            { id: 'GK', y: 90, max: 1 },
            { id: 'DEF', y: 70, max: 4 },
            { id: 'MID', y: 45, max: 4 },
            { id: 'ATT', y: 15, max: 2 },
        ]
    },
    '3-5-2': {
        name: '3-5-2',
        lines: [
            { id: 'GK', y: 90, max: 1 },
            { id: 'DEF', y: 70, max: 3 },
            { id: 'MID', y: 45, max: 5 },
            { id: 'ATT', y: 15, max: 2 },
        ]
    },
    '5-3-2': {
        name: '5-3-2',
        lines: [
            { id: 'GK', y: 90, max: 1 },
            { id: 'DEF', y: 70, max: 5 },
            { id: 'MID', y: 45, max: 3 },
            { id: 'ATT', y: 15, max: 2 },
        ]
    }
};

export const DEFAULT_FORMATION = '4-3-3';
