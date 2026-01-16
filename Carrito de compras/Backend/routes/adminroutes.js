import { Router } from 'express';
import config from '../config/dbconfig.js';

const router = Router();

// GET - Login de admin
router.get('/login', (req, res) => {
    res.render('admin-login', { error: null });
});

// POST - Autenticación de admin
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('[ADMIN] Intento de login:', email);
    
    // Verificar en la base de datos
    config.query(
        "SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => {
            if (err) {
                console.error('[ADMIN] Error en consulta:', err);
                return res.render('admin-login', { error: 'Error en el servidor' });
            }
            
            if (!results || results.length === 0) {
                console.log('[ADMIN] Usuario no encontrado o contraseña incorrecta');
                return res.render('admin-login', { error: 'Credenciales incorrectas' });
            }
            
            const usuario = results[0];
            
            // Verificar que tenga rol de admin
            if (usuario.rol !== 'admin') {
                console.log('[ADMIN] Usuario sin permisos de admin:', email);
                return res.render('admin-login', { error: 'No tienes permisos de administrador' });
            }
            
            console.log('[ADMIN] Login exitoso:', usuario.nombre);
            
            res.send(`
                <script>
                    localStorage.setItem('admin', JSON.stringify({
                        id: ${usuario.id},
                        nombre: '${usuario.nombre}',
                        email: '${usuario.email}',
                        rol: '${usuario.rol}'
                    }));
                    window.location.href = '/admin/dashboard';
                </script>
            `);
        }
    );
});

// GET - Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Obtener estadísticas
        const statsPromises = [
            new Promise((resolve, reject) => {
                config.query('SELECT COUNT(*) as total FROM productos', (err, result) => {
                    if (err) reject(err);
                    else resolve(result[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                config.query('SELECT COUNT(*) as total FROM ventas', (err, result) => {
                    if (err) reject(err);
                    else resolve(result[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                config.query('SELECT COUNT(*) as total FROM usuarios', (err, result) => {
                    if (err) reject(err);
                    else resolve(result[0].total);
                });
            }),
            new Promise((resolve, reject) => {
                config.query('SELECT COALESCE(SUM(total), 0) as ingresos FROM ventas', (err, result) => {
                    if (err) reject(err);
                    else resolve(parseFloat(result[0].ingresos));
                });
            })
        ];
        
        const [totalProductos, totalVentas, totalUsuarios, ingresosTotales] = await Promise.all(statsPromises);
        
        res.render('admin-dashboard', {
            adminName: 'Administrador',
            stats: {
                totalProductos,
                totalVentas,
                totalUsuarios,
                ingresosTotales
            }
        });
    } catch (error) {
        console.error('[ADMIN] Error al cargar dashboard:', error);
        res.status(500).send('Error al cargar el dashboard');
    }
});

// GET - Productos
router.get('/productos', (req, res) => {
    res.render('admin-productos');
});

// GET - Ventas
router.get('/ventas', (req, res) => {
    res.render('admin-ventas');
});

// GET - Usuarios
router.get('/usuarios', (req, res) => {
    res.render('admin-usuarios');
});

// GET - Logout
router.get('/logout', (req, res) => {
    res.send(`
        <script>
            localStorage.removeItem('admin');
            window.location.href = '/admin/login';
        </script>
    `);
});

// API - Obtener todos los usuarios
router.get('/api/usuarios', (req, res) => {
    config.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC', (err, usuarios) => {
        if (err) {
            console.error('[ERROR] Error al obtener usuarios:', err);
            return res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
        }
        
        res.json({ success: true, usuarios });
    });
});

// API - Cambiar rol de usuario (otorgar/quitar admin)
router.post('/api/usuarios/:id/cambiar-rol', (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;
    
    console.log(`[ADMIN] Cambiar rol de usuario ${id} a: ${rol}`);
    
    // Validar rol
    if (!['admin', 'usuario'].includes(rol)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Rol inválido. Debe ser "admin" o "usuario"' 
        });
    }
    
    // Actualizar en la base de datos
    config.query(
        'UPDATE usuarios SET rol = ? WHERE id = ?',
        [rol, id],
        (err, result) => {
            if (err) {
                console.error('[ERROR] Error al actualizar rol:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error al actualizar el rol' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Usuario no encontrado' 
                });
            }
            
            console.log(`[ADMIN] Rol actualizado exitosamente - Usuario ${id} ahora es: ${rol}`);
            res.json({ 
                success: true, 
                message: `Usuario actualizado a ${rol}` 
            });
        }
    );
});

export default router;
