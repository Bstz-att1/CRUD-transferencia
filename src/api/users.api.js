import { API_URL } from '../core/config.js';

// ======================================================================
//                             METHOD | GET
// ======================================================================
/**
 * Obtiene el listado completo de todos los usuarios del sistema.
 * @returns {Promise<Array>} - Un arreglo con todos los usuarios.
 */
export async function userGet() {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }

    return await response.json();
}

/**
 * Obtiene un usuario por su ID.
 * @param {number|string} id - ID del usuario a consultar.
 * @returns {Promise<Object>} - Objeto usuario encontrado.
 */
export async function userGetById(id) {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }

    return await response.json();
}


// ======================================================================
//                             METHOD | POST
// ======================================================================
/**
 * Crea un nuevo usuario en la base de datos.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Correo del usuario.
 * @param {string} role - Rol del usuario (administrador | usuario).
 * @returns {Promise<Object>} - El usuario creado.
 */
export async function userPost(name, email, role) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, email, rol: role })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario');
    }

    return await response.json();
}


// ======================================================================
//                             METHOD | PUT
// ======================================================================
/**
 * Reemplaza completamente un usuario existente.
 * @param {number|string} id - ID del usuario a reemplazar.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Correo del usuario.
 * @param {string} role - Rol del usuario.
 * @returns {Promise<Object>} - Usuario actualizado.
 */
export async function userPut(id, name, email, role) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, email, rol: role })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al reemplazar el usuario');
    }

    return await response.json();
}


// ======================================================================
//                             METHOD | PATCH
// ======================================================================
/**
 * Actualiza parcialmente un usuario existente.
 * @param {number|string} id - ID del usuario a actualizar.
 * @param {Object} changes - Campos parciales a modificar.
 * @returns {Promise<Object>} - Usuario actualizado.
 */
export async function userPatch(id, changes = {}) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(changes)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar parcialmente el usuario');
    }

    return await response.json();
}


// ======================================================================
//                             METHOD | DELETE
// ======================================================================
/**
 * Elimina permanentemente un usuario de la base de datos.
 * @param {number|string} id - ID del usuario a eliminar.
 * @returns {Promise<boolean>} - True si la operación fue exitosa.
 */
export async function userDelete(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('No se pudo borrar el usuario');
    }

    return true;
}
