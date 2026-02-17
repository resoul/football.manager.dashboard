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
                    '--sidebar-width': '180px',
                    '--sidebar-width-collapse': '60px',
                    '--sidebar-width-mobile': '200px',
                    '--aside-width': '10px',
                    '--aside-width-mobile': '10px',
                    '--page-space': '10px',
                    '--header-height-mobile': '60px',
                } as CSSProperties}
            >
                <Wrapper />
            </LayoutProvider>
        </>
    );
}
