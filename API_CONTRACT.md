# Contrato de la API - Farmacia Backend

A continuación se documentan todos los endpoints disponibles en el backend, agrupados por controlador, para que puedan ser integrados correctamente en el frontend.

**URL Base:** `http://localhost:3000` (o la URL configurada para el backend)

---

## 1. Autenticación (`/auth`)

Maneja el registro, inicio de sesión y gestión de la sesión del usuario.

| Método | Endpoint | Descripción | Body / Parámetros | Respuesta (Ejemplo) |
|---|---|---|---|---|
| **POST** | `/auth/login` | Inicia sesión en el sistema. | `{ "username": "...", "password": "..." }` | `{ "message": "Login successful", "data": { "token": "...", "user": { "id": 1, "username": "...", "role": "ROOT", "empleado": {...} }, "permisos": ["VENTAS", "CAJA"] } }` |
| **POST** | `/auth/register` | Registra un nuevo empleado y usuario. | DTO de registro. | Datos del usuario registrado. |
| **POST** | `/auth/change-password` | Cambia la contraseña del usuario logueado. | `{ "currentPassword": "...", "newPassword": "..." }` | Mensaje de éxito. |

---

## 2. Sucursales (`/sucursal`)

Manejo de las sucursales (puntos de venta/farmacias).

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/sucursal` | Obtiene el listado de todas las sucursales activas. | Ninguno |
| **GET** | `/sucursal/:id` | Obtiene los detalles de una sucursal específica. | Param: `id` |
| **POST** | `/sucursal` | Crea una nueva sucursal. | DTO con datos de la sucursal (nombre, direccion, etc.) |
| **PUT** | `/sucursal/:id` | Actualiza los datos de una sucursal. | Param: `id`, Body: Datos a actualizar |
| **DELETE** | `/sucursal/:id` | Desactiva/Elimina una sucursal lógicamente. | Param: `id` |

---

## 3. Categorías (`/categoria`)

Clasificación de los medicamentos/productos.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/categoria` | Obtiene todas las categorías de productos. | Ninguno |
| **GET** | `/categoria/:id` | Detalles de una categoría específica. | Param: `id` |
| **POST** | `/categoria` | Crea una categoría. | `{ "nombre": "...", "descripcion": "..." }` |
| **PUT** | `/categoria/:id` | Actualiza una categoría. | Param: `id`, Body: Datos actualizados |
| **DELETE** | `/categoria/:id` | Desactiva una categoría. | Param: `id` |

---

## 4. Productos (`/producto`)

Catálogo general de medicamentos y productos.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/producto` | Listado general de productos. | Ninguno (Soporta query params de búsqueda) |
| **GET** | `/producto/:id` | Detalles de un producto. | Param: `id` |
| **POST** | `/producto` | Crea un producto nuevo en catálogo. | DTO: nombre, principioActivo, categoríaId, etc. |
| **PUT** | `/producto/:id` | Edita la información de un producto. | Param: `id`, Body: datos editados |
| **DELETE** | `/producto/:id` | Desactiva el producto del catálogo. | Param: `id` |

---

## 5. Métodos de Pago (`/metodo-pago`)

Gestión de formas de pago disponibles para cobrar las ventas.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/metodo-pago` | Listado general de métodos de pago activos. | Ninguno |
| **GET** | `/metodo-pago/:id` | Detalles de un método de pago. | Param: `id` |
| **POST** | `/metodo-pago` | Crea un método de pago. | `{ "nombre": "Efectivo", "descripcion": "..." }` |
| **PUT** | `/metodo-pago/:id` | Edita la información. | Param: `id`, Body: datos editados |
| **DELETE** | `/metodo-pago/:id` | Desactiva el método de pago. | Param: `id` |

---

## 6. Inventarios (`/inventario`)

Gestión de stock físico, lotes y vencimientos en cada sucursal.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/inventario` | Listado del inventario (filtrable por sucursal). | Query Param opcional: `?sucursalId=X` |
| **GET** | `/inventario/:id` | Detalles de un registro de inventario. | Param: `id` |
| **GET** | `/inventario/alertas/expiracion`| Lista de inventarios próximos a caducar. | Query Param opcional: `?dias=30` |
| **GET** | `/inventario/alertas/quiebre` | Lista de productos con bajo stock. | Query Param opcional: `?umbral=10` |
| **POST** | `/inventario` | Registra un nuevo ingreso a inventario (lote).| DTO: productoId, sucursalId, lote, fechaVencimiento, cantidad |
| **PUT** | `/inventario/:id` | Ajusta cantidad o datos de un lote. | Param: `id`, Body: datos a ajustar |
| **DELETE** | `/inventario/:id` | Retira un lote del inventario. | Param: `id` |

---

## 7. Clientes (`/cliente`)

Directorio de clientes para asignar ventas.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/cliente` | Obtiene el listado de clientes. | Ninguno |
| **GET** | `/cliente/:id` | Detalles del cliente. | Param: `id` |
| **POST** | `/cliente` | Registra un nuevo cliente. | DTO: nombreCompleto, nitDocumento, email, etc. |
| **PUT** | `/cliente/:id` | Edita un cliente. | Param: `id`, Body: datos |
| **DELETE** | `/cliente/:id` | Desactiva un cliente. | Param: `id` |

---

## 8. Ventas (`/venta`)

