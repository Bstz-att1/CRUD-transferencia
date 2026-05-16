import { API_URL } from '../core/config.js';

const AUTH_BASE = `${API_URL}/auth`;

async function handleAuthResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data?.message || 'Error en la solicitud de autenticación';
        throw new Error(message);
    }

    return data;
}

export async function authLogin(document, password) {
    const response = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ document, password })
    });

    return handleAuthResponse(response);
}

export async function authRefresh(refreshToken) {
    const response = await fetch(`${AUTH_BASE}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    return handleAuthResponse(response);
}

export async function authLogout(accessToken, refreshToken) {
    const response = await fetch(`${AUTH_BASE}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ refreshToken })
    });

    return handleAuthResponse(response);
}
