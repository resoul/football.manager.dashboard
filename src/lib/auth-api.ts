const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_BASE = `${API_BASE}/auth`;
const USERS_API_BASE = `${API_BASE}/users`;

export const AUTH_TOKEN_KEY = 'fm-auth-token';

export class ApiRequestError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
    }
}

function getStoredToken(): string | null {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
        return null;
    }
}

function buildHeaders(headers?: HeadersInit): Headers {
    const finalHeaders = new Headers(headers);

    if (!finalHeaders.has('Content-Type')) {
        finalHeaders.set('Content-Type', 'application/json');
    }

    const token = getStoredToken();
    if (token && !finalHeaders.has('Authorization')) {
        finalHeaders.set('Authorization', `Bearer ${token}`);
    }

    return finalHeaders;
}

async function parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    const text = await response.text();
    return text ? { message: text } : null;
}

function getErrorMessage(body: unknown, fallback: string): string {
    if (!body || typeof body !== 'object') {
        return fallback;
    }

    const maybeMessage = (body as Record<string, unknown>).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
        return maybeMessage;
    }

    const maybeError = (body as Record<string, unknown>).error;
    if (typeof maybeError === 'string' && maybeError.trim()) {
        return maybeError;
    }

    return fallback;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: buildHeaders(init?.headers),
    });

    const body = await parseResponse(response);

    if (!response.ok) {
        throw new ApiRequestError(getErrorMessage(body, 'Request failed'), response.status);
    }

    return body as T;
}

export function authRequest<T>(path: string, init?: RequestInit) {
    return request<T>(`${AUTH_API_BASE}${path}`, init);
}

export function usersRequest<T>(path: string, init?: RequestInit) {
    return request<T>(`${USERS_API_BASE}${path}`, init);
}
