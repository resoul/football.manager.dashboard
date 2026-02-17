import { type ReactNode, type CSSProperties, useEffect, useMemo, useState } from 'react';
import { LayoutContext, type HeaderData } from "./use-layout";
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from '@/components/tooltip';
import { useLocalStorage } from "@/hooks/use-local-storage";

interface LayoutProviderProps {
    sidebarCollapsed?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    bodyClassName?: string;
}

export function LayoutProvider({ children, style: customStyle, bodyClassName = '', sidebarCollapsed = false}: LayoutProviderProps) {
    const isMobile = useIsMobile();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('sidebar-collapsed', sidebarCollapsed);
    const [isMailViewExpanded, setIsMailViewExpanded] = useState(false);
    const [headerData, setHeaderData] = useState<HeaderData | undefined>();

    const defaultCssVariables = {
        '--sidebar-width': '240px',
        '--sidebar-width-collapse': '60px',
        '--sidebar-width-mobile': '240px',
        '--header-height-mobile': '60px',
        '--aside-width': '10px',
        '--aside-width-mobile': '10px',
        '--page-space': '10px',
    };

    const cssVariables = useMemo(() => ({
        ...defaultCssVariables,
        ...customStyle,
    }), [customStyle]);

    const style: CSSProperties = cssVariables;
    const toggleSidebar = () => setIsSidebarCollapsed((open) => !open);
    const toggleMailView = () => setIsMailViewExpanded((open) => !open);
    const showMailView = () => setIsMailViewExpanded(true);
    const hideMailView = () => setIsMailViewExpanded(false);
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        // Store original values for cleanup
        const originalHtmlStyle = html.style.cssText;
        const originalBodyClasses = body.className;

        // Apply CSS variables to HTML root element
        Object.entries(cssVariables).forEach(([property, value]) => {
            html.style.setProperty(property, String(value));
        });

        // Apply body className if provided
        if (bodyClassName) {
            body.className = `${originalBodyClasses} ${bodyClassName}`.trim();
        }

        // Add data attributes to body for layout states
        body.setAttribute('data-sidebar-collapsed', isSidebarCollapsed.toString());
        body.setAttribute('data-mail-view-expanded', isMailViewExpanded.toString());

        // Cleanup function
        return () => {
            html.style.cssText = originalHtmlStyle;
            body.className = originalBodyClasses;
            body.removeAttribute('data-sidebar-collapsed');
            body.removeAttribute('data-mail-view-expanded');
        };
    }, [cssVariables, bodyClassName, isSidebarCollapsed, isMailViewExpanded]);

    return (
        <LayoutContext.Provider
            value={{
                bodyClassName,
                style,
                isMobile,
                sidebarCollapsed: isSidebarCollapsed,
                isMailViewExpanded,
                headerData,
                showMailView,
                hideMailView,
                toggleSidebar,
                toggleMailView,
                setHeaderData,
            }}
        >
            <div
                data-slot="layout-wrapper"
                className="flex grow"
            >
                <TooltipProvider delayDuration={0}>
                    {children}
                </TooltipProvider>
            </div>
        </LayoutContext.Provider>
    );
}
