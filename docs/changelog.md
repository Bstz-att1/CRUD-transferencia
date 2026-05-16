# Changelog

## Objetivo del cambio
Reparar y completar la conexión total de capas (**API -> Services -> UI**) después del renombrado de archivos a inglés, manteniendo el estilo de desarrollo existente y corrigiendo la integración con la estructura real de datos usada por el proyecto.

---

## Cambios realizados

### 1) `src/core/appController.js` (actualizado)
Se corrigieron imports y referencias para restablecer la conexión con los módulos renombrados en inglés.

**Cambios:**
- Import de service corregido:
  - `../services/tareasService.js` -> `../services/tasksService.js`
- Import de UI actualizado:
  - `../ui/tareasUi.js` -> `../ui/tasksUi.js`
- Import de notificaciones actualizado:
  - `../ui/notificacionesUi.js` -> `../ui/notificationsUi.js`
- Se reemplazaron llamadas de funciones UI/notificaciones por sus equivalentes en inglés:
  - `renderizarTareas` -> `renderTasks`
  - `mostrarErrorBusqueda` -> `showSearchError`
  - `mostrarModalEliminar` -> `showDeleteModal`
  - `ocultarModalEliminar` -> `hideDeleteModal`
  - `prepararFormularioEditar` -> `prepareEditForm`
  - `resetearFormulario` -> `resetForm`
  - `descargarArchivo` -> `downloadFile`
  - `mostrarExito`, `mostrarError`, `mostrarInfo` -> `showSuccess`, `showError`, `showInfo`
- Se corrigieron referencias residuales para evitar errores en tiempo de ejecución (ej. eliminación y reseteo de formulario).

**Resultado:**
- El controlador vuelve a conectar correctamente servicios y UI tras el renombrado.

---

### 2) `src/ui/tasksUi.js` (nuevo)
Se creó el módulo UI de tareas en inglés como reemplazo funcional de `tareasUi.js`, manteniendo la misma lógica y estilo modular.

**Funciones principales:**
- `renderTasks(...)`
- `clearUiErrors()`
- `showSearchError(...)`
- `showFieldErrors(...)`
- `showDeleteModal()`
- `hideDeleteModal()`
- `prepareEditForm(...)`
- `resetForm()`
- `downloadFile(...)`

**Resultado:**
- Capa UI de tareas alineada con convención de nombres en inglés.

---

### 3) `src/ui/notificationsUi.js` (nuevo)
Se creó el módulo de notificaciones en inglés como reemplazo de `notificacionesUi.js`, preservando comportamiento y enfoque desacoplado.

**Funciones exportadas:**
- `showSuccess(...)`
- `showError(...)`
- `showInfo(...)`

**Resultado:**
- Notificaciones compatibles con los nuevos imports del controlador.

---

### 4) `src/ui/usersUi.js` (nuevo)
Se añadió módulo UI para usuarios, solicitado para mantener consistencia estructural con el módulo de tareas.

**Funciones implementadas:**
- `renderUsers(...)`
- `syncUserSelectors()`
- `showUserSearchError(...)`
- `clearUserSearchError()`

**Resultado:**
- Se incorpora capa de UI de users con patrón modular homogéneo.

---

### 5) `src/api/tasks.api.js` (actualizado)
Se corrigió la integración de endpoints de tareas para alinearse con la fuente de datos actual confirmada por el proyecto.

