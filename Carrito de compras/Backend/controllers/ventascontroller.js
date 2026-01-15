import VentasModel from '../models/ventasmodel.js';
import CarritoModel from '../models/carritomodel.js';
import sql from '../config/dbconfig.js';

// Crear venta desde el carrito
export const crearVenta = async (req, res) => {
    const { usuarioId } = req.body;
    
    console.log(`[DEBUG] POST /api/ventas/crear - Creando venta para usuario: ${usuarioId}`);
    
    if (!usuarioId) {
        console.log('[WARN] Falta ID de usuario');
        return res.status(400).json({ 
            success: false, 
            error: 'Falta ID de usuario' 
        });
    }
    
    try {
        // Primero obtenemos el carrito del usuario
        CarritoModel.getByUserId(usuarioId, (err, items) => {
            if (err) {
                console.error('[ERROR] Error al obtener carrito:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener el carrito' 
                });
            }
            
            if (!items || items.length === 0) {
                console.log('[WARN] Carrito vacío');
                return res.status(400).json({ 
                    success: false, 
                    error: 'El carrito está vacío' 
                });
            }
            
            // Calculamos el total
            const total = items.reduce((sum, item) => {
                return sum + (item.precio * item.cantidad);
            }, 0);
            
            console.log(`[DEBUG] Total de la venta: ${total}`);
            
            // Creamos la venta
            console.log(`\n${'='.repeat(60)}`);
            console.log('[MYSQL] GUARDANDO EN TABLA: ventas');
            console.log(`${'='.repeat(60)}`);
            console.log('DATOS DE LA VENTA:');
            console.log(`   - usuario_id: ${usuarioId}, total: $${total.toFixed(2)}, fecha: CURRENT_TIMESTAMP`);
            console.log(`${'='.repeat(60)}\n`);
            
            VentasModel.create(usuarioId, total, (err, result) => {
                if (err) {
                    console.error('[ERROR] Error al crear venta en MySQL:', err.message);
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Error al crear la venta' 
                    });
                }
                
                const ventaId = result.insertId;
                console.log('[MYSQL] VENTA GUARDADA EXITOSAMENTE - ID:', ventaId, '| Total: $' + total.toFixed(2));
                console.log(`${'='.repeat(60)}\n`);
                
                console.log(`[MYSQL] GUARDANDO EN TABLA: detalle_ventas (${items.length} items)`);
                console.log(`${'='.repeat(60)}`);
                
                // Insertamos los detalles de la venta
                let detallesInsertados = 0;
                let errorOcurrido = false;
                
                items.forEach((item, index) => {
                    const precio = parseFloat(item.precio);
                    const subtotal = precio * item.cantidad;
                    
                    console.log(`   Detalle #${index + 1}: venta_id=${ventaId}, producto_id=${item.producto_id}, nombre="${item.nombre}", cantidad=${item.cantidad}, precio=$${precio.toFixed(2)}, subtotal=$${subtotal.toFixed(2)}`);
                    
                    VentasModel.addDetalle(
                        ventaId,
                        item.producto_id,
                        item.cantidad,
                        precio,
                        subtotal,
                        (err) => {
                            if (err && !errorOcurrido) {
                                errorOcurrido = true;
                                console.error('[ERROR] Error al insertar detalle en MySQL:', err.message);
                                return res.status(500).json({ 
                                    success: false, 
                                    error: 'Error al guardar detalles de la venta' 
                                });
                            }
                            
                            if (!errorOcurrido) {
                                console.log(`      [MYSQL] Detalle guardado`);
                            }
                            
                            detallesInsertados++;
                            
                            // Cuando todos los detalles están insertados
                            if (detallesInsertados === items.length && !errorOcurrido) {
                                console.log(`\n[MYSQL] TODOS LOS DETALLES GUARDADOS (${items.length} items)`);
                                console.log(`${'='.repeat(60)}\n`);
                                
                                console.log('[MYSQL] ACTUALIZANDO TABLA: productos (stock)');
                                console.log(`${'='.repeat(60)}`);
                                
                                // Actualizamos el stock de los productos
                                items.forEach(item => {
                                    console.log(`   Producto ID ${item.producto_id}: stock - ${item.cantidad}`);
                                    const updateStockQuery = `
                                        UPDATE productos 
                                        SET stock = stock - ? 
                                        WHERE id = ?
                                    `;
                                    sql.query(updateStockQuery, [item.cantidad, item.producto_id], (err) => {
                                        if (err) {
                                            console.error(`[ERROR] Error al actualizar stock del producto ${item.producto_id}:`, err.message);
                                        } else {
                                            console.log(`   [MYSQL] Stock actualizado para producto ${item.producto_id}`);
                                        }
                                    });
                                });
                                
                                console.log(`${'='.repeat(60)}\n`);
                                console.log('[MYSQL] VACIANDO TABLA: carrito (usuario: ' + usuarioId + ')');
                                console.log(`${'='.repeat(60)}`);
                                
                                // Vaciamos el carrito
                                CarritoModel.clear(usuarioId, (err) => {
                                    if (err) {
                                        console.error('[ERROR] Error al vaciar carrito:', err.message);
                                    } else {
                                        console.log('[MYSQL] Carrito vaciado exitosamente');
                                    }
                                    
                                    console.log(`\n${'='.repeat(60)}`);
                                    console.log('[MYSQL] VENTA COMPLETADA Y GUARDADA - ID:', ventaId, '| Total: $' + total.toFixed(2), '| Items:', items.length, '| Usuario:', usuarioId);
                                    console.log(`${'='.repeat(60)}\n`);
                                    
                                    res.json({ 
                                        success: true, 
                                        message: 'Venta completada',
                                        ventaId: ventaId,
                                        total: total
                                    });
                                });
                            }
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al procesar la venta' 
        });
    }
};

// Obtener ventas de un usuario
export const getVentasByUser = async (req, res) => {
    const { usuarioId } = req.params;
    
    console.log(`[DEBUG] GET /api/ventas/usuario/${usuarioId} - Obteniendo ventas`);
    
    try {
        VentasModel.getByUserId(usuarioId, (err, ventas) => {
            if (err) {
                console.error('[ERROR] Error al obtener ventas:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener las ventas' 
                });
            }
            
            console.log(`[DEBUG] Ventas encontradas: ${ventas.length}`);
            res.json({ success: true, ventas });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener las ventas' 
        });
    }
};

// Obtener detalle de una venta
export const getDetalleVenta = async (req, res) => {
    const { ventaId } = req.params;
    
    console.log(`[DEBUG] GET /api/ventas/${ventaId}/detalle - Obteniendo detalle`);
    
    try {
        // Primero obtenemos la información de la venta
        VentasModel.getFullVenta(ventaId, (err, venta) => {
            if (err) {
                console.error('[ERROR] Error al obtener venta:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener la venta' 
                });
            }
            
            if (!venta || venta.length === 0) {
                console.log('[WARN] Venta no encontrada');
                return res.status(404).json({ 
                    success: false, 
                    error: 'Venta no encontrada' 
                });
            }
            
            // Luego obtenemos los detalles
            VentasModel.getDetalleByVentaId(ventaId, (err, detalles) => {
                if (err) {
                    console.error('[ERROR] Error al obtener detalles:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Error al obtener los detalles' 
                    });
                }
                
                console.log(`[DEBUG] Detalles obtenidos: ${detalles.length} items`);
                res.json({ 
                    success: true, 
                    venta: venta[0],
                    detalles 
                });
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener la venta' 
        });
    }
};

// Obtener todas las ventas (admin)
export const getAllVentas = async (req, res) => {
    console.log('[DEBUG] GET /api/ventas - Obteniendo todas las ventas');
    
    try {
        VentasModel.getAll((err, ventas) => {
            if (err) {
                console.error('[ERROR] Error al obtener ventas:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al obtener las ventas' 
                });
            }
            
            console.log(`[DEBUG] Total de ventas: ${ventas.length}`);
            res.json({ success: true, ventas });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener las ventas' 
        });
    }
};
