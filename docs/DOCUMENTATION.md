# Frontend Documentation

## Propósito general

Aplicación frontend modular para gestionar tareas, usuarios, roles y autenticación, organizada por capas para separar responsabilidades y facilitar mantenimiento.

---

## Estructura de módulos

- `src/script.js`: punto de entrada, registro de eventos y coordinación de vistas.
- `src/core/*`: orquestación de estado, configuración y permisos.
- `src/services/*`: lógica de negocio y adaptación de datos.
- `src/api/*`: comunicación HTTP con backend.
- `src/ui/*`: render de interfaz y manejo de elementos visuales.
- `src/utils/*`: validaciones y utilidades transversales.
- `index.html` + `styles.css`: estructura y estilos globales.

---

## Mapa rápido de archivos y parámetros (guía práctica)

Esta guía resume para qué sirve cada archivo principal y qué entradas recibe normalmente (parámetros o datos), para entender la estructura sin entrar en implementación profunda.

### Raíz del frontend

- `package.json`  
  Define dependencias y scripts (`dev`, `build`, `preview`).

- `README.md`  
  Guía general del frontend.

- `docs/changelog.md`  
  Historial de cambios.

- `docs/DOCUMENTATION.md`  
  Guía técnica resumida por módulos (este archivo).

- `db.json`  
  Base simulada para desarrollo local con `json-server`.

- `vite.config.js`  
  Configuración del entorno Vite.

- `index.html`  
  Estructura base de la aplicación (contenedores, formularios, vistas, modales).

- `styles.css`  
  Estilos globales y componentes visuales.

---

### `src/script.js`

Punto de arranque de la aplicación en el navegador.

- Qué hace:
  - Espera carga del DOM.
  - Toma referencias a elementos HTML.
  - Registra listeners (submit, filtros, búsqueda, ordenar, eliminar, editar, exportar).
  - Llama al controlador para ejecutar acciones de negocio.
  - Coordina cambio de vistas/modales desde interacción de usuario.

- Entradas típicas:
  - Eventos del DOM (`click`, `submit`, `change`, `input`).
  - IDs/data-attributes de elementos para identificar tarea/usuario/rol objetivo.

---

### `src/core/appController.js`

Controlador central de aplicación.

- Qué hace:
  - Mantiene estado en memoria (listas, filtros, orden, selección actual).
  - Orquesta servicios de datos y render UI.
  - Decide cuándo notificar éxito/error.
  - Gestiona edición y eliminación de registros.

- Funciones principales y parámetros típicos:
  - `cargarTareasPorUsuario(userId)` → recibe ID de usuario.
  - `aplicarFiltrosYRender()` → usa estado interno.
  - `setEstadoFilter(estado)`, `setTituloFilter(texto)`, `setSortBy(campo)`, `toggleSortDir()`.
  - `crearNuevaTarea(formData)` → recibe datos del formulario.
  - `actualizarTareaExistente(id, formData)` → recibe ID + datos.
  - `prepararEdicionTarea(id)` / `prepararEliminacionTarea(id)` → recibe ID objetivo.
  - `executeDelete()` → elimina el elemento marcado en estado.
  - `exportarTareas()` → exporta tareas filtradas/visibles.

---

### `src/core/config.js`

Configuración general del frontend.

- Qué hace:
  - Centraliza URL de API y constantes de comportamiento.

- Valores típicos:
  - `API_URL`
  - `APP_CONFIG.REQUEST_TIMEOUT`
  - `APP_CONFIG.DEFAULT_TASK_LIMIT`
  - `APP_CONFIG.NOTIFICATION_DURATION`

---

### `src/core/permissions.js`

Gestión de permisos en frontend.

- Qué hace:
  - Define/verifica permisos disponibles para habilitar o bloquear acciones UI.

- Entradas típicas:
  - Lista de permisos del usuario autenticado (ej. `tasks.create`, `users.get`, `roles.manage`).
  - Código de permiso a validar.

---

### `src/api/httpClient.js`

Cliente HTTP base.

- Qué hace:
  - Encapsula llamadas `fetch`.
  - Normaliza envío de headers, parseo de respuesta y manejo de errores.

- Entradas típicas:
  - Método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
  - URL/endpoint.
  - Payload (body JSON) opcional.
  - Token de autenticación opcional.

---

### `src/api/auth.api.js`

Funciones de autenticación contra backend.

- Qué hace:
  - Login, refresh de token y logout.

- Entradas típicas:
  - `login`: credenciales (`document`, `password`) o equivalente usado por el backend.
  - `refresh`: `refreshToken`.
  - `logout`: token/refreshToken según flujo actual.

---

### `src/api/tasks.api.js`

Funciones HTTP del recurso tareas.

- Qué hace:
  - CRUD de tareas y consultas por usuario.