**Cambios:**
- Endpoints de tasks normalizados a:
  - `GET /tasks`
  - `GET /tasks` + filtrado local por `userId`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`
- Se conserva payload con campos usados por el frontend/base:
  - `titulo`
  - `descripcion`
  - `estado`
  - `userId`
- Filtro por usuario robustecido:
  - `String(tarea.userId) === String(userId)`

**Resultado:**
- Se corrige el error de obtención de tareas por desalineación de endpoint/estructura.

---

### 6) `src/services/tasksService.js` (actualizado)
Se reforzó la capa intermedia para mantener compatibilidad estable entre API y UI.

**Cambios:**
- `crearTarea(...)` ajustado para invocar correctamente `taskPost(...)` con estado por defecto.
- Se añadió mapeo centralizado:
  - `mapApiTaskToUiTask(task)`
- Se normalizan resultados en:
  - `obtenerTodasTareas()`
  - `obtenerTareasPorUsuario()`
  - `actualizarTarea()`
  - `actualizarParcialTarea()`

**Resultado:**
- Se evita ruptura por diferencias de forma entre respuestas de API y consumo de UI.

---

### 7) `src/api/users.api.js` (actualizado)
Se ajustaron payloads de creación/actualización de usuarios para compatibilidad con el esquema usado por datos del proyecto.

**Cambios:**
- En `userPost(...)` y `userPut(...)` se envía:
  - `nombre`
  - `email`
  - `rol`
- Se mantiene el contrato de métodos y estructura de capa API existente.

**Resultado:**
- Operaciones de escritura de users alineadas con el modelo actual de datos.

---

## Actualización adicional - Integración Backend Node.js + MySQL (2026-04-18)

### 8) `src/api/tasks.api.js` (refactor)
Se adaptó la capa API de tareas para backend real en Express con respuesta envuelta (`{ success, message, data, errors }`) y estructura de MySQL.

**Cambios:**
- Lectura de respuestas usando `json.data` (con fallback para arrays anidados).
- Payload alineado al backend:
  - `title`
  - `description`
  - `status`
  - `user_id`
  - `created_by`
- `headers` JSON explícitos en operaciones de escritura.
- Soporte para creación con retorno tipo MySQL:
  - captura de `insertId`
  - retorno compatible para capa de servicios.
- Robustez en filtrado por usuario:
  - compatibilidad con `user_id` y `userId`
  - comparación consistente con `String(...)`.

**Resultado:**
- Recuperación y creación de tareas compatibles con backend Express + MySQL sin romper contratos de UI.

---

### 9) `src/api/users.api.js` (refactor)
Se actualizó la capa API de usuarios para consumir correctamente el backend real con respuesta envuelta y payload de servidor.

**Cambios:**
- Lectura de respuestas en `json.data`.
- Payload alineado con backend:
  - `name`
  - `email`
  - `role`
- `headers` JSON en POST/PUT/PATCH.
- Soporte de creación MySQL (`insertId`) para retornar un objeto utilizable por servicios.

**Resultado:**
- Operaciones de usuarios (lectura y escritura) consistentes con el backend Node/MySQL.

---

### 10) `src/services/tasksService.js` (refactor de mapeo)
Se reforzó la transformación de datos API -> UI para tareas, evitando romper la interfaz por diferencias de nombres y tipos.

**Cambios:**
- Mapeo flexible:
  - `title -> titulo`
  - `description -> descripcion`
  - `status -> estado`
  - `user_id -> userId`
- Normalización de IDs en servicio:
  - `id` como `String`
  - `userId` como `String`

**Resultado:**
- La UI mantiene compatibilidad sin depender del nombre de columnas SQL y los filtros por usuario siguen funcionando correctamente.

---

### 11) `src/services/usersService.js` (refactor de mapeo)
Se añadió transformación de usuarios API -> UI para mantener consistencia con los nombres consumidos en frontend.

**Cambios:**
- Mapeo flexible:
  - `name -> nombre`
  - `role -> rol`
- Normalización:
  - `id` como `String`
- Aplicación del transformador en:
  - listado
  - obtención por ID
  - creación
  - actualización total/parcial.

**Resultado:**
- Capa de servicios desacoplada de la forma SQL/Backend y compatible con la UI actual.

---

## Resumen de impacto Frontend
- Integración completa de capa API/Servicios con backend real Node.js/Express + MySQL.
- Manejo explícito de respuestas envueltas y de `insertId` en operaciones de creación.
- Compatibilidad de naming (snake_case <-> camelCase/español) sin romper componentes de interfaz.
- Consistencia de tipos de ID para preservar filtros y comparaciones en UI.

---

## Actualización - Frontend completo (API + Services + Controller + UI + script + index + styles) 

### 12) `src/api/tasks.api.js` (ajustes de integración backend real)
Se consolidó el consumo de endpoints de tareas para backend Express/MySQL, contemplando respuestas envueltas y estructuras variables en `data`.

**Cambios:**
- Se añadió helper `extractData(json)` para centralizar lectura de `json.data`.
- `taskGet()`:
  - tolera respuestas con `data` como array directo.
  - soporta estructuras anidadas (`data.tasks`, `data.rows`).
- `taskGetByUser(userId)`:
  - filtrado robusto por `user_id` o `userId`.
  - comparación estable mediante `String(...)`.
- `taskPost(...)`, `taskPut(...)`, `taskPatch(...)`:
  - payload alineado al backend:
    - `title`
    - `description`
    - `status`
    - `user_id` (cast a `Number` cuando aplica)
    - `created_by` (en creación/reemplazo)
  - `headers` JSON explícitos.
  - manejo de fallback cuando backend no retorna objeto completo.
- `taskPost(...)`:
  - soporte explícito para `insertId`/`id` de respuestas de creación.

**Resultado:**
- Operaciones CRUD de tareas consistentes contra backend real, sin romper el contrato esperado por servicios/UI.

---

### 13) `src/api/users.api.js` (ajustes de payload y normalización de rol)
Se ajustó la capa API de usuarios para alinear los campos enviados/recibidos con el backend actual y el modelo de UI.

**Cambios:**
- Helper `extractData(json)` para leer `json.data`.
- `userGet()` y `userGetById()` consumen respuesta envuelta.
- `userPost(...)` y `userPut(...)`:
  - payload unificado: `{ name, email, document, role }`.
  - normalización de rol antes de enviar:
    - `administrador -> admin`
    - `usuario -> user`
  - headers JSON.
- `userPost(...)`:
  - soporte de retorno por `insertId` cuando aplica.
- `userPatch(...)` y `userDelete(...)`:
  - se mantiene contrato REST con manejo consistente de errores.

**Resultado:**
- Capa API de usuarios compatible con backend Node/MySQL y con los campos usados por el frontend actual.

---

### 14) `src/services/tasksService.js` (mapeo y normalización API -> UI)
Se reforzó la capa de servicios de tareas para desacoplar completamente la UI de la forma de datos del backend.

**Cambios:**
- `crearTarea(...)` usa `taskPost(...)` con estado por defecto `'pendiente'`.
- `obtenerTodasTareas()` y `obtenerTareasPorUsuario()` aplican mapeo centralizado.
- `actualizarTarea(...)` y `actualizarParcialTarea(...)` retornan datos normalizados.
- `mapApiTaskToUiTask(task)`:
  - mapeo flexible de nombres:
    - `title -> titulo`
    - `description -> descripcion`
    - `status -> estado`
    - `user_id -> userId`
    - `task_id -> id` (fallback)
    - `assigned_to/assignedTo -> asignadoA`
    - `created_by/createdBy -> created_by`
    - `created_at/updated_at -> createdAt/updatedAt`
  - normalización de tipos (`id`, `userId`, `asignadoA` como `String`).
- Se mantuvo utilitario de filtros y orden (`aplicarFiltrosYOrdenar`) y exportación JSON.

**Resultado:**
- Servicios de tareas estables ante cambios de naming y estructura del backend, preservando compatibilidad con la UI.

---

### 15) `src/services/usersService.js` (mapeo y normalización API -> UI)
Se actualizó el servicio de usuarios para transformar de forma uniforme la información del backend al formato consumido por interfaz.

**Cambios:**
- `obtenerTodosUsuarios()`, `obtenerUsuarioPorId()`, `crearUsuario()`, `reemplazarUsuario()`, `actualizarParcialUsuario()` retornan datos mapeados.
- `mapApiUserToUiUser(user)`:
  - mapeo flexible:
    - `name -> nombre`
    - `role -> rol`
    - `document/documento -> document`
    - `user_id -> id` (fallback)
  - normalización de `id` a `String`.
- `normalizeRol(...)`:
  - unifica variantes (`admin`, `administrator`, `administrador`) a `administrador`.
  - unifica (`user`, `usuario`) a `usuario`.

**Resultado:**
- Modelo de usuario homogéneo para UI, sin dependencia directa de cómo el backend nombre columnas/campos.

---

### 16) `src/core/appController.js` (orquestación integral tareas + usuarios)
Se consolidó el controlador como capa de coordinación entre servicios, UI y notificaciones para tareas y usuarios.

**Cambios:**
- Estado centralizado:
  - tareas, usuarios, filtros, orden, IDs de eliminación.
- Flujo de tareas:
  - carga por usuario (`cargarTareasPorUsuario`).
  - filtros y orden (`setEstadoFilter`, `setTituloFilter`, `setSortBy`, `toggleSortDir`).
  - creación, edición, eliminación con feedback de toasts.
  - exportación JSON (`exportarTareas`).
- Flujo de usuarios:
  - carga completa (`cargarUsuarios`) con skeleton.
  - filtros por búsqueda y rol (`setUsersSearch`, `setUsersRoleFilter`, `aplicarFiltrosUsuariosYRender`).
  - creación/edición/eliminación (`crearUsuarioNuevo`, `actualizarUsuarioExistente`, `eliminarUsuarioConfirmado`).
- KPIs:
  - `actualizarKpis()` para tareas visibles y usuarios registrados.
- Mensajería:
  - integración de `showSuccess`, `showError`, `showInfo`.

**Resultado:**
- Controlador robusto para ambos dominios (tasks/users), con estado consistente y mejor experiencia de interacción.

---

### 17) UI modules (`src/ui/tasksUi.js`, `src/ui/usersUi.js`, `src/ui/notificationsUi.js`)
Se completó la capa UI modular para renderizado, validación visual, modales y notificaciones toast reutilizables.

**Cambios en `tasksUi.js`:**
- Cache de elementos DOM (`getElements`) para reducir consultas repetidas.
- `renderTasks(...)`:
  - tarjetas con metadatos (`created_by`, asignación, fechas formateadas).
  - badges de estado dinámicos.
  - estado vacío amigable.
- Manejo de errores visuales:
  - `clearUiErrors()`, `showSearchError()`, `showFieldErrors()`.
- Gestión de modal y formulario:
  - `showDeleteModal()`, `hideDeleteModal()`.
  - `prepareEditForm(...)`, `resetForm()`.
- Exportación:
  - `downloadFile(...)` para descarga de JSON.

**Cambios en `usersUi.js`:**
- `renderUsers(...)`:
  - tabla de usuarios con acciones editar/borrar.
  - estado vacío cuando no hay datos.
- utilidades:
  - `syncUserSelectors()`
  - `showUserSearchError()`
  - `clearUserSearchError()`.

**Cambios en `notificationsUi.js`:**
- Contenedor flotante de toasts creado dinámicamente.
- `showNotification(...)` con estilos por tipo (`success`, `error`, `info`) y animación.
- API pública:
  - `showSuccess(...)`
  - `showError(...)`
  - `showInfo(...)`.

**Resultado:**
- UI desacoplada por módulos, con renderizado consistente, feedback visual claro y mejor mantenibilidad.

---

### 18) `src/script.js` (wiring completo de la SPA)
Se fortaleció el punto de entrada para conectar eventos del DOM con el controlador y habilitar flujo completo de la aplicación.

**Cambios:**
- Importación de acciones para tareas y usuarios desde `appController`.
- Navegación entre vistas (`dashboard`, `tasks`, `users`) con sidebar.
- Inicialización:
  - carga de usuarios al `DOMContentLoaded`.
  - carga inicial de tareas si hay usuario seleccionado.
- Sincronización de inputs de usuario:
  - `#user-select` (externo) y `#user-id` (formulario).
