import sql from '../config/dbconfig.js';

const VentasModel = {
    // Crear una nueva venta
    create: (usuarioId, total, callback) => {
        const query = `
            INSERT INTO ventas (usuario_id, total)
            VALUES (?, ?)
        `;
        sql.query(query, [usuarioId, total], callback);
    },

    // Agregar detalle de venta
    addDetalle: (ventaId, productoId, cantidad, precioUnitario, subtotal, callback) => {
        const query = `
            INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;
        sql.query(query, [ventaId, productoId, cantidad, precioUnitario, subtotal], callback);
    },

    // Obtener todas las ventas de un usuario
    getByUserId: (usuarioId, callback) => {
        const query = `
            SELECT * FROM ventas
            WHERE usuario_id = ?
            ORDER BY fecha DESC
        `;
        sql.query(query, [usuarioId], callback);
    },

    // Obtener detalle de una venta específica
    getDetalleByVentaId: (ventaId, callback) => {
        const query = `
            SELECT dv.*, p.nombre, p.descripcion, p.imagen
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            WHERE dv.venta_id = ?
        `;
        sql.query(query, [ventaId], callback);
    },

    // Obtener venta con sus detalles
    getFullVenta: (ventaId, callback) => {
        const query = `
            SELECT v.*, u.nombre as nombre_usuario, u.email
            FROM ventas v
            INNER JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.id = ?
        `;
        sql.query(query, [ventaId], callback);
    },

    // Obtener todas las ventas (para administración)
    getAll: (callback) => {
        const query = `
            SELECT v.*, u.nombre as nombre_usuario, u.email
            FROM ventas v
            INNER JOIN usuarios u ON v.usuario_id = u.id
            ORDER BY v.fecha DESC
        `;
        sql.query(query, [], callback);
    }
};

export default VentasModel;
