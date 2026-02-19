import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ResetPasswordPage } from './pages/reset-password';
import { VerifyAccountPage } from './pages/verify-account';

export default function AuthModule() {
    return (
        <Routes>
            <Route index element={<Navigate to="register" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="verify-account" element={<VerifyAccountPage />} />
        </Routes>
    );
}
