# CARRITO DE COMPRAS - DOCUMENTACION COMPLETA
Correa Estrada Arantxa
Flores Lozornio Kenai
Molina Leal Sebastian Enrique
Tableros García Enrique 
## REQUISITOS:

### 1. Separacion Backend y Frontend

* **Backend**: 
Tableros 
Node.js + Express en `/Backend/` 
  - `server.js` - Servidor principal (puerto 3000)
  - `routes/` - Rutas API y vistas (productroutes, carritoroutes, ventasroutes)
  - `controllers/` - Lógica de negocio (productcontroller, carritocontroller, ventascontroller)
  - `models/` - Modelos de datos (productmodel, carritomodel, ventasmodel)
  - `config/dbconfig.js` - Configuración MySQL

* **Frontend**:  Kenai
EJS + CSS + JavaScript en `/Frontend/`
  - `views/` - 11 plantillas EJS
  - `css/` - Estilos modulares
  - `js/` - 7 archivos JavaScript con integración a API
  - `img/` - Imágenes de productos

### 2. Base de Datos - 
* `usuarios` - Gestión de usuarios
* `productos` - Catálogo de productos
* `carrito` - Carrito persistente en BD
* `ventas` - Registro de ventas
* `detalle_ventas` - Detalles de cada venta

### 3. Funcionalidades de Usuario
* **Crear cuenta** (`/register`)
* **Iniciar sesión** (`/login`)
* **Editar perfil** - Cambio de contraseña y correo
* **Agregar al carrito** - Con persistencia en BD
* **Vaciar carrito** - API integrada
* **Comprar** - Sistema completo con ventas en BD

### 4. Debugging
* Logs de debug en todos los controllers
* Logs de errores con stack trace
* Logs de acciones del usuario

### 5. Postman Arantxa 
* Colección completa con todos los endpoints
* Ejemplos de request/response
* Documentación de cada endpoint

---

## CONFIGURACION


- Node.js 
- MySQL 
- Postman 
### 1
```bash
cd "Carrito de compras"
npm install
```

BD 
2. Configurar credenciales en `Backend/config/dbconfig.js`:
```javascript
host: 'localhost',
user: 'root',
password: 'TU_PASSWORD',
database: 'carrito_db'
```
3. 
```bash
npm start
```

`http://localhost:3000`

---

## API REST - ENDPOINTS

### **PRODUCTOS**

#### GET `/api/productos`
Obtiene todos los productos
```json
Response:
{
  "success": true,
  "productos": [...]
}
```

#### GET `/api/productos/:id`
Obtiene un producto por ID
```json
Response:
{
  "success": true,
  "producto": {...}
}
```

#### POST `/api/productos`
Crea un nuevo producto
```json
Request:
{
  "nombre": "Producto X",
  "precio": 100.00,
  "descripcion": "Descripción",
  "imagen": "imagen.png",
  "stock": 50
}
```

#### PUT `/api/productos/:id`
Actualiza un producto
```json
Request:
{
  "nombre": "Nuevo nombre",
  "precio": 120.00,
  "stock": 60
}
```

#### DELETE `/api/productos/:id`
Elimina un producto

---

### **CARRITO**

#### GET `/api/carrito/:usuarioId`
Obtiene el carrito del usuario
```json
Response:
{
  "success": true,
  "carrito": [
    {
      "id": 1,
      "producto_id": 1,
      "nombre": "Mini Babybel Original",
      "precio": 45.00,
      "cantidad": 2
    }
  ]
}
```

#### GET `/api/carrito/:usuarioId/total`
Obtiene el total del carrito
```json
Response:
{
  "success": true,
  "total": 90.00
}
```

#### POST `/api/carrito/add`
Agrega producto al carrito
```json
Request:
{
  "usuarioId": 1,
  "productoId": 1,
  "cantidad": 2
}
```

#### PUT `/api/carrito/update`
Actualiza cantidad en carrito
```json
Request:
{
  "usuarioId": 1,
  "productoId": 1,
  "cantidad": 5
}
```

#### DELETE `/api/carrito/remove`
Elimina producto del carrito
```json
Request:
{
  "usuarioId": 1,
  "productoId": 1
}
```

