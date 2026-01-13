import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
    console.log('\n' + '='.repeat(60));
    console.log('INICIALIZANDO BASE DE DATOS');
    console.log('='.repeat(60));

    let connection;
    
    try {
        // Conectar a MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Karl!2008',
            multipleStatements: true
        });

        console.log('✅ Conectado a MySQL');

        // Crear base de datos si no existe
        await connection.query('CREATE DATABASE IF NOT EXISTS carrito_db');
        console.log('✅ Base de datos "carrito_db" verificada');

        // Usar la base de datos
        await connection.query('USE carrito_db');
        console.log('✅ Usando base de datos "carrito_db"');

        // Crear tabla usuarios
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla "usuarios" creada/verificada');

        // Crear tabla productos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                descripcion TEXT,
                imagen VARCHAR(255),
                stock INT DEFAULT 0, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla "productos" creada/verificada');

        // Crear tabla carrito
        await connection.query(`
            CREATE TABLE IF NOT EXISTS carrito (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL,
                fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_product (usuario_id, producto_id)
            )
        `);
        console.log('✅ Tabla "carrito" creada/verificada');

        // Crear tabla ventas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "ventas" creada/verificada');

        // Crear tabla detalle_ventas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            )
        `);
        console.log('✅ Tabla "detalle_ventas" creada/verificada');

        // Verificar si existen productos
        const [productos] = await connection.query('SELECT COUNT(*) as count FROM productos');
        
        if (productos[0].count === 0) {
            // Insertar productos de ejemplo
            await connection.query(`
                INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES
                ('Mini Babybel Original', 45.00, 'Queso Mini Babybel Original con su característico envoltorio rojo', 'babybel-original.png', 50),
                ('Mini Babybel Gouda', 48.00, 'Queso Mini Babybel sabor Gouda con envoltorio amarillo', 'babybel-gouda.png', 50),
                ('Mini Babybel Mozzarella', 50.00, 'Queso Mini Babybel Mozzarella con envoltorio blanco', 'babybel-mozzarella.png', 50)
            `);
            console.log('✅ Productos de ejemplo insertados');
        } else {
            console.log(`✅ Ya existen ${productos[0].count} productos en la base de datos`);
        }

        // Mostrar todas las tablas
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n' + '='.repeat(60));
        console.log('TABLAS EN LA BASE DE DATOS:');
        console.log('='.repeat(60));
        tables.forEach(table => console.log('  -', Object.values(table)[0]));

        console.log('\n' + '='.repeat(60));
        console.log('✅ BASE DE DATOS INICIALIZADA CORRECTAMENTE');
        console.log('='.repeat(60));
        console.log('\nPuedes iniciar el servidor con: npm start\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Detalles:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDB();
