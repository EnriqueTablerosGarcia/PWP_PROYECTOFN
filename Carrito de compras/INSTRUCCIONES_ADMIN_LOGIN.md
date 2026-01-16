# 🔧 Instrucciones para que funcione el botón de Admin

## ✅ Estado Actual

El botón de **Panel de Administrador** ya está configurado y enlazado correctamente a `http://localhost:3000/admin/login`.

**El botón aparece SOLO para el usuario:** `kirtableros@gmail.com`

## ⚠️ Problema Actual

El servidor no puede conectarse a MySQL. Error:
```
Access denied for user 'root'@'localhost' (using password: YES)
```

## 🔨 Soluciones

### Opción 1: Verificar contraseña de MySQL

1. Abre el archivo: `Backend/config/dbconfig.js`
2. Verifica que la contraseña sea correcta (línea 17):
   ```javascript
   password: process.env.DB_PASSWORD || 'kenai123',
   ```
3. Si tu contraseña de MySQL es diferente, cámbiala

### Opción 2: Crear archivo .env

1. Crea un archivo `.env` en la carpeta `Backend/`
2. Agrega:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=TU_CONTRASEÑA_AQUI
   DB_NAME=carrito_db
   ```

### Opción 3: Inicializar la base de datos

1. Abre MySQL Workbench o tu gestor de MySQL
2. Ejecuta el archivo `database.sql` que está en la raíz del proyecto
3. Verifica que se creó la base de datos `carrito_db`
4. Verifica que existe el usuario `kirtableros@gmail.com` con rol `admin`

## 🚀 Una vez solucionado el error de BD

1. Reinicia el servidor:
   ```bash
   cd Backend
   node server.js
   ```

2. Accede a: `http://localhost:3000/`

3. Inicia sesión con: `kirtableros@gmail.com`

4. Ve a tu perfil (ícono de usuario arriba a la derecha)

5. **Verás el botón morado con corona: "👑 Panel de Administrador"**

6. Haz clic y te llevará al login de admin

7. Inicia sesión con las credenciales de admin:
   - Email: `kirtableros@gmail.com`
   - Password: `admin123`

## 📁 Archivos Modificados

- ✅ `Frontend/views/usuario.ejs` - Botón de admin agregado
- ✅ `Frontend/css/usuario.css` - Estilos del botón con animación
- ✅ `Frontend/js/usuario-page.js` - Redirección con email
- ✅ `Backend/routes/productroutes.js` - Consulta rol del usuario
- ✅ `Backend/routes/adminroutes.js` - Rutas de admin ya configuradas
- ✅ `Backend/server.js` - Ruta `/admin` ya registrada

## 🎨 Características del Botón

- Solo visible para `kirtableros@gmail.com`
- Gradiente morado vibrante
- Corona animada que rota
- Efecto de brillo al pasar el mouse
- Enlace directo a `/admin/login`