Gestión de Punto de Venta.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/venta` | Historial de todas las ventas de la sucursal. | Ninguno (o con query filters) |
| **GET** | `/venta/pendientes` | Lista de ventas en estado `PENDIENTE`. | Ninguno |
| **GET** | `/venta/:id` | Detalle completo de una venta con sus items. | Param: `id` |
| **POST** | `/venta` | Crea una nueva venta (inicia en `PENDIENTE`). | DTO: sucursalId, clienteId, arreglo de detalles (inventarioId, cantidad, precio) |
| **POST** | `/venta/:id/cobrar` | Confirma el pago de la venta y descuenta stock.| Param: `id`, Body: `{ "metodoPagoId": 1, "cajeroId": 2 }` |
| **DELETE** | `/venta/:id` | Anula una venta (devuelve el estado a `ANULADA`).| Param: `id` |

---

## 9. Métricas / Dashboard (`/metrics`)

Datos estadísticos para el panel de gerencia y administración.

| Método | Endpoint | Descripción | Body / Parámetros |
|---|---|---|---|
| **GET** | `/metrics/summary` | Resumen general (KPIs): ventas hoy, clientes, etc. | Query param opcional: `?sucursalId=X` |
| **GET** | `/metrics/monthly-behavior` | Serie de tiempo de ventas de los últimos meses. | Ninguno |
| **GET** | `/metrics/recent-transactions`| Las últimas ventas realizadas en el sistema. | Ninguno |
| **GET** | `/metrics/arqueo` | Arqueo de caja y totales agrupados por pago. | Query: `?sucursalId=X&fecha=YYYY-MM-DD` |

---

> **Nota para la Implementación en Frontend:**
> 1. Asegúrate de incluir el token JWT en el header `Authorization: Bearer <token>` para todos los endpoints a excepción del `/auth/login`.
> 2. Protege las rutas en el Frontend validando que el código del módulo de la ruta a la que se desea acceder exista en el arreglo `permisos` devuelto durante el Login.

---

## 10. Datos Estáticos y Constantes

Para validaciones y mapeos en el frontend, considera los siguientes valores constantes que están implementados por defecto en el backend (seeder):

### Módulos (Códigos)
El frontend debe verificar estos códigos exactos en el arreglo `permisos`:
- `DASHBOARD`: Dashboard Principal
- `VENTAS`: Punto de Venta
- `CAJA`: Control de Caja
- `ADMINISTRACION`: Administración del Sistema
- `GERENCIA`: Reportes y Gerencia

### Estados de Venta
- `PENDIENTE`
- `COBRADA`
- `ANULADA`

### Roles (Referencia)
- `ROOT`
- `ADMINISTRADOR`
- `GERENTE`
- `CAJERO`
- `VENDEDOR`

---

## 11. Estructuras de Entidades Principales (JSON)

A continuación, se detalla la estructura principal de las entidades que devuelve la API (generalmente, los campos generados por auditoría como `createdAt`, `createdBy`, `updatedAt`, `updatedBy` están presentes en todas las entidades de catálogo).

### Sucursal
```typescript
{
  "id": number,
  "nombre": string,
  "direccion": string,
  "telefono": string | null,
  "activo": boolean
}
```

### Categoría
```typescript
{
  "id": number,
  "nombre": string,
  "descripcion": string | null,
  "activo": boolean
}
```

### Proveedor
```typescript
{
  "id": number,
  "nombreEmpresa": string,
  "contactoPrincipal": string | null,
  "telefono": string | null,
  "email": string | null,
  "direccion": string | null,
  "activo": boolean
}
```

### Cliente
```typescript
{
  "id": number,
  "nitDocumento": string | null,
  "nombreCompleto": string,
  "email": string | null,
  "telefono": string | null,
  "activo": boolean
}
```

### Método de Pago
```typescript
{
  "id": number,
  "nombre": string, // Ej. "Efectivo", "Tarjeta de Crédito"
  "descripcion": string | null,
  "activo": boolean
}
```

### Producto (Medicamento)
```typescript
{
  "id": number,
  "codigoBarras": string | null,
  "nombre": string,
  "principioActivo": string | null,
  "presentacion": string | null,
  "categoriaId": number,
  "proveedorId": number,
  "precioVenta": number,     // Retornado como número o string dependiendo de la db, usualmente parseado a número en front
  "requiereReceta": boolean,
  "activo": boolean,
  "categoria"?: Categoria,   // Incluido al solicitar relaciones
  "proveedor"?: Proveedor    // Incluido al solicitar relaciones
}
```

### Inventario (Stock por Sucursal)
```typescript
{
  "id": number,
  "sucursalId": number,
  "productoId": number,
  "lote": string,
  "fechaVencimiento": string, // ISO Date string (ej. "2026-07-24T00:00:00.000Z")
  "cantidadDisponible": number,
  "activo": boolean,
  "producto"?: Producto // Incluido al buscar el inventario completo
}
```

### Venta (Cabecera)
```typescript
{
  "id": number,
  "sucursalId": number,
  "clienteId": number | null,
  "metodoPagoId": number | null,
  "cajeroId": number | null,
  "estado": "PENDIENTE" | "COBRADA" | "ANULADA",
  "total": number,
  "activo": boolean,
  "detalleVentas"?: DetalleVenta[] // Detalles incluidos al traer la venta completa
}
```

### DetalleVenta
```typescript
{
  "id": number,
  "ventaId": number,
  "inventarioId": number,
  "cantidad": number,
  "precioUnitario": number,
  "descuento": number,
  "inventario"?: Inventario // Relación con el lote/producto vendido
}
```
