import { authLogin, authLogout } from '../api/index.js';

const STORAGE_KEYS = {
    accessToken: 'tm_access_token',
    refreshToken: 'tm_refresh_token',
    user: 'tm_user'
};

export function saveSession({ accessToken, refreshToken, user }) {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function updateSessionTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

export function getSession() {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    const userRaw = localStorage.getItem(STORAGE_KEYS.user);

    let user = null;
    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
        user = null;
    }

    return { accessToken, refreshToken, user };
}

export function isAuthenticated() {
    const { accessToken, refreshToken } = getSession();
    return Boolean(accessToken && refreshToken);
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
}

export async function loginWithCredentials(document, password) {
    const response = await authLogin(document, password);
    const data = response?.data || response;

    saveSession({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        user: data?.user || null
    });

    return data;
}

export async function logoutCurrentSession() {
    const { accessToken, refreshToken } = getSession();

    try {
        if (accessToken || refreshToken) {
            await authLogout(accessToken, refreshToken);
        }
    } finally {
        clearSession();
    }
}
