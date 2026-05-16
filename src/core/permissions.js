import { getSession } from '../services/authService.js';

function readRawPermissions() {
    const { user } = getSession();
    if (!user) return [];

    const permissions = user.permissions;
    if (!Array.isArray(permissions)) return [];

    return permissions;
}

export function getPermissionCodes() {
    const raw = readRawPermissions();

    return raw
        .map((p) => {
            if (typeof p === 'string') return p;
            if (p && typeof p.code === 'string') return p.code;
            return '';
        })
        .map((code) => code.trim())
        .filter(Boolean);
}

export function hasPermission(code) {
    if (!code) return false;
    const codes = getPermissionCodes();
    return codes.includes(code);
}

export function hasAnyPermission(required = []) {
    if (!Array.isArray(required) || required.length === 0) return false;
    const codes = getPermissionCodes();
    return required.some((code) => codes.includes(code));
}

export function canReadUsers() {
    return hasPermission('users.get');
}

export function canCreateUsers() {
    return hasPermission('users.create');
}

export function canUpdateUsers() {
    return hasPermission('users.update');
}

export function canDeleteUsers() {
    return hasPermission('users.delete');
}

export function canReadTasks() {
    return hasPermission('tasks.get');
}

export function canCreateTasks() {
    return hasPermission('tasks.create');
}

export function canUpdateTasks() {
    return hasPermission('tasks.update');
}

export function canDeleteTasks() {
    return hasPermission('tasks.delete');
}

export function canReadRoles() {
    return hasPermission('roles.get');
}

export function canManageRoles() {
    return hasPermission('roles.manage');
}
