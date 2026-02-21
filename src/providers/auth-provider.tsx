import { useState, useCallback, useEffect } from 'react';
import { AuthContext, type AuthActionResult, type User, type Career } from './auth-context';
import type { ReactNode } from 'react';
import { AUTH_TOKEN_KEY, authRequest, usersRequest, managersRequest, careersRequest, ApiRequestError } from '@/lib/auth-api';

const AUTH_USER_KEY = 'fm-auth-user';
const LEGACY_AUTH_USERS_KEY = 'fm-auth-users';
const ACTIVE_CAREER_ID_KEY = 'fm-active-career-id';

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
    onboarding_required?: boolean;
};

type ApiUser = {
    email?: string;
};

type CareersResponse = {
    careers?: Career[];
};

function getStoredCurrentUser(): User | null {
    try {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<User>;
        if (!parsed.email) {
            return null;
        }

        return {
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
    return {
        email: user.email ?? '',
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

function clearClientCookies() {
    if (typeof document === 'undefined' || !document.cookie) {
        return;
    }

    const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0]?.trim();
        if (!name) {
            return;
        }
        document.cookie = `${name}=; expires=${expires}; path=/`;
    });
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredCurrentUser());
    const [isLoading, setIsLoading] = useState<boolean>(() => !!getStoredToken());
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [needsCareerSelection, setNeedsCareerSelection] = useState(false);
    const [careers, setCareers] = useState<Career[]>([]);
    const [activeCareerId, setActiveCareerId] = useState<number | null>(() => {
        const raw = localStorage.getItem(ACTIVE_CAREER_ID_KEY);
        if (!raw) {
            return null;
        }

        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    });

    const isAuthenticated = user !== null;
    const clearAuthSession = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        setNeedsOnboarding(false);
        setNeedsCareerSelection(false);
        setCareers([]);
        setActiveCareerId(null);
        localStorage.removeItem(ACTIVE_CAREER_ID_KEY);
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

    useEffect(() => {
        if (activeCareerId && activeCareerId > 0) {
            localStorage.setItem(ACTIVE_CAREER_ID_KEY, String(activeCareerId));
            return;
        }

        localStorage.removeItem(ACTIVE_CAREER_ID_KEY);
    }, [activeCareerId]);

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
        }
    }, [clearAuthSession]);

    const syncOnboardingState = useCallback(async (): Promise<boolean> => {
        try {
            await managersRequest<{ manager?: unknown }>('/me');
            setNeedsOnboarding(false);
            return false;
        } catch (error) {
            if (error instanceof ApiRequestError && error.status === 404) {
                setNeedsOnboarding(true);
                return true;
            }
            clearAuthSession();
            throw error;
        }
    }, [clearAuthSession]);

    const syncCareerState = useCallback(async (): Promise<void> => {
        let response: CareersResponse;
        try {
            response = await careersRequest<CareersResponse>('/me');
        } catch (error) {
            if (error instanceof ApiRequestError && error.status === 404) {
                setNeedsOnboarding(true);
                setNeedsCareerSelection(false);
                setCareers([]);
                setActiveCareerId(null);
                return;
            }
            throw error;
        }
        const list = Array.isArray(response.careers) ? response.careers : [];
        setCareers(list);

        if (list.length === 0) {
            setActiveCareerId(null);
            setNeedsCareerSelection(true);
            return;
        }

        if (list.length === 1) {
            setActiveCareerId(list[0].id);
            setNeedsCareerSelection(false);
            return;
        }

        const current = activeCareerId;
        const exists = current !== null && list.some((career) => career.id === current);
        if (exists) {
            setNeedsCareerSelection(false);
            return;
        }

        setActiveCareerId(null);
        setNeedsCareerSelection(true);
    }, [activeCareerId]);

    const validateSessionOnRefresh = useCallback(async (): Promise<void> => {
        try {
            await authRequest<{ status: string }>('/check');
            await hydrateCurrentUser();
            const onboardingRequired = await syncOnboardingState();
            if (!onboardingRequired) {
                await syncCareerState();
            } else {
                setNeedsCareerSelection(false);
                setCareers([]);
                setActiveCareerId(null);
            }
        } catch {
            clearAuthSession();
        } finally {
            setIsLoading(false);
        }
    }, [clearAuthSession, hydrateCurrentUser, syncOnboardingState, syncCareerState]);

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

            let requiresOnboarding: boolean;
            if (typeof response.onboarding_required === 'boolean') {
                requiresOnboarding = response.onboarding_required;
                setNeedsOnboarding(requiresOnboarding);
            } else {
                requiresOnboarding = await syncOnboardingState();
            }

            if (!requiresOnboarding) {
                await syncCareerState();
            } else {
                setNeedsCareerSelection(false);
                setCareers([]);
                setActiveCareerId(null);
            }

            return { success: true, message: response.message, requiresOnboarding };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Login failed') };
        }
    }, [hydrateCurrentUser, syncOnboardingState, syncCareerState]);

    const register = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
        try {
            const response = await authRequest<AuthResponse>('/registration', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
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
            const response = await authRequest<AuthResponse>('/verify-email', {
                method: 'POST',
                body: JSON.stringify({ email, code }),
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
                return { success: false, error: 'Account confirmed, but user data was not returned' };
            }

            let requiresOnboarding: boolean;
            if (typeof response.onboarding_required === 'boolean') {
                requiresOnboarding = response.onboarding_required;
                setNeedsOnboarding(requiresOnboarding);
            } else {
                requiresOnboarding = await syncOnboardingState();
            }

            if (!requiresOnboarding) {
                await syncCareerState();
            } else {
                setNeedsCareerSelection(false);
                setCareers([]);
                setActiveCareerId(null);
            }

            return {
                success: true,
                message: response.message || 'Account confirmed successfully',
                requiresOnboarding,
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not confirm account') };
        }
    }, [hydrateCurrentUser, syncOnboardingState, syncCareerState]);

    const completeOnboarding = useCallback(async (name: string, countryId: number, avatar: File): Promise<AuthActionResult> => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('country_id', String(countryId));
            formData.append('avatar', avatar);

            const response = await managersRequest<{ message?: string }>('/me', {
                method: 'POST',
                body: formData,
            });

            setNeedsOnboarding(false);
            await syncCareerState();
            return {
                success: true,
                message: response.message || 'Manager profile created',
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not create manager profile') };
        }
    }, [syncCareerState]);

    const createCareer = useCallback(async (name: string): Promise<AuthActionResult> => {
        try {
            const response = await careersRequest<{ message?: string; career?: Career }>('/me', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });

            await syncCareerState();

            if (response.career?.id) {
                setActiveCareerId(response.career.id);
                setNeedsCareerSelection(false);
            }

            return {
                success: true,
                message: response.message || 'Career created',
            };
        } catch (error) {
            return { success: false, error: getErrorMessage(error, 'Could not create career') };
        }
    }, [syncCareerState]);

    const selectCareer = useCallback((careerId: number) => {
        setActiveCareerId(careerId);
        setNeedsCareerSelection(false);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authRequest<{ message?: string }>('/logout', {
                method: 'POST',
            });
        } catch {
            // Always clear local session, even if server logout request fails.
        } finally {
            clearClientCookies();
            clearAuthSession();
        }
    }, [clearAuthSession]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                needsOnboarding,
                needsCareerSelection,
                careers,
                activeCareerId,
                user,
                login,
                register,
                requestPasswordReset,
                resetPassword,
                confirmAccount,
                completeOnboarding,
                createCareer,
                selectCareer,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
