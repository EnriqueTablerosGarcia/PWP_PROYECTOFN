import sql from "../models/productmodel.js";

// Obtener todos los productos
export const getAll = async (req, res) => {
    console.log('[DEBUG] GET /api/productos - Obteniendo todos los productos');
    
    try {
        sql.query("SELECT * FROM productos", (err, productos) => {
            if (err) {
                console.error('[ERROR] Error al obtener productos:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: "Error al obtener productos" 
                });
            }
            
            console.log(`[DEBUG] Productos encontrados: ${productos.length}`);
            res.json({ success: true, productos });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error al obtener productos" 
        });
    }
};

// Obtener un producto por ID
export const getById = async (req, res) => {
    const { id } = req.params;
    
    console.log(`[DEBUG] GET /api/productos/${id} - Obteniendo producto`);
    
    try {
        sql.query("SELECT * FROM productos WHERE id = ?", [id], (err, producto) => {
            if (err) {
                console.error('[ERROR] Error al obtener producto:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: "Error al obtener producto" 
                });
            }
            
            if (!producto || producto.length === 0) {
                console.log('[WARN] Producto no encontrado');
                return res.status(404).json({ 
                    success: false, 
                    error: "Producto no encontrado" 
                });
            }
            
            console.log(`[DEBUG] Producto encontrado: ${producto[0].nombre}`);
            res.json({ success: true, producto: producto[0] });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error al obtener producto" 
        });
    }
};

// Crear un nuevo producto
export const create = async (req, res) => {
    const { nombre, precio, descripcion, imagen, stock } = req.body;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('[MYSQL] GUARDANDO EN TABLA: productos');
    console.log(`${'='.repeat(60)}`);
    console.log('DATOS DEL PRODUCTO:');
    console.log(`   - nombre: ${nombre}, precio: $${precio}, descripcion: ${descripcion || 'NULL'}, imagen: ${imagen || 'NULL'}, stock: ${stock || 0}`);
    console.log(`${'='.repeat(60)}\n`);
    
    if (!nombre || !precio) {
        console.log('[ERROR] Faltan parámetros requeridos');
        return res.status(400).json({ 
            success: false, 
            error: "Nombre y precio son requeridos" 
        });
    }
    
    try {
        const query = "INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES (?, ?, ?, ?, ?)";
        const values = [nombre, precio, descripcion || null, imagen || null, stock || 0];
        
        sql.query(query, values, (err, result) => {
            if (err) {
                console.error('[ERROR] Error al insertar en MySQL:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    error: "Error al crear producto" 
                });
            }
            
            console.log('[MYSQL] PRODUCTO GUARDADO EXITOSAMENTE - ID:', result.insertId, '| Nombre:', nombre, '| Precio: $' + precio);
            console.log(`${'='.repeat(60)}\n`);
            
            res.status(201).json({ 
                success: true, 
                message: "Producto creado exitosamente",
                productoId: result.insertId
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error al crear producto" 
        });
    }
};

// Actualizar un producto
export const update = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, imagen, stock } = req.body;
    
    console.log(`[DEBUG] PUT /api/productos/${id} - Actualizando producto`);
    
    try {
        // Primero verificamos que el producto existe
        sql.query("SELECT * FROM productos WHERE id = ?", [id], (err, producto) => {
            if (err) {
                console.error('[ERROR] Error al verificar producto:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: "Error al actualizar producto" 
                });
            }
            
            if (!producto || producto.length === 0) {
                console.log('[WARN] Producto no encontrado');
                return res.status(404).json({ 
                    success: false, 
                    error: "Producto no encontrado" 
                });
            }
            
            // Construimos la query de actualización solo con los campos proporcionados
            const updates = [];
            const values = [];
            
            if (nombre !== undefined) {
                updates.push("nombre = ?");
                values.push(nombre);
            }
            if (precio !== undefined) {
                updates.push("precio = ?");
                values.push(precio);
            }
            if (descripcion !== undefined) {
                updates.push("descripcion = ?");
                values.push(descripcion);
            }
            if (imagen !== undefined) {
                updates.push("imagen = ?");
                values.push(imagen);
            }
            if (stock !== undefined) {
                updates.push("stock = ?");
                values.push(stock);
            }
            
            if (updates.length === 0) {
                console.log('[WARN] No hay campos para actualizar');
                return res.status(400).json({ 
                    success: false, 
                    error: "No hay campos para actualizar" 
                });
            }
            
            values.push(id);
            const query = `UPDATE productos SET ${updates.join(", ")} WHERE id = ?`;
            
            console.log(`\n${'='.repeat(60)}`);
            console.log('[MYSQL] ACTUALIZANDO TABLA: productos');
            console.log(`${'='.repeat(60)}`);
            const campos = updates.map((update, idx) => {
                const field = update.split(' = ')[0];
                return `${field}=${values[idx]}`;
            }).join(', ');
            console.log(`   ID: ${id} | Campos: ${campos}`);
            console.log(`${'='.repeat(60)}\n`);
            
            sql.query(query, values, (err, result) => {
                if (err) {
                    console.error('[ERROR] Error al actualizar en MySQL:', err.message);
                    return res.status(500).json({ 
                        success: false, 
                        error: "Error al actualizar producto" 
                    });
                }
                
                console.log('[MYSQL] PRODUCTO ACTUALIZADO EXITOSAMENTE - Filas afectadas:', result.affectedRows);
                console.log(`${'='.repeat(60)}\n`);
                
                res.json({ 
                    success: true, 
                    message: "Producto actualizado exitosamente" 
                });
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error al actualizar producto" 
        });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    console.log(`[DEBUG] DELETE /api/productos/${id} - Eliminando producto`);
    
    try {
        sql.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error('[ERROR] Error al eliminar producto:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: "Error al eliminar producto" 
                });
            }
            
            if (result.affectedRows === 0) {
                console.log('[WARN] Producto no encontrado');
                return res.status(404).json({ 
                    success: false, 
                    error: "Producto no encontrado" 
                });
            }
            
            console.log('[DEBUG] Producto eliminado exitosamente');
            res.json({ 
                success: true, 
                message: "Producto eliminado exitosamente" 
            });
        });
    } catch (error) {
        console.error('[ERROR] Error inesperado:', error);
        res.status(500).json({ 
            success: false, 
            error: "Error al eliminar producto" 
        });
    }
};
