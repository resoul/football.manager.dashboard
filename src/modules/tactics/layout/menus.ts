import { type MenuItem } from '@/layout/components/types';

export const getMenuItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/tactics/overview' },
            { title: 'Player', path: '/tactics/player' },
            { title: 'Set Pieces', children: [
                    { title: 'Set Piece Takers', path: '/tactics/set-piece-takers' },
                    { title: 'Corners', path: '/tactics/corners' },
                    { title: 'Free Kicks', path: '/tactics/free-kicks' },
                    { title: 'Throw-Ins', path: '/tactics/throw-ins' },
                    { title: 'Penalties', path: '/tactics/penalties' },
                ] },
            { title: 'Captains', path: '/tactics/captains' },
            { title: 'Match Plans', path: '/tactics/match-plans' },
            { title: 'Opposition Instructions', path: '/tactics/opposition-instructions' },
        ]
    }
}