- Eventos de tareas:
  - filtros, orden, recarga, submit crear/editar, editar/eliminar por delegación.
- Botón dinámico de exportación JSON insertado sobre contenedor de tareas.
- Eventos de usuarios:
  - búsqueda + filtro por rol.
  - modal crear/editar.
  - confirmación de eliminación con modal dedicado.

**Resultado:**
- Integración de eventos completa y coherente para operación diaria de tareas y usuarios.

---

### 19) `index.html` (estructura de vistas y modales)
Se amplió la estructura HTML para soportar dashboard, gestión de tareas y gestión de usuarios en una misma SPA.

**Cambios:**
- Layout principal con:
  - sidebar y navegación por vistas.
  - secciones `dashboard-view`, `tasks-view`, `users-view`.
- Dashboard:
  - tarjetas KPI para tareas y usuarios.
- Tareas:
  - panel de controles (usuario, estado, búsqueda, orden).
  - formulario de tarea con validación visual.
  - contenedor de listado + skeleton.
- Usuarios:
  - toolbar de búsqueda/rol + botón nuevo usuario.
  - contenedor de tabla + skeleton.
- Modales:
  - confirmación de eliminación de tarea.
  - modal de creación/edición de usuario (incluye `documento`).
  - confirmación de eliminación de usuario.

