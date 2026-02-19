import { type MenuItem } from '@/layout/components/types';

export const getMenuItems = (): MenuItem => {
    return {
        children: [
            { title: 'Competitions', path: '/competitions' },
        ]
    }
}
