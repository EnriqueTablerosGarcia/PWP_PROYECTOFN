import { Router } from 'express';
import * as productController from '../controllers/productcontroller.js';
import config from '../config/dbconfig.js';

const router = Router();

// Rutas GET (vistas)
router.get('/', (req, res) => {
    res.render('principal');
});

router.get('/login', (req, res) => {
    res.render('login', { error: null, success: null });
});

router.get('/crearCuenta', (req, res) => {
    res.render('crearCuenta', { error: null });
});

// Ruta para ver productos sin autenticación
router.get('/productos', (req, res) => {
    config.query("SELECT * FROM productos", (err, productos) => {
        if (err) {
            console.error(err);
            return res.render('productos', { productos: [], isAuthenticated: false });
        }
        res.render('productos', { productos: productos, isAuthenticated: false });
    });
});

router.get('/carrito', (req, res) => {
    res.render('index');
});

router.get('/ticket', (req, res) => {
    res.render('ticket');
});

router.get('/usuario', (req, res) => {
    // La información del usuario se cargará desde localStorage en el cliente
    res.render('usuario', { user: undefined });
});

router.get('/cambContra', (req, res) => {
    res.render('cambContra');
});

router.get('/cambCorreo', (req, res) => {
    res.render('cambCorreo');
});

router.get('/principal', (req, res) => {
    res.render('principal');
});

router.get('/confirmacion', (req, res) => {
    res.render('confirmacion');
});

router.get('/metodospago', (req, res) => {
    res.render('metodospago');
});

router.get('/datosbanc', (req, res) => {
    res.render('datosbanc');
});

// Rutas POST
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Intento de login con:', email);

    if (!email || !password) {
        return res.render('login', { error: "Por favor ingresa email y contraseña", success: null });
    }

    config.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, rows) => {
            if (err) {
                console.error('Error en consulta:', err);
                return res.render('login', { error: "Error en el servidor", success: null });
            }

            console.log('Resultados encontrados:', rows.length);

            if (!rows || rows.length === 0) {
                console.log('Cuenta no existe para:', email);
                return res.render('login', { error: "Esta cuenta no existe. Por favor, regístrate primero.", success: null });
            }

            const usuario = rows[0];
            console.log('Usuario encontrado:', usuario.email);

            if (usuario.password !== password) {
                console.log('Contraseña incorrecta');
                return res.render('login', { error: "Contraseña incorrecta", success: null });
            }

            // Login exitoso
            console.log('Login exitoso para:', email);
            const usuarioData = { nombre: usuario.nombre, email: usuario.email, id: usuario.id };

            // Redirigir a la página principal después del login exitoso
            res.send(`
                <script>
                    const usuarioId = '${usuario.id}';
                    
                    // Guardar datos del usuario
                    localStorage.setItem('usuario', JSON.stringify({
                        nombre: '${usuario.nombre}',
                        email: '${usuario.email}',
                        id: usuarioId
                    }));
                    localStorage.setItem('usuarioNombre', '${usuario.nombre}');
                    localStorage.setItem('usuarioEmail', '${usuario.email}');
                    localStorage.setItem('usuarioId', usuarioId);
                    
                    // Recuperar el carrito guardado del usuario
                    const carritoGuardado = localStorage.getItem('carrito_usuario_' + usuarioId);
                    if (carritoGuardado) {
                        localStorage.setItem('carrito', carritoGuardado);
                    }
                    
                    window.location.href = '/principal';
                </script>
            `);
        }
    );
});

router.post('/register', (req, res) => {
    const { correo, password } = req.body;

    console.log('Intento de registro:', correo);

    if (!correo || !password) {
        return res.render('crearCuenta', { error: "Por favor completa todos los campos" });
    }

    // Usar el correo como nombre (sin el dominio)
    const nombre = correo.split('@')[0];

    console.log(`\n${'='.repeat(60)}`);
    console.log('[MYSQL] GUARDANDO EN TABLA: usuarios');
    console.log(`${'='.repeat(60)}`);
    console.log('DATOS DEL USUARIO:');
    console.log(`   - nombre: ${nombre}, email: ${correo}, password: ${'*'.repeat(password.length)} (encriptada), created_at: CURRENT_TIMESTAMP`);
    console.log(`${'='.repeat(60)}\n`);

    config.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, correo, password],
        (error, result) => {
            if (error) {
                console.log('[ERROR] Error al registrar en MySQL:', error.message);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.render('crearCuenta', { error: "Este correo ya está registrado" });
                }
                return res.render('crearCuenta', { error: "Error al crear la cuenta" });
            }
            console.log('[MYSQL] USUARIO GUARDADO EXITOSAMENTE - ID:', result.insertId, '| Email:', correo);
            console.log(`${'='.repeat(60)}\n`);
            res.render('login', { success: "Cuenta creada con éxito. Ahora puedes iniciar sesión.", error: null });
        }
    );
});

// API REST para productos (deben ir ANTES de las rutas POST de usuarios para evitar conflictos)
router.get('/api/productos', productController.getAll);
router.get('/api/productos/:id', productController.getById);
router.post('/api/productos', productController.create);
router.put('/api/productos/:id', productController.update);
router.delete('/api/productos/:id', productController.deleteProduct);