**Resultado:**
- Base estructural completa para soportar todos los flujos de frontend en una sola interfaz modular.

---

### 20) `styles.css` (sistema visual y componentes UI)
Se consolidó una hoja de estilos integral para layout, componentes y estados visuales de la SPA.

**Cambios:**
- Sistema de variables CSS (`:root`) para paleta y tokens visuales.
- Layout responsive:
  - grid con sidebar + content.
  - adaptación en `@media` para pantallas menores.
- Estilos de componentes:
  - paneles, formularios, botones, tarjetas de tarea, tabla de usuarios.
- Estados de tarea:
  - badges por estado (`pendiente`, `en progreso`, `completada`).
- Modales:
  - overlay, contenido, botones.
- Skeleton loaders:
  - grids/tablas con animación `loading`.
- Estados de error:
  - `field-error` y resaltado de inputs `.error`.
- Dashboard:
  - tarjetas KPI.

**Resultado:**
- Interfaz visual consistente, moderna y responsive para todos los módulos del frontend.

---

## Resumen de impacto Frontend (actualización completa)
- Documentación unificada del alcance completo de cambios en **API, Services, Controller, UI, script, HTML y estilos**.
- Integración estable con backend Node.js/Express + MySQL, incluyendo normalización de respuestas y campos.
- Arquitectura frontend más modular y mantenible (separación clara por capas).
- Mejoras funcionales y UX: vistas por dominio, CRUD completo de usuarios/tareas, notificaciones toast, modales de confirmación, filtros, ordenamientos, exportación y KPIs.

---

## Actualización - Autenticación JWT (Login + Logout + Refresh Automático)

### 21) `src/api/auth.api.js` (nuevo + ajuste de base path)
Se consolidó la capa de autenticación del frontend para consumir los endpoints principales de sesión del backend.

**Cambios:**
- Se implementaron funciones:
  - `authLogin(document, password)` -> `POST /auth/login`
  - `authRefresh(refreshToken)` -> `POST /auth/refresh`
  - `authLogout(accessToken, refreshToken)` -> `POST /auth/logout`
- Se agregó `handleAuthResponse(...)` para parseo y manejo uniforme de errores HTTP.
- Se corrigió la base de autenticación para entorno real:
  - `AUTH_BASE = ${API_URL}/auth`

**Resultado:**
- El frontend quedó alineado con las rutas reales de autenticación del backend para login, renovación y cierre de sesión.

---

### 22) `src/services/authService.js` (nuevo)
Se creó servicio dedicado para persistencia de sesión y orquestación básica de login/logout.

**Cambios:**
- Claves de almacenamiento:
  - `tm_access_token`
  - `tm_refresh_token`
  - `tm_user`
- Funciones implementadas:
  - `saveSession({ accessToken, refreshToken, user })`
  - `updateSessionTokens(accessToken, refreshToken)` (para refresh silencioso)
  - `getSession()`
  - `isAuthenticated()`
  - `clearSession()`
  - `loginWithCredentials(document, password)`
  - `logoutCurrentSession()`

**Resultado:**
- Gestión centralizada de sesión en `localStorage`, reutilizable desde UI y cliente HTTP.

---

### 23) `src/api/httpClient.js` (nuevo)
Se incorporó cliente HTTP autenticado con renovación automática de access token ante respuestas `401`.

