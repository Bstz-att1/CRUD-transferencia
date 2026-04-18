/**
 * Users UI Module - DOM Manipulation
 * Follows the same modular approach as tasksUi.js
 */

// Cached elements
let elements = null;

/**
 * Get users-related DOM elements
 * @returns {Object}
 */
function getElements() {
    if (!elements) {
        elements = {
            usersContainer: document.getElementById('users-container'),
            userIdInput: document.getElementById('user-select'),
            userIdHidden: document.getElementById('user-id'),
            errorUserSearch: document.getElementById('error-usuario-busqueda')
        };
    }

    return elements;
}

/**
 * Render users list in a container
 * @param {Array} users
 * @param {HTMLElement} container
 */
export function renderUsers(users, container) {
    if (!container) return;
    container.innerHTML = '';

    if (!users || users.length === 0) {
        container.innerHTML = '<p class="no-users">No hay usuarios para mostrar.</p>';
        return;
    }

    users.forEach((user) => {
        const card = document.createElement('div');
        card.classList.add('user-card');
        card.innerHTML = `
            <div class="user-card-content">
                <h4>${user.name || 'Sin nombre'}</h4>
                <p>${user.email || 'Sin correo'}</p>
                <small>Rol: ${user.role || 'usuario'}</small>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Sync user selector inputs (external + hidden/main)
 */
export function syncUserSelectors() {
    const { userIdInput, userIdHidden } = getElements();
    if (!userIdInput || !userIdHidden) return;

    userIdInput.addEventListener('input', () => {
        userIdHidden.value = userIdInput.value;
    });

    userIdHidden.addEventListener('input', () => {
        userIdInput.value = userIdHidden.value;
    });
}

/**
 * Show user search error
 * @param {string} message
 */
export function showUserSearchError(message) {
    const { errorUserSearch, userIdInput } = getElements();

    if (errorUserSearch) errorUserSearch.textContent = message;
    if (userIdInput) userIdInput.classList.add('error');
}

/**
 * Clear user search error
 */
export function clearUserSearchError() {
    const { errorUserSearch, userIdInput } = getElements();

    if (errorUserSearch) errorUserSearch.textContent = '';
    if (userIdInput) userIdInput.classList.remove('error');
}
