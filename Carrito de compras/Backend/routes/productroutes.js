import express from 'express';
import config from '../config/dbconfig.js';

const router = express.Router();

// =========================
// RUTAS GET (VISTAS)
// =========================
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/crearCuenta', (req, res) => {
    res.render('crearCuenta');
});

router.get('/carrito', (req, res) => {
    res.render('index');
});

// =========================
// RUTA POST LOGIN
// =========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await config.query(
            "SELECT * FROM usuarios WHERE correo = ? AND password = ?",
            [email, password]
        );

        if (rows.length > 0) {
            return res.render('index', { user: rows[0] });
        } else {
            return res.render('login', { error: "Datos incorrectos" });
        }

    } catch (err) {
        console.error(err);
        return res.send("Error interno");
    }
});

// =========================
// RUTA POST REGISTRO
// =========================
router.post('/register', async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        await config.query(
            "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)",
            [nombre, correo, password]
        );

        return res.render('login', { success: "Cuenta creada" });

    } catch (error) {
        console.log(error);
        return res.render('crearCuenta', { error: "El correo ya existe" });
    }
});

export default router;
