# Changelog

## Objetivo del cambio
**users** con la misma modularización utilizada en **tasks**, y añadir soporte de método **PUT** para ambos recursos (**tasks** y **users**) para mantener una arquitectura consistente por capas (API + Service).

---

## Cambios realizados

### 1) `src/api/users.api.js` (nuevo/implementado)
Se implementó completamente el módulo API de usuarios siguiendo el patrón de `tasks.api.js` con bloques por método HTTP y documentación JSDoc.

**Métodos agregados:**
- `userGet()` → GET `/users`
- `userGetById(id)` → GET `/users/:id`
- `userPost(name, email, role)` → POST `/users`
- `userPut(id, name, email, role)` → PUT `/users/:id`
- `userPatch(id, changes)` → PATCH `/users/:id`
- `userDelete(id)` → DELETE `/users/:id`

**Resultado:**
- La capa API para users quedó estandarizada y lista para usarse desde services/UI.

---

### 2) `src/api/tasks.api.js` (actualizado)
Se agregó la implementación faltante del método PUT para tareas.

**Método agregado:**
- `taskPut(id, titulo, descripcion, status, userId, created_by)` → PUT `/tasks/:id`

**Detalle técnico:**
- Se envía `Content-Type: application/json`.
- Se mantiene estructura de payload alineada con el backend actual:
  - `title`
  - `description`
  - `status`
  - `user_id`
  - `created_by`
- Se añadió manejo de error con `throw new Error(...)` cuando la respuesta no es exitosa.

---

### 3) `src/api/index.js` (actualizado)
Se amplió el archivo índice de exportaciones para exponer todos los métodos necesarios de ambos módulos API.

**Tasks exporta ahora:**
- `taskPost`
- `taskGet`
- `taskGetByUser`
- `taskPut` (nuevo metodo)
- `taskPatch`
- `taskDelete`

**Users exporta ahora:**
- `userGet`
- `userGetById`
- `userPost`
- `userPut`
- `userPatch`
- `userDelete`

**Resultado:**
- Punto único de importación para la capa de servicios.

---

### 4) `src/services/usersService.js` (nuevo)
Se creó el servicio de usuarios, análogo al de tareas, como capa intermedia entre UI y API.

**Funciones agregadas:**
- `obtenerTodosUsuarios()` → usa `userGet`
- `obtenerUsuarioPorId(id)` → usa `userGetById`
- `crearUsuario(nombre, correo, rol = 'usuario')` → usa `userPost`
- `reemplazarUsuario(id, nombre, correo, rol = 'usuario')` → usa `userPut` 
- `actualizarParcialUsuario(id, cambios = {})` → usa `userPatch`
- `eliminarUsuario(id)` → usa `userDelete`

**Resultado:**
- Users ya cuenta con la misma estructura modular por capas que tasks.

---

### 5) `src/services/tasksService.js` (actualizado)
Se adaptó el servicio para soportar PUT en actualización completa de tareas.

**Cambios:**
- Importa `taskPut` desde `../api/index.js`.
- `actualizarTarea(...)` ahora usa **PUT**:
  - `actualizarTarea(id, titulo, descripcion, userId, status = 'pendiente', created_by = 'usuario')`
  - Internamente: `taskPut(...)`
- Se añadió función adicional para mantener PATCH disponible:
  - `actualizarParcialTarea(id, titulo, descripcion, userId, status)` → usa `taskPatch(...)`

**Resultado:**
- Actualización completa por PUT y actualización parcial por PATCH disponibles en la capa de servicio.

---

## Consideraciones de compatibilidad

- La firma de `crearTarea` en `tasksService.js` ya venía con una posible diferencia respecto a `taskPost` (que recibe más argumentos: `status`, `created_by`).  
  Este cambio no la alteró para evitar impactos no solicitados en controladores/UI existentes.
- `actualizarTarea` ahora usa PUT con valores por defecto para `status` y `created_by` para reducir ruptura inmediata en llamadas existentes.
- Se mantuvo `actualizarParcialTarea` para los casos donde se requiera PATCH.
