import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useLayout, type HeaderData } from './use-layout';

interface SectionLayoutProps extends HeaderData {
    children?: ReactNode;
}

export function SectionLayout({ children, ...headerData }: SectionLayoutProps) {
    const { setHeaderData } = useLayout();

    useEffect(() => {
        const hasData = Object.values(headerData).some(v => v !== undefined);
        setHeaderData(hasData ? headerData : undefined);
        return () => setHeaderData(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderData]);

    return children ?? <Outlet />;
}