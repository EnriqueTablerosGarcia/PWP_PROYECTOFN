
CREATE DATABASE IF NOT EXISTS carrito_db;
USE carrito_db;

-- Tabla de usuarios con rol de admin
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
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

-- Tabla de carrito
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (usuario_id, producto_id)
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar los 3 quesos Mini Babybel
INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES
('Mini Babybel Original', 45.00, 'Queso Mini Babybel Original con su característico envoltorio rojo', 'babybel-original.png', 50),
('Mini Babybel Gouda', 48.00, 'Queso Mini Babybel sabor Gouda con envoltorio amarillo', 'babybel-gouda.png', 50),
('Mini Babybel Mozzarella', 50.00, 'Queso Mini Babybel Mozzarella con envoltorio blanco', 'babybel-mozzarella.png', 50);

-- Crear usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Kir Tableros', 'kirtableros@gmail.com', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE rol = 'admin';

-- Verificar que las tablas se crearon correctamente
SHOW TABLES;

-- Mensaje de éxito
SELECT 'Base de datos creada exitosamente con todas las tablas!' AS STATUS;
