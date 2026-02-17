import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { HeaderMobile } from './header-mobile';
import { useEffect, useState } from 'react';
import { useLayout } from './use-layout';
import { Header } from './header';

export function Wrapper() {
    const { isMobile } = useLayout();
    const [enableTransitions, setEnableTransitions] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setEnableTransitions(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <>
            {isMobile && <HeaderMobile />}

            <div className="flex flex-col lg:flex-row grow py-(--page-space)">
                <div className="flex grow rounded-xl">
                    {!isMobile && <Sidebar />}
                    <div className={cn(
                        'grow pt-(--header-height-mobile) lg:pt-(--header-height) lg:overflow-hidden lg:ms-(--sidebar-width) lg:in-data-[sidebar-collapsed=true]:ms-(--sidebar-width-collapse) lg:me-[calc(var(--aside-width))]',
                        enableTransitions ? 'lg:transition-[margin] lg:duration-300' : 'lg:transition-none',
                    )}>
                        <main className="grow px-2.5 lg:p-0 flex flex-col h-full" role="content">
                            <Header />
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
