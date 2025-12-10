# Instrucciones para configurar MySQL

## Opción 1: Usar XAMPP (Recomendado para Windows)

1. **Descargar e instalar XAMPP** desde https://www.apachefriends.org/
2. **Abrir el Panel de Control de XAMPP**
3. **Iniciar los módulos**: 
   - Apache (servidor web)
   - MySQL (base de datos)
4. **Abrir phpMyAdmin**: http://localhost/phpmyadmin
5. **Crear la base de datos**:
   - Clic en "Nueva" en el panel izquierdo
   - Nombre: `carrito_db`
   - Collation: `utf8mb4_general_ci`
   - Clic en "Crear"
6. **Importar el archivo SQL**:
   - Selecciona la base de datos `carrito_db`
   - Ve a la pestaña "Importar"
   - Elige el archivo `database.sql`
   - Clic en "Continuar"

## Opción 2: Usar el script automático

1. **Asegúrate de que MySQL esté corriendo**
2. **Configura el archivo .env** con tus credenciales
3. **Ejecuta**: `npm run init-db`

## Verificar configuración

El archivo `.env` debe tener:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=carrito_db
```

**NOTA**: Si configuraste una contraseña para MySQL, agrégala después de `DB_PASSWORD=`

## Probar conexión

Una vez configurado, ejecuta:
```bash
npm start
```

Deberías ver el mensaje:
```
Conexion exitosa a la base de datos
Servidor corriendo en el puerto 3000
http://localhost:3000
```

## Datos iniciales

La base de datos incluirá automáticamente:

### Tabla: productos
| ID | Nombre | Precio | Descripción |
|----|--------|--------|-------------|
| 1 | Mini Babybel Original | $45.00 | Queso Mini Babybel Original con su característico envoltorio rojo |
| 2 | Mini Babybel Gouda | $48.00 | Queso Mini Babybel sabor Gouda con envoltorio amarillo |
| 3 | Mini Babybel Mozzarella | $50.00 | Queso Mini Babybel Mozzarella con envoltorio blanco |
