import { createContext, useContext } from 'react';

export interface User {
    email: string;
}

export interface Country {
    id: number;
    code: string;
    name: string;
}

export interface Career {
    id: number;
    manager_id: number;
    name: string;
    created_at: number;
    updated_at: number;
}

export interface AuthActionResult {
    success: boolean;
    error?: string;
    message?: string;
    requiresVerification?: boolean;
    requiresOnboarding?: boolean;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    needsOnboarding: boolean;
    needsCareerSelection: boolean;
    careers: Career[];
    activeCareerId: number | null;
    user: User | null;
    login: (email: string, password: string) => Promise<AuthActionResult>;
    register: (email: string, password: string) => Promise<AuthActionResult>;
    requestPasswordReset: (email: string) => Promise<AuthActionResult>;
    resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthActionResult>;
    confirmAccount: (email: string, code: string) => Promise<AuthActionResult>;
    completeOnboarding: (name: string, countryId: number, avatar: File) => Promise<AuthActionResult>;
    createCareer: (name: string) => Promise<AuthActionResult>;
    selectCareer: (careerId: number) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
