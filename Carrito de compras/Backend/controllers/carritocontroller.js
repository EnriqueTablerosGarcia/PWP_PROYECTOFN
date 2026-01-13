import CarritoModel from '../models/carritomodel.js';

// Obtener carrito del usuario
export const getCarrito = async (req, res) => {
    const { usuarioId } = req.params;
    
    console.log(`[DEBUG] GET /api/carrito/${usuarioId} - Obteniendo carrito del usuario`);
    
    try {
        CarritoModel.getByUserId(usuarioId, (err, items) => {
            if (err) {
                console.error('[ERROR] Error al obtener carrito:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener el carrito' 
                });
            }
            
            console.log(`[DEBUG] Carrito obtenido: ${items.length} items`);
            res.json({ success: true, carrito: items });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener el carrito' 
        });
    }
};

// Agregar producto al carrito
export const addToCarrito = async (req, res) => {
    const { usuarioId, productoId, cantidad } = req.body;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('[MYSQL] GUARDANDO EN TABLA: carrito');
    console.log(`${'='.repeat(60)}`);
    console.log('DATOS A INSERTAR:');
    console.log(`   - usuario_id: ${usuarioId}, producto_id: ${productoId}, cantidad: ${cantidad}, fecha_agregado: CURRENT_TIMESTAMP`);
    console.log(`${'='.repeat(60)}\n`);
    
    if (!usuarioId || !productoId || !cantidad) {
        console.log('[ERROR] Faltan parámetros requeridos');
        return res.status(400).json({ 
            success: false, 
            error: 'Faltan parámetros requeridos' 
        });
    }
    
    try {
        CarritoModel.add(usuarioId, productoId, cantidad, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al insertar en MySQL:', err.message);
                console.error('[ERROR] Detalles completos del error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: `Error al agregar al carrito: ${err.message}` 
                });
            }
            
            console.log('[MYSQL] DATOS GUARDADOS EXITOSAMENTE - Registro ID:', result.insertId || 'Actualizado', '| Filas afectadas:', result.affectedRows);
            console.log(`${'='.repeat(60)}\n`);
            
            res.json({ 
                success: true, 
                message: 'Producto agregado al carrito',
                result 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: `Error al agregar al carrito: ${error.message}` 
        });
    }
};

// Actualizar cantidad de producto en carrito
export const updateCarrito = async (req, res) => {
    const { usuarioId, productoId, cantidad } = req.body;
    
    console.log(`[DEBUG] PUT /api/carrito/update - Usuario: ${usuarioId}, Producto: ${productoId}, Nueva cantidad: ${cantidad}`);
    
    if (!usuarioId || !productoId || cantidad === undefined) {
        console.log('[WARN] Faltan parámetros requeridos');
        return res.status(400).json({ 
            success: false, 
            error: 'Faltan parámetros requeridos' 
        });
    }
    
    try {
        CarritoModel.update(usuarioId, productoId, cantidad, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al actualizar carrito:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al actualizar el carrito' 
                });
            }
            
            console.log('[DEBUG] Cantidad actualizada exitosamente');
            res.json({ 
                success: true, 
                message: 'Carrito actualizado',
                result 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al actualizar el carrito' 
        });
    }
};

// Eliminar producto del carrito
export const removeFromCarrito = async (req, res) => {
    const { usuarioId, productoId } = req.body;
    
    console.log(`[DEBUG] DELETE /api/carrito/remove - Usuario: ${usuarioId}, Producto: ${productoId}`);
    
    if (!usuarioId || !productoId) {
        console.log('[WARN] Faltan parámetros requeridos');
        return res.status(400).json({ 
            success: false, 
            error: 'Faltan parámetros requeridos' 
        });
    }
    
    try {
        CarritoModel.remove(usuarioId, productoId, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al eliminar del carrito:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al eliminar del carrito' 
                });
            }
            
            console.log('[DEBUG] Producto eliminado del carrito');
            res.json({ 
                success: true, 
                message: 'Producto eliminado del carrito',
                result 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al eliminar del carrito' 
        });
    }
};

// Vaciar carrito
export const clearCarrito = async (req, res) => {
    const { usuarioId } = req.body;
    
    console.log(`[DEBUG] DELETE /api/carrito/clear - Usuario: ${usuarioId}`);
    
    if (!usuarioId) {
        console.log('[WARN] Falta ID de usuario');
        return res.status(400).json({ 
            success: false, 
            error: 'Falta ID de usuario' 
        });
    }
    
    try {
        CarritoModel.clear(usuarioId, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al vaciar carrito:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al vaciar el carrito' 
                });
            }
            
            console.log('[DEBUG] Carrito vaciado exitosamente');
            res.json({ 
                success: true, 
                message: 'Carrito vaciado',
                result 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al vaciar el carrito' 
        });
    }
};

// Obtener total del carrito
export const getTotal = async (req, res) => {
    const { usuarioId } = req.params;
    
    console.log(`[DEBUG] GET /api/carrito/${usuarioId}/total - Calculando total`);
    
    try {
        CarritoModel.getTotal(usuarioId, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al calcular total:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al calcular el total' 
                });
            }
            
            const total = result[0]?.total || 0;
            console.log(`[DEBUG] Total calculado: ${total}`);
            res.json({ 
                success: true, 
                total: parseFloat(total) 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al calcular el total' 
        });
    }
};