router.post('/eliminar-cuenta', (req, res) => {
    const { id } = req.body;

    console.log('Solicitud para eliminar cuenta, ID:', id);

    if (!id) {
        return res.json({ success: false, message: "ID de usuario no proporcionado" });
    }

    config.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        (error, result) => {
            if (error) {
                console.error('Error al eliminar cuenta:', error);
                return res.json({ success: false, message: "Error al eliminar la cuenta" });
            }

            if (result.affectedRows === 0) {
                return res.json({ success: false, message: "Usuario no encontrado" });
            }

            console.log('Cuenta eliminada exitosamente, ID:', id);
            res.json({ success: true, message: "Cuenta eliminada exitosamente" });
        }
    );
});

// Cambiar contraseña
router.post('/cambiar-contrasena', (req, res) => {
    const { usuarioId, passwordActual, passwordNueva } = req.body;

    console.log('[DEBUG] POST /cambiar-contrasena - Usuario:', usuarioId);

    if (!usuarioId || !passwordActual || !passwordNueva) {
        return res.json({ 
            success: false, 
            message: "Todos los campos son requeridos" 
        });
    }

    // Verificar contraseña actual
    config.query(
        "SELECT password FROM usuarios WHERE id = ?",
        [usuarioId],
        (error, results) => {
            if (error) {
                console.error('[ERROR] Error al verificar contraseña:', error);
                return res.json({ 
                    success: false, 
                    message: "Error al verificar contraseña" 
                });
            }

            if (results.length === 0) {
                return res.json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            if (results[0].password !== passwordActual) {
                return res.json({ 
                    success: false, 
                    message: "La contraseña actual es incorrecta" 
                });
            }

            // Actualizar contraseña
            console.log(`\n${'='.repeat(60)}`);
            console.log('[MYSQL] ACTUALIZANDO TABLA: usuarios (contraseña)');
            console.log(`${'='.repeat(60)}`);
            console.log(`   usuario_id: ${usuarioId}, nueva_password: ${'*'.repeat(passwordNueva.length)} caracteres`);
            console.log(`${'='.repeat(60)}\n`);
            
            config.query(
                "UPDATE usuarios SET password = ? WHERE id = ?",
                [passwordNueva, usuarioId],
                (error, result) => {
                    if (error) {
                        console.error('[ERROR] Error al actualizar contraseña en MySQL:', error.message);
                        return res.json({ 
                            success: false, 
                            message: "Error al actualizar contraseña" 
                        });
                    }

                    console.log('[MYSQL] CONTRASEÑA ACTUALIZADA EXITOSAMENTE - Usuario ID:', usuarioId, '| Filas afectadas:', result.affectedRows);
                    console.log(`${'='.repeat(60)}\n`);
                    
                    res.json({ 
                        success: true, 
                        message: "Contraseña actualizada exitosamente" 
                    });
                }
            );
        }
    );
});

// Cambiar correo
router.post('/cambiar-correo', (req, res) => {
    const { usuarioId, correoNuevo, password } = req.body;

    console.log('[DEBUG] POST /cambiar-correo - Usuario:', usuarioId);

    if (!usuarioId || !correoNuevo || !password) {
        return res.json({ 
            success: false, 
            message: "Todos los campos son requeridos" 
        });
    }

    // Verificar contraseña
    config.query(
        "SELECT password FROM usuarios WHERE id = ?",
        [usuarioId],
        (error, results) => {
            if (error) {
                console.error('[ERROR] Error al verificar usuario:', error);
                return res.json({ 
                    success: false, 
                    message: "Error al verificar usuario" 
                });
            }

            if (results.length === 0) {
                return res.json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            if (results[0].password !== password) {
                return res.json({ 
                    success: false, 
                    message: "La contraseña es incorrecta" 
                });
            }

            // Verificar que el nuevo correo no esté en uso
            config.query(
                "SELECT id FROM usuarios WHERE email = ? AND id != ?",
                [correoNuevo, usuarioId],
                (error, results) => {
                    if (error) {
                        console.error('[ERROR] Error al verificar correo:', error);
                        return res.json({ 
                            success: false, 
                            message: "Error al verificar correo" 
                        });
                    }

                    if (results.length > 0) {
                        return res.json({ 
                            success: false, 
                            message: "Este correo ya está en uso" 
                        });
                    }

                    // Actualizar correo
                    console.log(`\n${'='.repeat(60)}`);
                    console.log('[MYSQL] ACTUALIZANDO TABLA: usuarios (email)');
                    console.log(`${'='.repeat(60)}`);
                    console.log(`   usuario_id: ${usuarioId}, correo_nuevo: ${correoNuevo}`);
                    console.log(`${'='.repeat(60)}\n`);
                    
                    config.query(
                        "UPDATE usuarios SET email = ? WHERE id = ?",
                        [correoNuevo, usuarioId],
                        (error, result) => {
                            if (error) {
                                console.error('[ERROR] Error al actualizar correo en MySQL:', error.message);
                                return res.json({ 
                                    success: false, 
                                    message: "Error al actualizar correo" 
                                });
                            }

                            console.log('[MYSQL] CORREO ACTUALIZADO EXITOSAMENTE - Usuario ID:', usuarioId, '| Nuevo correo:', correoNuevo, '| Filas afectadas:', result.affectedRows);
                            console.log(`${'='.repeat(60)}\n`);
                            
                            res.json({ 
                                success: true, 
                                message: "Correo actualizado exitosamente",
                                nuevoCorreo: correoNuevo
                            });
                        }
                    );
                }
            );
        }
    );
});

export default router;