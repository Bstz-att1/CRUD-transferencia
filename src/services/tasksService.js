/**
 * Módulo de Servicios - Lógica intermedia entre API y UI
 * Coordina las llamadas a la API y prepara los datos para la UI
 */

import { 
    taskPost, 
    taskGet, 
    taskGetByUser, 
    taskDelete, 
    taskPatch,
    taskPut
} from '../api/index.js';

/**
 * Crea una nueva tarea
 * @param {string} titulo - Título de la tarea
 * @param {string} descripcion - Descripción de la tarea
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - La tarea creada
 */
export async function crearTarea(titulo, descripcion, userId) {
    const created = await taskPost(titulo, descripcion, 'pendiente', userId, 'user');
    return mapApiTaskToUiTask(created);
}

/**
 * Obtiene todas las tareas
 * @returns {Promise<Array>} - Array de todas las tareas
 */
export async function obtenerTodasTareas() {
    const tasks = await taskGet();
    return tasks.map(mapApiTaskToUiTask);
}

/**
 * Obtiene las tareas de un usuario específico
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} - Array de tareas del usuario
 */
export async function obtenerTareasPorUsuario(userId) {
    const todas = await taskGetByUser(userId);
    const mapped = todas.map(mapApiTaskToUiTask);
    // Mantener todas para que filtros/ordenamiento funcionen sobre el conjunto completo
    return mapped;
}

/**
 * Filtra tareas por estado
 * @param {Array} tareas - Array de tareas a filtrar
 * @param {string} estado - Estado a filtrar (pendiente, en progreso, completada)
 * @returns {Array} - Array de tareas filtradas
 */
export function filtrarTareasPorEstado(tareas, estado) {
    if (!estado) return tareas;
    return tareas.filter(tarea => tarea.estado === estado);
}

/**
 * Aplica filtros combinados y ordena el array de tareas.
 * @param {Array} tareas - Array de tareas a procesar
 * @param {Object} options - Opciones: { titulo, estado, sortBy, sortDir }
 * @returns {Array} - Array filtrado y ordenado
 */
export function aplicarFiltrosYOrdenar(tareas, options = {}) {
    const { titulo = '', estado = '', sortBy = 'fecha', sortDir = 'desc' } = options;

    let resultado = Array.isArray(tareas) ? [...tareas] : [];

    // Filtrar por título (coincidencia parcial, case-insensitive)
    if (titulo && titulo.trim() !== '') {
        const q = titulo.trim().toLowerCase();
        resultado = resultado.filter(t => (t.titulo || '').toLowerCase().includes(q));
    }

    // Filtrar por estado (normalizado)
    if (estado && estado.trim() !== '') {
        const estadoNormalizado = estado.trim().toLowerCase();
        resultado = resultado.filter(t => (t.estado || '').trim().toLowerCase() === estadoNormalizado);
    }

    // Ordenar
    const dir = sortDir === 'asc' ? 1 : -1;

    resultado.sort((a, b) => {
        if (sortBy === 'titulo') {
            const A = (a.titulo || '').toLowerCase();
            const B = (b.titulo || '').toLowerCase();
            if (A < B) return -1 * dir;
            if (A > B) return 1 * dir;
            return 0;
        }

        if (sortBy === 'estado') {
            const A = (a.estado || '').toLowerCase();
            const B = (b.estado || '').toLowerCase();
            if (A < B) return -1 * dir;
            if (A > B) return 1 * dir;
            return 0;
        }

        // Por defecto: fecha de creación (asc/desc)
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        if (aTime !== bTime) return (aTime - bTime) * dir;

        // Desempate alfabético por título
        const A = (a.titulo || '').toLowerCase();
        const B = (b.titulo || '').toLowerCase();
        if (A < B) return -1 * dir;
        if (A > B) return 1 * dir;
        return 0;
    });

    return resultado;
}

/**
 * Elimina una tarea
 * @param {string} id - ID de la tarea a eliminar
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
export async function eliminarTarea(id) {
    return await taskDelete(id);
}

/**
 * Actualiza una tarea existente
 * @param {string} id - ID de la tarea a actualizar
 * @param {string} titulo - Nuevo título
 * @param {string} descripcion - Nueva descripción
 * @param {string} userId - Nuevo ID de usuario
 * @returns {Promise<Object>} - La tarea actualizada
 */
export async function actualizarTarea(id, titulo, descripcion, userId, status = 'pendiente', created_by = 'user') {
    const updated = await taskPut(id, titulo, descripcion, status, userId, created_by);
    return mapApiTaskToUiTask(updated);
}

/**
 * Actualiza parcialmente una tarea existente (PATCH)
 * @param {string} id - ID de la tarea a actualizar
 * @param {string} titulo - Nuevo título
 * @param {string} descripcion - Nueva descripción
 * @param {string} userId - Nuevo ID de usuario
 * @param {string} status - Nuevo estado
 * @returns {Promise<Object>} - La tarea actualizada
 */
export async function actualizarParcialTarea(id, titulo, descripcion, userId, status) {
    const updated = await taskPatch(id, titulo, descripcion, status, userId);
    return mapApiTaskToUiTask(updated);
}

/**
 * Prepara los datos de las tareas para exportación (RF04)
 * @param {Array} tareas - Lista de tareas a exportar
 * @returns {string} - Cadena JSON formateada
 */
export function prepararDatosExportacion(tareas) {
    return JSON.stringify(tareas, null, 2);
}

/**
 * Mapea estructura API (db.json) a estructura UI actual.
 * API: { id, titulo, descripcion, estado, userId }
 * UI : { id, titulo, descripcion, estado, userId }
 */
function mapApiTaskToUiTask(task = {}) {
    const rawId = task.id ?? task.task_id ?? '';
    const rawUserId = task.userId ?? task.user_id ?? '';
    const rawAssigned = task.assigned_to ?? task.assignedTo ?? rawUserId ?? '';
    const rawCreator = task.created_by ?? task.createdBy ?? 'user';

    return {
        id: rawId !== '' && rawId != null ? String(rawId) : '',
        titulo: task.titulo ?? task.title ?? '',
        descripcion: task.descripcion ?? task.description ?? '',
        estado: task.estado ?? task.status ?? 'pendiente',
        userId: rawUserId !== '' && rawUserId != null ? String(rawUserId) : '',
        asignadoA: rawAssigned !== '' && rawAssigned != null ? String(rawAssigned) : '',
        created_by: String(rawCreator || 'user'),
        createdAt: task.createdAt ?? task.created_at ?? null,
        updatedAt: task.updatedAt ?? task.updated_at ?? null
    };
}
