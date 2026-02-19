import { createContext, useContext } from 'react';

export interface User {
    username: string;
    fullName: string;
    email: string;
}

export interface AuthActionResult {
    success: boolean;
    error?: string;
    message?: string;
    requiresVerification?: boolean;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<AuthActionResult>;
    register: (username: string, fullName: string, email: string, password: string) => Promise<AuthActionResult>;
    requestPasswordReset: (email: string) => Promise<AuthActionResult>;
    resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthActionResult>;
    confirmAccount: (email: string, code: string) => Promise<AuthActionResult>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
