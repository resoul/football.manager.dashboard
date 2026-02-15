import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';

const TeamModule = lazy(() => import('@/modules/team'));
const MainModule = lazy(() => import('@/modules/main'));

export function ModuleProvider() {
    const location = useLocation();
    const path = location.pathname;

    const isTeam = path.startsWith('/team');

    if (isTeam) {
        return (
            <Routes>
                <Route
                    path="/team/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <TeamModule />
                        </Suspense>
                    }
                />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route
                path="/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <MainModule />
                    </Suspense>
                }
            />
        </Routes>
    );
}