**Cambios:**
- Implementación de `authFetch(url, options, retry)`:
  - adjunta `Authorization: Bearer <accessToken>` automáticamente.
  - si recibe `401`, intenta `authRefresh(refreshToken)`.
  - actualiza tokens vía `updateSessionTokens(...)`.
  - reintenta la petición original una sola vez.
- Control de concurrencia para refresh:
  - `refreshPromise` compartida, evitando múltiples refresh simultáneos.
- Si refresh falla/inválido/revocado:
  - `clearSession()`
  - disparo de evento global:
    - `window.dispatchEvent(new CustomEvent('auth:session-expired'))`

**Resultado:**
- Renovación silenciosa de access token sin interrumpir al usuario mientras el refresh token siga vigente.

---

### 24) `src/api/tasks.api.js` (actualizado a `authFetch`)
Se migraron todas las operaciones de tareas al cliente HTTP autenticado con auto-refresh.

**Cambios:**
- Reemplazo de `fetch` directo por `authFetch` en:
  - `taskGet`
  - `taskPost`
  - `taskPut`
  - `taskPatch`
  - `taskDelete`
- Eliminación de helpers locales de token/header:
  - `getAccessToken`
  - `buildAuthHeaders`
- Se mantuvo:
  - `extractData(json)`
  - manejo de payload y errores previos.

**Resultado:**
- Endpoints de tareas protegidos ahora soportan renovación automática de token y reintento transparente.

---

### 25) `src/api/users.api.js` (actualizado a `authFetch`)
Se migraron todas las operaciones de usuarios al cliente HTTP autenticado con auto-refresh.

**Cambios:**
- Reemplazo de `fetch` directo por `authFetch` en:
  - `userGet`
  - `userGetById`
  - `userPost`
  - `userPut`
  - `userPatch`
  - `userDelete`
- Eliminación de helpers locales de token/header:
  - `getAccessToken`
  - `buildAuthHeaders`
- Se conservó contrato REST y manejo de respuesta envuelta (`json.data`).

**Resultado:**
- Consumo de endpoints de usuarios robusto ante expiración de access token y recuperación automática por refresh.

---

### 26) `src/script.js` + `index.html` + `styles.css` (flujo de autenticación UI)
Se completó la integración visual y de comportamiento para login/logout y expiración de sesión.

**Cambios principales en `script.js`:**
- Guard inicial por autenticación:
  - si no hay sesión, muestra vista de login (`auth-view`) y oculta app (`app-shell`).
- Submit de login:
  - usa `loginWithCredentials(...)`,
  - al éxito, muestra app y carga data inicial.
- Logout:
  - usa `logoutCurrentSession()`,
  - limpia estado y vuelve a login.
- Manejo global de expiración de sesión:
  - listener `window.addEventListener('auth:session-expired', ...)`
  - fuerza retorno a login y muestra mensaje de sesión expirada.

**Cambios en `index.html` y `styles.css`:**
- Pantalla de autenticación inicial (`auth-view`) con formulario:
  - documento
  - contraseña
- Mensajería de error de login (`#login-error`).
- Botón de cierre de sesión (`#logout-btn`) en app.
- Estilos dedicados para experiencia de login consistente con el diseño existente.

**Resultado:**
- Flujo de autenticación completo en frontend:
  - Login inicial
  - Uso normal del sistema autenticado
  - Logout explícito
  - Expiración controlada de sesión cuando el refresh ya no es válido.

---

## Resumen de impacto Frontend (autenticación y sesión)
- Se habilitó autenticación JWT de extremo a extremo en la SPA.
- Se agregó renovación automática de access token sin pedir login inmediato.
- Se garantiza que solo se solicita re-login cuando el refresh token expira o es inválido/revocado.
- Se centralizó la lógica de sesión y transporte autenticado para reducir duplicidad y facilitar mantenimiento.

---

## Actualización - Reorganización y rediseño visual de la sección de Tareas

### 27) `index.html` (reordenamiento estructural de `tasks-view`)
Se reorganizó la vista de tareas para priorizar el flujo solicitado: primero creación, luego búsqueda/filtrado y finalmente listado.

**Cambios:**
- Se movió el formulario `#task-form` al inicio de la sección de tareas.
- Se añadió encabezado descriptivo al panel de creación:
  - título: **Crear tarea**
  - texto de apoyo para guiar al usuario.
- Se separó la búsqueda/filtrado en su propio panel (`task-filter-panel`) con encabezado:
  - título: **Buscar y filtrar tareas**
  - descripción de uso.
- Se mantuvieron todos los IDs funcionales existentes para evitar regresiones JS:
  - `#user-select`, `#estado-filter`, `#titulo-filter`, `#sort-by`, `#sort-dir`, `#refresh-btn`.
- Se actualizó encabezado de listado:
  - **Listado de tareas** + descripción.
- Se incorporó contenedor de acciones para el listado:
  - `#task-list-actions`.

**Resultado:**
- Flujo de uso más profesional y claro en la gestión de tareas (crear -> filtrar -> gestionar listado).

---

### 28) `src/script.js` (ajuste de ubicación de acción de exportación)
Se actualizó la inserción del botón de exportación para alinearlo con la nueva composición visual del listado.

