# Carrito de Compras - Mini Babybel

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar MySQL
Asegúrate de tener MySQL instalado y corriendo. Si tienes XAMPP o WAMP, inicia el servidor MySQL.

### 3. Configurar archivo .env
Edita el archivo `.env` con tus credenciales de MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=       (déjalo vacío si no tienes contraseña en MySQL)
DB_NAME=carrito_db
```

**IMPORTANTE**: Si MySQL requiere contraseña, agrégala después de `DB_PASSWORD=`

### 4. Opción A - Inicializar con script automático
```bash
npm run init-db
```

### 4. Opción B - Inicializar manualmente con SQL
Si prefieres crear la base de datos manualmente:
1. Abre phpMyAdmin o MySQL Workbench
2. Ejecuta el archivo `database.sql`

### 5. Iniciar servidor
```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

## Productos incluidos
1. Mini Babybel Original - $45.00
2. Mini Babybel Gouda - $48.00
3. Mini Babybel Mozzarella - $50.00

## Rutas
- `/` o `/login` - Página de inicio de sesión
- `/crearCuenta` - Crear nueva cuenta
- `/carrito` - Ver carrito de compras (requiere login)
- `/api/productos` - API REST para obtener productos

## Solución de problemas

### Error de conexión MySQL
- Verifica que MySQL esté corriendo
- Verifica usuario y contraseña en el archivo .env
- Si usas XAMPP/WAMP, asegúrate de que Apache y MySQL estén iniciados
