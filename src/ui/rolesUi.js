export function renderRoles(roles, container, options = {}) {
    if (!container) return;
    container.innerHTML = '';

    const { canManage = false, permissionsByRoleId = {} } = options;

    if (!roles || roles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h4>No hay roles para mostrar</h4>
                <p>Cuando existan roles en el sistema aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    const rows = roles.map((role) => {
        const permissions = permissionsByRoleId[String(role.id)] || [];
        return `
            <tr>
                <td>${role.id || '-'}</td>
                <td>${role.nombre || 'Sin nombre'}</td>
                <td>${role.descripcion || 'Sin descripción'}</td>
                <td>${permissions.length ? permissions.join(', ') : 'Sin permisos'}</td>
                <td>
                    ${canManage ? `<button type="button" class="btn btn-secondary role-edit" data-id="${role.id}">Editar</button>` : ''}
                    ${canManage ? `<button type="button" class="btn btn-danger role-delete" data-id="${role.id}">Borrar</button>` : ''}
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="table-wrapper">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Permisos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}
