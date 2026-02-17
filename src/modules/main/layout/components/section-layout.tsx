import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useLayout } from './use-layout';
import { type MenuItem } from './types';

interface SectionLayoutProps {
    menu?: MenuItem;
    children?: ReactNode;
}

export function SectionLayout({ children, menu }: SectionLayoutProps) {
    const { setMenu } = useLayout();

    useEffect(() => {
        setMenu(menu);
        return () => setMenu(undefined);
    }, [setMenu, menu]);

    return children ?? <Outlet />;
}