**Cambios:**
- El botón dinámico `📥 Exportar JSON` ahora se inserta en `#task-list-actions`.
- Se dejó fallback compatible:
  - si `#task-list-actions` no existe, el botón se inserta como antes encima de `.tasks-container`.
- Se preservó el comportamiento original de exportación (`exportarTareas()`).

**Resultado:**
- Acciones del listado agrupadas en un área dedicada, mejorando orden visual sin alterar funcionalidades existentes.

---

### 29) `styles.css` (mejora integral de presentación y orden visual en tareas)
Se aplicó una segunda capa de refinamiento visual para resolver desorden de espaciado, separación de botones y control de campos.

**Cambios de diseño/espaciado:**
- Paneles con mayor aire visual:
  - `padding` aumentado.
  - sombras más definidas y profesionales.
- Encabezados de panel (`.panel-head`) para jerarquía clara.
- Nuevos estilos de paneles de tareas:
  - `.task-create-panel`
  - `.task-filter-panel`
  - `.task-list-panel`.

**Cambios en formularios y campos:**
- Etiquetas (`.form-label`) con mejor separación.
- Inputs/textarea con:
  - `min-height` uniforme,
  - `hover` y `focus` más consistentes,
  - transición suave visual.
- `textarea` con `resize: vertical` y altura mínima, para evitar desorden.

**Cambios en botones y acciones:**
- Botones (`.btn`) más consistentes:
  - altura mínima,
  - padding uniforme,
  - efectos `hover`/`active`.
- Barras de acciones mejor separadas:
  - `.task-filter-actions` con divisor superior.
  - `.task-list-actions` con divisor inferior y espaciado reforzado.
- Mejor distribución de botones en tarjetas y barras (`gap` y `flex-wrap`).

**Cambios en listado de tareas:**
- Tarjetas (`.task-card`) con mejor legibilidad:
  - contraste refinado,
  - espaciado interno superior,
  - metadatos con separación visual (`border-top` punteado).
- Contenedor de tarjetas con `gap` y ancho mínimo más equilibrado.

**Responsive:**
- Ajustes para `<=1024px` y `<=640px`:
  - grids colapsan progresivamente.
  - acciones y botones pasan a ancho completo en móvil.
  - menor riesgo de amontonamiento visual.

**Resultado:**
- Interfaz de tareas más limpia, profesional y estable visualmente en desktop y móvil.

---

**Cambios:**
- Registro de tareas de:
  - reordenamiento HTML,
  - mejora CSS,
  - ajuste en script.
- Marcado de ítems como completados al finalizar.

**Resultado:**
- Trazabilidad clara del trabajo aplicado durante la mejora de UX/UI de tareas.

---

## Resumen de impacto Frontend (reorganización visual de tareas)
- Se priorizó el flujo de trabajo solicitado: **crear tarea** primero, luego **filtrar/buscar**, luego **listado**.
- Se mejoró notablemente la organización visual y separación de acciones.
- Se redujo el desorden en campos editables y distribución de botones.
- Se mantuvo compatibilidad funcional al conservar IDs y eventos existentes.
- Se reforzó la experiencia responsive para evitar desalineaciones en resoluciones menores.

---

## Actualización - Corrección de error al crear tareas (mensaje: "No se pudo registrar la tarea")

### 31) `src/api/tasks.api.js` (robustez en creación `taskPost`)
Se aplicaron ajustes de compatibilidad para reducir fallos de validación al crear tareas y mejorar el diagnóstico de errores devueltos por backend.

**Cambios:**
- Normalización del campo `created_by` para mayor compatibilidad:
  - `admin` / `administrador` -> `administrador`
  - cualquier otro valor -> `usuario`
- Ajuste de parseo de `user_id`:
  - se usa `Number(userId)` cuando es numérico válido.
  - si no, se conserva el valor original para no forzar `NaN`.
- Manejo seguro del `response.json()`:
  - se encapsuló en `try/catch` para evitar ruptura cuando el backend responde sin body JSON.
- Mejor extracción de mensaje de error backend:
  - prioridad: `json.message` -> `json.error` -> `json.errors[]`.
- Fallback de ID de creación más robusto:
  - `data.insertId` / `data.id` / `json.insertId` / `json.id`.

**Resultado:**
- Mayor tolerancia a variaciones del backend en validación y formato de respuesta.
- Mensajes de error más informativos para diagnosticar causas reales de fallo de creación.

---

## Actualización - Integración RBAC + Gestión de Roles + Búsqueda por ID (Frontend)

### 32) `src/core/permissions.js` (nuevo)
Se creó una capa central de permisos para aplicar lógica RBAC en frontend usando la sesión autenticada.

**Cambios:**
- Lectura de permisos del usuario desde `authService.getSession()`.
- Helpers genéricos:
  - `getPermissionCodes()`
  - `hasPermission(code)`
  - `hasAnyPermission(codes)`
- Helpers por dominio:
  - Usuarios: `canReadUsers`, `canCreateUsers`, `canUpdateUsers`, `canDeleteUsers`
  - Tareas: `canReadTasks`, `canCreateTasks`, `canUpdateTasks`, `canDeleteTasks`
  - Roles: `canReadRoles`, `canManageRoles`

