import config from '../config/dbconfig.js';

// Obtener todos los productos
export const getAllProducts = async () => {
    try {
        const [rows] = await config.query("SELECT * FROM productos");
        return rows;
    } catch (error) {
        throw error;
    }
};

// Obtener producto por ID
export const getProductById = async (id) => {
    try {
        const [rows] = await config.query("SELECT * FROM productos WHERE id = ?", [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Crear nuevo producto
export const createProduct = async (producto) => {
    try {
        const [result] = await config.query(
            "INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES (?, ?, ?, ?, ?)",
            [producto.nombre, producto.precio, producto.descripcion, producto.imagen, producto.stock]
        );
        return result;
    } catch (error) {
        throw error;
    }
};
