import { useState, useCallback, useEffect } from 'react';
import { AuthContext, type AuthActionResult, type User } from './auth-context';
import type { ReactNode } from 'react';
import { AUTH_TOKEN_KEY, authRequest, usersRequest, ApiRequestError } from '@/lib/auth-api';

const AUTH_USER_KEY = 'fm-auth-user';
const LEGACY_AUTH_USERS_KEY = 'fm-auth-users';

type AuthResponse = {
    message?: string;
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: ApiUser;
    data?: {
        token?: string;
        accessToken?: string;
        jwt?: string;
        user?: ApiUser;
    };
};

type ApiUser = {
    username?: string;
    full_name?: string;
    fullName?: string;
    name?: string;
    email?: string;
};

function getStoredCurrentUser(): User | null {
    try {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<User>;
        if (!parsed.email || !parsed.username) {
            return null;
        }

        return {
            username: parsed.username,
            fullName: parsed.fullName || parsed.username,
            email: parsed.email,
        };
    } catch {
        return null;
    }
}

function getStoredToken(): string | null {
    try {
        const rawToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const token = rawToken?.trim();

        if (!token || token === 'null' || token === 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            return null;
        }

        return token;
    } catch {
        return null;
    }
}

function extractToken(payload?: AuthResponse): string | undefined {
    return payload?.token || payload?.accessToken || payload?.jwt || payload?.data?.token || payload?.data?.accessToken || payload?.data?.jwt;
}

function mapApiUser(user: ApiUser): User {
    const email = user.email ?? '';
    const fullName = user.full_name || user.fullName || user.name || '';
    const username = user.username || user.name || fullName || (email.includes('@') ? email.split('@')[0] : email);

    return {
        username: username || 'Manager',
        fullName: fullName || username || 'Manager',
        email,
    };
}

function extractUser(payload?: AuthResponse): User | null {
    const source = payload?.user || payload?.data?.user;
    if (!source || typeof source !== 'object') {
        return null;
    }

    const user = mapApiUser(source);
    if (!user.email) {
        return null;
    }

    return user;
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ApiRequestError) {
        return error.message;
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredCurrentUser());
    const [isLoading, setIsLoading] = useState<boolean>(() => !!getStoredToken());

    const isAuthenticated = user !== null;
    const clearAuthSession = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
    }, []);

    useEffect(() => {
        localStorage.removeItem(LEGACY_AUTH_USERS_KEY);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_USER_KEY);
        }
    }, [user]);

    const hydrateCurrentUser = useCallback(async (): Promise<User | null> => {
        try {
            const response = await usersRequest<{ user?: ApiUser; data?: { user?: ApiUser } }>('/me');
            const apiUser = response.user || response.data?.user;

            if (!apiUser) {
                throw new Error('User data not found');
            }

            const nextUser = mapApiUser(apiUser);
            if (!nextUser.email) {
                throw new Error('User email is missing');
            }

            setUser(nextUser);
            return nextUser;
        } catch {
            clearAuthSession();
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [clearAuthSession]);

    const validateSessionOnRefresh = useCallback(async (): Promise<void> => {
        try {
            await authRequest<{ status: string }>('/check');
            await hydrateCurrentUser();
        } catch {
            clearAuthSession();
            setIsLoading(false);
        }
    }, [clearAuthSession, hydrateCurrentUser]);

    useEffect(() => {
        const token = getStoredToken();

        if (!token) {
            clearAuthSession();
            setIsLoading(false);
            return;
        }

        void validateSessionOnRefresh();
    }, [clearAuthSession, validateSessionOnRefresh]);

    const login = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<AuthResponse>('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const token = extractToken(response);
            if (token) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
            }

            let nextUser = extractUser(response);
            if (nextUser) {
                setUser(nextUser);
            } else if (token) {
                nextUser = await hydrateCurrentUser();
            }

            if (!nextUser) {
                return { success: false, error: 'Login succeeded, but user data was not returned' };
            }

            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Login failed') };
        }
    }, [hydrateCurrentUser]);

    const register = useCallback(async (username: string, fullName: string, email: string, password: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<AuthResponse>('/registration', {
                method: 'POST',
                body: JSON.stringify({ username, full_name: fullName, email, password }),
            });
            clearAuthSession();

            return {
                success: true,
                message: response.message || 'Registration successful. Check your email for verification code.',
                requiresVerification: true,
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Registration failed') };
        }
    }, [clearAuthSession]);

    const requestPasswordReset = useCallback(async (email: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<{ message?: string }>('/reset-password/request', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            return {
                success: true,
                message: response.message || 'Password reset code sent to your email',
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not request password reset') };
        }
    }, []);

    const resetPassword = useCallback(async (email: string, code: string, newPassword: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<{ message?: string }>('/reset-password/confirm', {
                method: 'POST',
                body: JSON.stringify({ email, code, new_password: newPassword }),
            });

            return {
                success: true,
                message: response.message || 'Password has been reset successfully',
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not reset password') };
        }
    }, []);

    const confirmAccount = useCallback(async (email: string, code: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<{ message?: string }>('/verify-email', {
                method: 'POST',
                body: JSON.stringify({ email, code }),
            });

            return {
                success: true,
                message: response.message || 'Account confirmed successfully',
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not confirm account') };
        }
    }, []);

    const logout = useCallback(() => {
        clearAuthSession();
    }, [clearAuthSession]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                register,
                requestPasswordReset,
                resetPassword,
                confirmAccount,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