**Resultado:**
- Base unificada para decisiones de visibilidad/acción por permisos en toda la SPA.

---

### 33) `src/api/roles.api.js` + `src/api/index.js` (nuevo/actualizado)
Se implementó cliente API de roles y su exportación en el barrel de API.

**Cambios:**
- Endpoints integrados:
  - `roleGet()` -> `GET /roles`
  - `roleGetById(id)` -> `GET /roles/:id`
  - `roleGetPermissionsById(id)` -> `GET /roles/:id/permissions`
  - `rolePost(name, description, permissions)` -> `POST /roles`
  - `rolePut(id, name, description, permissions)` -> `PUT /roles/:id`
  - `rolePatch(id, changes)` -> `PATCH /roles/:id`
  - `roleDelete(id)` -> `DELETE /roles/:id`
- Uso de `authFetch` para token + refresh automático.
- Manejo de parseo seguro y extracción de errores uniforme.

**Resultado:**
- Consumo completo y seguro del módulo de roles desde frontend.

---

### 34) `src/services/rolesService.js` (nuevo)
Se agregó capa de servicio para mapear datos de roles API -> UI.

**Cambios:**
- Funciones:
  - `obtenerRoles`
  - `obtenerRolPorId`
  - `obtenerPermisosRol`
  - `crearRol`
  - `reemplazarRol`
  - `actualizarParcialRol`
  - `eliminarRol`
- Normalización de shape para consumo en componentes:
  - `id`, `nombre`, `descripcion`, `createdAt`
  - permisos en formato de códigos.

**Resultado:**
- Integración desacoplada y consistente de datos de roles para render/UI.

---

### 35) `src/core/appController.js` (actualizado)
Se amplió el controlador principal con estado y flujos de Roles, guardas RBAC y filtros por ID en Usuarios/Roles.

**Cambios:**
- Estado nuevo:
  - `rolesActuales`, `rolePermissionsMap`, `deleteRoleId`
  - `rolesSearch`, `rolesIdSearch`
  - `usersIdSearch`
- Guardas RBAC aplicadas en acciones sensibles:
  - crear/editar/eliminar usuarios
  - crear/editar/eliminar tareas
  - leer/gestionar roles
- Nuevas funciones de Roles:
  - `cargarRoles`
  - `aplicarFiltrosRolesYRender`
  - `setRolesSearch`
  - `setRolesIdSearch`
  - `crearRolNuevo`
  - `prepararEdicionRol`
  - `actualizarRolExistente`
  - `prepararEliminacionRol`
  - `eliminarRolConfirmado`
  - `getRolePermissionsCatalog`
- Filtros de Usuarios mejorados:
  - `setUsersIdSearch`
  - búsqueda combinada por ID + texto + rol.
- Filtros de Roles mejorados:
  - búsqueda combinada por ID + texto (nombre/descripción).

**Resultado:**
- Orquestación integral de RBAC + roles + búsquedas por ID sin romper el flujo existente.

---

### 36) `src/ui/rolesUi.js` + `src/ui/usersUi.js` (nuevo/ajustado)
Se añadió render de roles y se consolidó visualización compatible con permisos.

**Cambios:**
- `rolesUi.js`:
  - tabla de roles con nombre, descripción y permisos.
  - acciones editar/borrar condicionadas por `canManage`.
- `usersUi.js`:
  - render estable de rol ya mapeado (`administrador/supervisor/usuario`) desde servicios.

**Resultado:**
- Capa UI preparada para administración de roles y visualización correcta por permisos.

---

### 37) `index.html` (actualizado)
Se extendió la estructura de la SPA para incluir módulo de Roles y búsqueda por ID en Usuarios/Roles.

**Cambios:**
- Nueva navegación:
  - botón `Roles` (`data-view="roles-view"`).
- Nueva vista `roles-view`:
  - buscador por ID: `#roles-id-search`
  - buscador por texto: `#roles-search`
  - botón `#new-role-btn`
  - contenedor `#roles-container`
- Nuevos modales:
  - `#role-modal` (crear/editar rol, selección múltiple de permisos)
  - `#delete-role-modal` (confirmación de eliminación)
- En `users-view`:
  - nuevo input `#users-id-search` para búsqueda por ID.
- Se mantuvieron IDs previos para no romper bindings existentes.

**Resultado:**
- Interfaz completa para administración de roles y búsquedas por ID en ambos módulos.

---

### 38) `src/script.js` (actualizado)
Se integró wiring de eventos para RBAC, roles CRUD y búsqueda por ID.

**Cambios:**
- Imports nuevos:
  - acciones de roles desde `appController`.
  - permisos desde `core/permissions`.
- RBAC de presentación:
  - oculta/limita navegación y botones según permisos.
  - selección de primera vista permitida al iniciar sesión.
- Eventos de roles:
  - búsqueda por ID y texto
  - abrir/cerrar modal
  - crear/editar rol
  - eliminar rol con modal de confirmación.
- Eventos de usuarios:
  - búsqueda por ID (`users-id-search`) además de texto/rol.