#### DELETE `/api/carrito/clear`
Vacía el carrito completamente
```json
Request:
{
  "usuarioId": 1
}
```

---

### **VENTAS**

#### POST `/api/ventas/crear`
Crea una venta desde el carrito
```json
Request:
{
  "usuarioId": 1
}

Response:
{
  "success": true,
  "message": "Venta completada",
  "ventaId": 1,
  "total": 90.00
}
```

#### GET `/api/ventas`
Obtiene todas las ventas (admin)

#### GET `/api/ventas/usuario/:usuarioId`
Obtiene historial de ventas del usuario

#### GET `/api/ventas/:ventaId/detalle`
Obtiene detalle completo de una venta

---

### **USUARIOS**

#### POST `/login`
Inicia sesión
```
Content-Type: application/x-www-form-urlencoded

email=usuario@ejemplo.com
password=password123
```

#### POST `/register`
Registra nuevo usuario
```
Content-Type: application/x-www-form-urlencoded

correo=nuevo@ejemplo.com
password=password123
```

#### POST `/cambiar-contrasena`
Cambia la contraseña
```json
Request:
{
  "usuarioId": 1,
  "passwordActual": "old123",
  "passwordNueva": "new456"
}
```

#### POST `/cambiar-correo`
Cambia el correo electrónico
```json
Request:
{
  "usuarioId": 1,
  "correoNuevo": "nuevo@ejemplo.com",
  "password": "password123"
}
```

#### POST `/eliminar-cuenta`
Elimina la cuenta del usuario
```json
Request:
{
  "id": 1
}
```

---

## PRUEBAS CON POSTMAN




1. **Crear usuario**
   - Usar endpoint: POST `/register`
   - Email: test@ejemplo.com
   - Password: test123

2. **Iniciar sesión**
   - Usar endpoint: POST `/login`
   - Anotar el `usuarioId` de la respuesta

3. **Agregar productos al carrito**
   - Usar endpoint: POST `/api/carrito/add`
   - usuarioId: [ID del paso 2]
   - productoId: 1, cantidad: 2

4. **Ver carrito**
   - Usar endpoint: GET `/api/carrito/1`

5. **Crear venta**
   - Usar endpoint: POST `/api/ventas/crear`
   - usuarioId: [ID del paso 2]

6. **Ver historial de ventas**
   - Usar endpoint: GET `/api/ventas/usuario/1`

---

## DEBUGGING

### Logs del sistema
Todos los endpoints incluyen logs detallados:

```
[DEBUG] GET /api/carrito/1 - Obteniendo carrito del usuario
[DEBUG] Carrito obtenido: 3 items
[DEBUG] POST /api/ventas/crear - Creando venta para usuario: 1
[DEBUG] Total de la venta: 143.00
[DEBUG] Venta creada con ID: 1
[ERROR] Error al obtener carrito: [mensaje de error]
```

### Verificar logs en consola
Al ejecutar `npm start`, la consola mostrará:
- Conexiones a la BD
- Peticiones HTTP
- Errores y warnings
- Acciones del usuario

---





## Trabajo:

### Backend
- API REST completa
- CRUD de productos
- Sistema de carrito persistente
- Sistema de ventas con detalles
- Gestión de usuarios
- Logs de debugging
- Validaciones de datos
- Manejo de errores

### Frontend
- Interfaz responsive
- Integración con API
- Gestión de sesiones
- Carrito dinámico
- Sistema de compra
- Perfil de usuario editable
- Validaciones en tiempo real

### Base de Datos
- 5 tablas relacionadas
- Claves foráneas
- Índices únicos
- Cascada en eliminaciones
- Timestamps automáticos

---
*** El sistema ahora guarda el carrito en la base de datos en lugar de localStorage, las funciones antiguas se mantienen por compatibilidad pero están marcadas como DEPRECADAS (para avisar que no debe usarse más y que será quitada en futuras versiones).

### Sistema de Ventas
Al crear una venta:
1. Se crea el registro en la tabla `ventas`
2. Se guardan los detalles en `detalle_ventas`
3. Se actualiza el stock de productos
4. Se vacía el carrito del usuario


---


---

**Version**: 2.0.2  
**Ultima actualizacion**: 10/01/2026
**Estado**:  Joya 
