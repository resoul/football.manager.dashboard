import { Helmet } from '@packages/react-helmet-async';
import { Wrapper } from './components/wrapper';
import { LayoutProvider } from './components/context';
import type { CSSProperties } from "react";

export function Layout() {
    return (
        <>
            <Helmet>
                <title>Layout</title>
            </Helmet>

            <LayoutProvider
                sidebarCollapsed={false}
                bodyClassName="bg-zinc-100 dark:bg-zinc-900 lg:overflow-hidden"
                style={{
                    '--sidebar-width': '240px',
                    '--sidebar-width-collapse': '60px',
                    '--sidebar-width-mobile': '240px',
                    '--aside-width': '50px',
                    '--aside-width-mobile': '50px',
                    '--page-space': '10px',
                    '--header-height-mobile': '60px',
                    '--mail-list-width': '400px',
                } as CSSProperties}
            >
                <Wrapper />
            </LayoutProvider>
        </>
    );
}