- Al login:
  - aplica visibilidad RBAC
  - carga usuarios y roles según permisos.

**Resultado:**
- Flujo operativo completo de Roles y RBAC en el entrypoint de la SPA.

---

### 39) `src/services/usersService.js` (ajuste de mapeo de rol)
Se reforzó el mapeo del rol para resolver casos donde UI mostraba rol incorrecto.

**Cambios:**
- Normalización de fuentes de rol:
  - `role`, `rol`, `role_name`, `roleName`, `role_code`.
- Mapeo final hacia etiquetas UI consistentes:
  - `administrador`, `supervisor`, `usuario`.

**Resultado:**
- Corrección visual de roles en tabla de usuarios acorde al rol real asignado.

---

### 40) Resumen de impacto (Frontend)
- Integración RBAC completa en frontend, alineada a permisos del backend.
- Módulo de Roles funcional (listar, crear, editar, eliminar, consultar permisos).
- Guardas de permisos en acciones de Usuarios/Tareas/Roles.
- Corrección de visualización de rol de usuarios.
- Búsqueda por ID implementada en:
  - **Usuarios** (`users-id-search`)
  - **Roles** (`roles-id-search`)
- Estructura y eventos ajustados manteniendo compatibilidad con la base existente.

---

## Actualización - Modernización de alertas y confirmaciones con SweetAlert2

### 41) `src/ui/notificationsUi.js` (refactor a SweetAlert2)
Se reemplazó el sistema artesanal de toasts por SweetAlert2 para un look & feel moderno, consistente y más agradable visualmente.

**Cambios:**
- Se eliminó el contenedor manual de notificaciones (`notification-toast-container`) y su renderizado DOM custom.
- Se integró `Swal` desde `sweetalert2`.
- Se estandarizaron toasts reutilizables con configuración base:
  - `toast: true`
  - posición `top-end`
  - barra de progreso y pausa de timer al hover.
- API pública mantenida y mejorada:
  - `showSuccess(message)`
  - `showError(message)`
  - `showInfo(message)`
- Se añadió confirmación reutilizable:
  - `showConfirm({ title, text, confirmButtonText, cancelButtonText, icon })`
  - retorna `Boolean(result.isConfirmed)` para simplificar decisiones en controladores.

**Resultado:**
- Notificaciones más modernas, uniformes y fáciles de mantener en toda la aplicación.

---

### 42) `src/core/appController.js` (confirmaciones centralizadas con SweetAlert2)
Se migraron confirmaciones críticas de eliminación para usar `showConfirm` y mejorar UX en acciones destructivas.

**Cambios:**
- Import actualizado:
  - `showSuccess, showError, showInfo, showConfirm`.
- Eliminación de tareas (`executeDelete`):
  - ahora solicita confirmación con SweetAlert2 antes de ejecutar `eliminarTarea(...)`.
  - si cancela, limpia estado de eliminación.
- Eliminación de usuarios (`eliminarUsuarioConfirmado`):
  - confirmación previa con SweetAlert2.
- Eliminación de roles (`eliminarRolConfirmado`):
  - confirmación previa con SweetAlert2.
- Se mantuvo el feedback de éxito/error con toasts modernos.

**Resultado:**
- Flujo de confirmación más claro y amigable para operaciones irreversibles en tareas, usuarios y roles.

---

### 43) `src/script.js` (ajuste de wiring para confirmaciones modernas)
Se actualizó el punto de entrada para desacoplarlo de modales de confirmación legacy en usuarios/roles y delegar confirmación al controlador + SweetAlert2.

**Cambios:**
- En acciones de borrado:
  - Usuarios: al hacer click en `.user-delete`, ahora ejecuta:
    - `prepararEliminacionUsuario(...)`
    - `await eliminarUsuarioConfirmado()`
  - Roles: al hacer click en `.role-delete`, ahora ejecuta:
    - `prepararEliminacionRol(...)`
    - `await eliminarRolConfirmado()`
- Se retiraron referencias no utilizadas a modales legacy de confirmación de usuarios/roles en JS:
  - `delete-user-modal`, `confirm-delete-user`, `cancel-delete-user`
  - `delete-role-modal`, `confirm-delete-role`, `cancel-delete-role`
- Se preservó la compatibilidad de flujo en tareas y el resto de navegación/eventos existentes.

**Resultado:**
- Menos complejidad de wiring, confirmaciones unificadas y experiencia visual consistente.

---

### 44) Validación técnica ejecutada
Se ejecutó compilación de producción del frontend para verificar integridad de cambios.

**Comando ejecutado:**
- `cmd /c npm run build` (desde `Frontend`)

**Resultado:**
- Build exitoso con Vite.
- Módulos transformados y artefactos de `dist/` generados sin errores de compilación.

---

## Resumen de impacto (Modernización de alertas)
- Se modernizó la experiencia de notificaciones con SweetAlert2 en toda la SPA.
- Confirmaciones de eliminación (tareas/usuarios/roles) ahora usan diálogos modernos, consistentes y más seguros para UX.
- Se redujo dependencia de modales de confirmación legacy en `script.js`.
- Se mantuvo compatibilidad funcional del frontend y se validó compilación exitosa.
