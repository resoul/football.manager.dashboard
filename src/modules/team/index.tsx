import { Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from "./pages/main/page";
import { SetupPage } from "./pages/tactics/page";
import { Layout } from "./layout";

export default function MainModule() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="tactics" replace />} />
                <Route path="player/:id" element={<MainPage />} />
                <Route path="tactics" element={<SetupPage />} />
            </Route>
        </Routes>
    )
}