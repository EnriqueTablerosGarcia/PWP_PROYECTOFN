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
    config.query("SELECT * FROM productos", (err, productos) => {
        if (err) {
            console.error(err);
            return res.render('index', { productos: [] });
        }
        res.render('index', { productos: productos });
    });
});

router.get('/ticket', (req, res) => {
    res.render('ticket');
});

router.get('/usuario', (req, res) => {
    // Por ahora mostrar datos por defecto, se necesitaría implementar sesiones
    res.render('usuario', { user: { nombre: 'Usuario', email: 'usuario@gmail.com' } });
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
                    localStorage.setItem('usuarioNombre', '${usuario.nombre}');
                    localStorage.setItem('usuarioEmail', '${usuario.email}');
                    localStorage.setItem('usuarioId', '${usuario.id}');
                    window.location.href = '/principal';
                </script>
            `);
        }
    );
});

router.post('/register', (req, res) => {
    const { nombre, correo, password } = req.body;

    console.log('Intento de registro:', nombre, correo);

    if (!nombre || !correo || !password) {
        return res.render('crearCuenta', { error: "Por favor completa todos los campos" });
    }

    config.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, correo, password],
        (error) => {
            if (error) {
                console.log('Error al registrar:', error);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.render('crearCuenta', { error: "Este correo ya está registrado" });
                }
                return res.render('crearCuenta', { error: "Error al crear la cuenta" });
            }
            console.log('Usuario registrado exitosamente:', correo);
            res.render('login', { success: "Cuenta creada con éxito. Ahora puedes iniciar sesión.", error: null });
        }
    );
});

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

router.post('/products', productController.create);

export default router;