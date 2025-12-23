import sql from '../config/dbconfig.js';

const CarritoModel = {
    // Obtener carrito de un usuario
    getByUserId: (usuarioId, callback) => {
        const query = `
            SELECT c.id, c.usuario_id, c.producto_id, c.cantidad, c.fecha_agregado,
                   p.nombre, p.precio, p.descripcion, p.imagen, p.stock
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        `;
        sql.query(query, [usuarioId], callback);
    },

    // Agregar producto al carrito
    add: (usuarioId, productoId, cantidad, callback) => {
        const query = `
            INSERT INTO carrito (usuario_id, producto_id, cantidad)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + ?
        `;
        sql.query(query, [usuarioId, productoId, cantidad, cantidad], callback);
    },

    // Actualizar cantidad de un producto en el carrito
    update: (usuarioId, productoId, cantidad, callback) => {
        const query = `
            UPDATE carrito 
            SET cantidad = ?
            WHERE usuario_id = ? AND producto_id = ?
        `;
        sql.query(query, [cantidad, usuarioId, productoId], callback);
    },

    // Eliminar un producto del carrito
    remove: (usuarioId, productoId, callback) => {
        const query = `
            DELETE FROM carrito 
            WHERE usuario_id = ? AND producto_id = ?
        `;
        sql.query(query, [usuarioId, productoId], callback);
    },

    // Vaciar todo el carrito de un usuario
    clear: (usuarioId, callback) => {
        const query = `DELETE FROM carrito WHERE usuario_id = ?`;
        sql.query(query, [usuarioId], callback);
    },

    // Obtener total del carrito
    getTotal: (usuarioId, callback) => {
        const query = `
            SELECT SUM(c.cantidad * p.precio) as total
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        `;
        sql.query(query, [usuarioId], callback);
    }
};

export default CarritoModel;
