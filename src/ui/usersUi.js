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
        container.innerHTML = `
            <div class="empty-state">
                <h4>No hay usuarios para mostrar</h4>
                <p>Agrega un nuevo usuario para comenzar.</p>
            </div>
        `;
        return;
    }

    const table = document.createElement('div');
    table.className = 'table-wrapper';
    table.innerHTML = `
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${users.map((user) => `
                    <tr>
                        <td>${user.id || '-'}</td>
                        <td>${user.nombre || 'Sin nombre'}</td>
                        <td>${user.email || 'Sin correo'}</td>
                        <td>${user.rol || 'usuario'}</td>
                        <td>
                            <button type="button" class="btn btn-secondary user-edit" data-id="${user.id}">Editar</button>
                            <button type="button" class="btn btn-danger user-delete" data-id="${user.id}">Borrar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.appendChild(table);
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
