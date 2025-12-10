import express from 'express';
import config from '../config/dbconfig.js';
import * as ProductController from '../controllers/productcontroller.js';

const router = express.Router();

// =========================
// RUTAS GET (VISTAS)
// =========================
router.get('/', (req, res) => {
    res.render('login', { error: null, success: null });
});

router.get('/login', (req, res) => {
    res.render('login', { error: null, success: null });
});

router.get('/crearCuenta', (req, res) => {
    res.render('crearCuenta', { error: null });
});

router.get('/carrito', async (req, res) => {
    try {
        const [productos] = await config.query("SELECT * FROM productos");
        res.render('index', { productos: productos });
    } catch (error) {
        console.error(error);
        res.render('index', { productos: [] });
    }
});

// =========================
// API PRODUCTOS
// =========================
router.get('/api/productos', ProductController.getAllProducts);
router.get('/api/productos/:id', ProductController.getProductById);

// =========================
// RUTA POST LOGIN
// =========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await config.query(
            "SELECT * FROM usuarios WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length > 0) {
            const [productos] = await config.query("SELECT * FROM productos");
            return res.render('index', { user: rows[0], productos: productos });
        } else {
            return res.render('login', { error: "Datos incorrectos", success: null });
        }

    } catch (err) {
        console.error(err);
        return res.render('login', { error: "Error en el servidor", success: null });
    }
});

// =========================
// RUTA POST REGISTRO
// =========================
router.post('/register', async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        await config.query(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, correo, password]
        );

        return res.render('login', { success: "Cuenta creada con éxito", error: null });

    } catch (error) {
        console.log(error);
        return res.render('crearCuenta', { error: "El correo ya existe" });
    }
});

export default router;
