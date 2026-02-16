import { createContext, useContext, type CSSProperties } from 'react';

interface LayoutState {
    style: CSSProperties;
    bodyClassName: string;
    isMobile: boolean;
    sidebarCollapsed: boolean;
    isMailViewExpanded: boolean;
    showMailView: () => void;
    hideMailView: () => void;
    toggleMailView: () => void;
    toggleSidebar: () => void;
}

export const LayoutContext = createContext<LayoutState | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};