- Entradas típicas:
  - `taskGet()`
  - `taskGetByUser(userId)` → recibe ID de usuario.
  - `taskPost(payload)` → recibe datos de nueva tarea.
  - `taskPut(id, payload)` / `taskPatch(id, payload)` → recibe ID + datos.
  - `taskDelete(id)` → recibe ID.

---

### `src/api/users.api.js`

Funciones HTTP del recurso usuarios.

- Entradas típicas:
  - `userGet()`
  - `userGetById(id)`
  - `userPost(payload)`
  - `userPut(id, payload)`
  - `userPatch(id, payload)`
  - `userDelete(id)`

---

### `src/api/roles.api.js`

Funciones HTTP del recurso roles.

- Entradas típicas:
  - Obtener roles y/o permisos por rol.
  - Crear/actualizar/eliminar rol con payload que incluye `name`, `description`, `permissions[]`.

---

### `src/api/index.js`

Archivo índice (barrel) de APIs.

- Qué hace:
  - Re-exporta funciones de `auth.api`, `tasks.api`, `users.api`, `roles.api` y utilidades HTTP para importaciones limpias.

---

### `src/services/authService.js`

Lógica de negocio de autenticación.

- Qué hace:
  - Adapta datos entre UI y `auth.api`.
  - Maneja persistencia de sesión (tokens/perfil) según flujo actual.

- Entradas típicas:
  - Credenciales de login.
  - Tokens para refresh/logout.

---

### `src/services/tasksService.js`

Lógica de negocio de tareas.

- Qué hace:
  - Usa API de tareas y transforma datos para UI.
  - Aplica filtros, ordenamiento y preparación de exportación.

- Entradas típicas:
  - Payload de tarea (`titulo/title`, `descripcion/description`, `estado/status`, `userId/user_id`).
  - Parámetros de filtro y orden (`estado`, `texto`, `sortBy`, `sortDir`).

---

### `src/services/usersService.js`

Lógica de negocio de usuarios.

- Qué hace:
  - Encapsula operaciones de usuarios y normaliza estructura para UI.

- Entradas típicas:
  - IDs de usuario.
  - Payload de usuario (`name`, `email`, `document`, `role`, etc.).

---

### `src/services/rolesService.js`

Lógica de negocio de roles.

- Qué hace:
  - Encapsula CRUD de roles y asignación de permisos para consumo de UI.

- Entradas típicas:
  - ID de rol.
  - Payload de rol (`name`, `description`, `permissions[]`).

---

### `src/ui/tasksUi.js`

Render de tareas y elementos relacionados.

- Qué hace:
  - Pintar tarjetas/listas de tareas.
  - Mostrar errores de validación en campos.
  - Abrir/cerrar modal de confirmación.
  - Preparar formulario para crear/editar.
  - Disparar descarga de exportación JSON.

- Entradas típicas:
  - Arreglo de tareas.
  - Estado de filtros/orden (para reflejo visual).
  - Mensajes de validación por campo.

---

### `src/ui/usersUi.js`

Render de usuarios y selectores de usuario.

- Qué hace:
  - Pintar opciones/listas de usuarios en UI.
  - Sincronizar selector para búsquedas/altas/edición.

- Entradas típicas:
  - Arreglo de usuarios.
  - Usuario seleccionado (ID).

---

### `src/ui/rolesUi.js`

Render de roles y permisos en interfaz.

- Qué hace:
  - Mostrar lista/tabla de roles.
  - Mostrar o seleccionar permisos asociados.

- Entradas típicas:
  - Arreglo de roles.
  - Arreglo de permisos disponibles.
  - ID de rol seleccionado.

---

### `src/ui/notificationsUi.js`

Notificaciones visuales (toast).

- Qué hace:
  - Mostrar mensajes de estado a usuario.

- Funciones y entradas:
  - `showSuccess(message)`
  - `showError(message)`
  - `showInfo(message)`

---

### `src/utils/validaciones.js`

Validaciones reutilizables del frontend.

- Qué hace:
  - Valida campos y formularios antes de enviar al backend.

- Funciones y entradas típicas:
  - `validarTitulo(titulo)`
  - `validarDescripcion(descripcion)`
  - `validarUsuario(userId)`
  - `validarFormulario(dataFormulario)`

---

## Flujo general resumido

1. Usuario interactúa en `index.html`.
2. `src/script.js` captura evento.
3. `appController` decide acción y valida reglas.
4. `services` aplican lógica de negocio.
5. `api` realiza request HTTP.
6. Respuesta vuelve al controlador.
7. `ui` re-renderiza componentes.
8. `notificationsUi` muestra feedback.

---

## Archivos índice y organización

- `src/api/index.js`: exportaciones centralizadas de APIs.
- Estructura por carpetas (`api`, `core`, `services`, `ui`, `utils`) permite ubicar rápidamente responsabilidades.
- Regla práctica:
  - Si es HTTP → `api/`
  - Si es regla de negocio → `services/`
  - Si es estado/orquestación → `core/`
  - Si es render o DOM → `ui/`
  - Si es helper puro → `utils/`
