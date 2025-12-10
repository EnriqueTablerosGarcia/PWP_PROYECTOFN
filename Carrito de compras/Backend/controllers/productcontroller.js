import { Router } from 'express';
import { config } from '../config/dbconfig.js';

const router = Router();

// ===============================
// RUTAS GET PARA MOSTRAR VISTAS
// ===============================

// Mostrar login
router.get('/login', (req, res) => {
    res.render('login', { error: null, success: null });
});

// Mostrar crear cuenta
router.get('/crearCuenta', (req, res) => {
    res.render('crearCuenta', { error: null });
});

// Mostrar carrito
router.get('/carrito', (req, res) => {
    res.render('index');
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await config.query(
            "SELECT * FROM usuarios WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length > 0) {
            return res.render('index', { user: rows[0] });
        } else {
            return res.render('login', { error: "Datos incorrectos", success: null });
        }

    } catch (err) {
        console.error(err);
        return res.render('login', { error: "Error en el servidor", success: null });
    }
});

// ===============================
// REGISTRO
// ===============================
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        await config.query(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, password]
        );

        return res.render('login', {
            success: "Cuenta creada con éxito. Ahora inicia sesión.",
            error: null
        });

    } catch (error) {
        console.error(error);

        return res.render('crearCuenta', {
            error: "El correo ya está registrado"
        });
    }
});

export default router;
