/**
 * Notifications Module (RF03)
 * Sistema de toasts reutilizable para éxito/error/info.
 */

let notificationContainer = null;

function getNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-toast-container';
        Object.assign(notificationContainer.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: 'min(420px, calc(100vw - 32px))'
        });
        document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
}

function showNotification(message, type = 'info') {
    const container = getNotificationContainer();
    const toast = document.createElement('div');

    const tone = {
        success: { bg: '#15803d', border: '#86efac' },
        error: { bg: '#b91c1c', border: '#fecaca' },
        info: { bg: '#1d4ed8', border: '#93c5fd' }
    }[type] || { bg: '#334155', border: '#cbd5e1' };

    Object.assign(toast.style, {
        padding: '12px 14px',
        borderRadius: '10px',
        color: '#ffffff',
        background: tone.bg,
        borderLeft: `4px solid ${tone.border}`,
        boxShadow: '0 12px 24px rgba(15,23,42,.18)',
        fontSize: '14px',
        fontFamily: 'Inter, Roboto, sans-serif',
        lineHeight: '1.4',
        opacity: '0',
        transform: 'translateY(-8px)',
        transition: 'opacity .2s ease, transform .2s ease'
    });

    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        setTimeout(() => toast.remove(), 220);
    }, 3500);
}

export function showSuccess(message) {
    showNotification(message, 'success');
}

export function showError(message) {
    showNotification(message, 'error');
}

export function showInfo(message) {
    showNotification(message, 'info');
}
