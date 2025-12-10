import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

async function initDatabase() {
    try {
        // Conectar sin especificar base de datos
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Conectado a MySQL');

        // Crear base de datos
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Base de datos ${process.env.DB_NAME} creada o ya existe`);

        // Usar la base de datos
        await connection.query(`USE ${process.env.DB_NAME}`);

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
        console.log('Tabla usuarios creada');

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
        console.log('Tabla productos creada');

        // Verificar si ya existen productos
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM productos');
        
        if (rows[0].count === 0) {
            // Insertar los 3 quesos Mini Babybel
            await connection.query(`
                INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES
                ('Mini Babybel Original', 45.00, 'Queso Mini Babybel Original con su característico envoltorio rojo', 'babybel-original.png', 50),
                ('Mini Babybel Gouda', 48.00, 'Queso Mini Babybel sabor Gouda con envoltorio amarillo', 'babybel-gouda.png', 50),
                ('Mini Babybel Mozzarella', 50.00, 'Queso Mini Babybel Mozzarella con envoltorio blanco', 'babybel-mozzarella.png', 50)
            `);
            console.log('3 quesos Mini Babybel insertados correctamente');
        } else {
            console.log('Los productos ya existen en la base de datos');
        }

        await connection.end();
        console.log('Inicialización completada exitosamente');

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
}

initDatabase();
