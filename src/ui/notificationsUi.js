/**
 * Notifications Module (RF03)
 * Independent user message system.
 * It does not depend on API or business logic modules.
 */

// Toast notifications container
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
            gap: '10px'
        });

        document.body.appendChild(notificationContainer);
    }

    return notificationContainer;
}

/**
 * Create and show a visual notification
 * @param {string} message
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showNotification(message, type) {
    const container = getNotificationContainer();
    const toast = document.createElement('div');

    Object.assign(toast.style, {
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '250px',
        maxWidth: '400px',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        animation: 'fadeIn 0.3s ease-in-out'
    });

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };

    toast.style.backgroundColor = colors[type] || colors.info;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
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
