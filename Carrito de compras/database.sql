-- Crear base de datos
CREATE DATABASE IF NOT EXISTS carrito_db;
USE carrito_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    stock INT DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar los 3 quesos Mini Babybel
INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES
('Mini Babybel Original', 45.00, 'Queso Mini Babybel Original con su característico envoltorio rojo', 'babybel-original.png', 50),
('Mini Babybel Gouda', 48.00, 'Queso Mini Babybel sabor Gouda con envoltorio amarillo', 'babybel-gouda.png', 50),
('Mini Babybel Mozzarella', 50.00, 'Queso Mini Babybel Mozzarella con envoltorio blanco', 'babybel-mozzarella.png', 50);
