/**
 * UI Module - DOM Manipulation
 * Functions to render tasks and display validation/UI messages
 */

// DOM elements cache
let elements = null;

/**
 * Get DOM references
 * @returns {Object} Object with DOM element references
 */
function getElements() {
    if (!elements) {
        elements = {
            errorTitle: document.getElementById('error-titulo'),
            errorDescription: document.getElementById('error-descripcion'),
            errorUser: document.getElementById('error-usuario'),
            errorUserSearch: document.getElementById('error-usuario-busqueda'),
            taskTitle: document.getElementById('titulo'),
            taskDescription: document.getElementById('descripcion'),
            userSelect: document.getElementById('user-id'),
            userSelectExternal: document.getElementById('user-select'),
            taskForm: document.getElementById('task-form'),
            deleteModal: document.getElementById('delete-modal')
        };
    }
    return elements;
}

/**
 * Render tasks in the given container
 * @param {Array} tasks - Tasks to render
 * @param {HTMLElement} container - Target container
 */
export function renderTasks(tasks, container) {
    if (!container) return;
    container.innerHTML = "";

    if (!tasks || tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h4>No hay tareas para mostrar</h4>
                <p>Cuando se carguen tareas del backend aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.classList.add("task-card");

        card.innerHTML = `
            <div class="div-task">
                <h3>${task.titulo || 'Sin título'}</h3>
                <p>${task.descripcion || 'Sin descripción'}</p>
                <div class="task-estado">
                    <span class="estado-badge estado-${(task.estado || '').replace(/\s+/g, '-')}">${task.estado || 'Sin estado'}</span>
                </div>
                <div class="task-meta">
                    <span><strong>Creador:</strong> ${task.created_by || 'usuario'}</span>
                    <span><strong>Asignado a:</strong> ${task.asignadoA || task.userId || 'N/A'}</span>
                    <span><strong>Creada:</strong> ${formatDate(task.createdAt)}</span>
                    <span><strong>Actualizada:</strong> ${formatDate(task.updatedAt)}</span>
                </div>
                <div class="task-buttons">
                    <button type="button" class="btn btn-secondary edit" data-id="${task.id}">Editar</button>
                    <button type="button" class="btn btn-danger delete" data-id="${task.id}">Borrar</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Clear validation errors in UI
 */
export function clearUiErrors() {
    const elements = getElements();

    if (elements.errorTitle) elements.errorTitle.textContent = '';
    if (elements.errorDescription) elements.errorDescription.textContent = '';
    if (elements.errorUser) elements.errorUser.textContent = '';
    if (elements.errorUserSearch) elements.errorUserSearch.textContent = '';

    if (elements.taskTitle) elements.taskTitle.classList.remove('error');
    if (elements.taskDescription) elements.taskDescription.classList.remove('error');
    if (elements.userSelect) elements.userSelect.classList.remove('error');
    if (elements.userSelectExternal) elements.userSelectExternal.classList.remove('error');
}

/**
 * Show search user error message
 * @param {string} message - Error message
 */
export function showSearchError(message) {
    const elements = getElements();

    if (elements.errorUserSearch) {
        elements.errorUserSearch.textContent = message;
    }

    if (elements.userSelectExternal) {
        elements.userSelectExternal.classList.add('error');
    }
}

/**
 * Show field error
 * @param {HTMLElement} fieldElement
 * @param {HTMLElement} errorElement
 * @param {string} message
 */
function showFieldError(fieldElement, errorElement, message) {
    if (fieldElement) fieldElement.classList.add('error');
    if (errorElement) errorElement.textContent = message;
}

/**
 * Show validation errors by field
 * @param {Object} errors - {titulo, descripcion, usuario}
 */
export function showFieldErrors(errors) {
    const elements = getElements();

    if (errors.titulo) {
        showFieldError(elements.taskTitle, elements.errorTitle, errors.titulo);
    }

    if (errors.descripcion) {
        showFieldError(elements.taskDescription, elements.errorDescription, errors.descripcion);
    }

    if (errors.usuario) {
        showFieldError(elements.userSelect, elements.errorUser, errors.usuario);
    }
}

/**
 * Show delete confirmation modal
 */
export function showDeleteModal() {
    const elements = getElements();
    if (elements.deleteModal) {
        elements.deleteModal.classList.add('show');
    }
}

/**
 * Hide delete confirmation modal
 */
export function hideDeleteModal() {
    const elements = getElements();
    if (elements.deleteModal) {
        elements.deleteModal.classList.remove('show');
    }
}

/**
 * Prepare form for edit mode
 * @param {Object} task - Task data
 */
export function prepareEditForm(task) {
    const elements = getElements();
    const userSelectExternal = document.getElementById('user-select');

    if (elements.taskTitle) elements.taskTitle.value = task.titulo;
    if (elements.taskDescription) elements.taskDescription.value = task.descripcion;
    if (elements.userSelect) elements.userSelect.value = task.userId;
    if (userSelectExternal) userSelectExternal.value = task.userId;

    const submitBtn = elements.taskForm?.querySelector(".submit");
    if (submitBtn) {
        submitBtn.textContent = "Actualizar Tarea";
        submitBtn.dataset.editId = task.id;
    }

    if (elements.taskForm) {
        elements.taskForm.scrollIntoView({ behavior: "smooth" });
    }
}

/**
 * Reset form to initial state
 */
export function resetForm() {
    const elements = getElements();

    if (elements.taskForm) {
        elements.taskForm.reset();
    }

    const submitBtn = elements.taskForm?.querySelector(".submit");
    if (submitBtn) {
        submitBtn.textContent = "Guardar Tarea";
        delete submitBtn.dataset.editId;
    }
}

/**
 * Trigger browser download of content
 * @param {string} content
 * @param {string} fileName
 * @param {string} mimeType
 */
export function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
