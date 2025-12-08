import { Router } from 'express';
import { config } from '../config/dbconfig.js';

const router = Router();

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await config.query(
        "SELECT * FROM usuarios WHERE email = ? AND password = ?",
        [email, password]
    );

    if (rows.length > 0) {
        return res.render('dashboard', { user: rows[0] });
    } else {
        return res.render('login', { error: "Datos incorrectos" });
    }
});

// ---------- CREAR CUENTA ----------
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        await config.query(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, password]
        );

        return res.render('login', { success: "Cuenta creada, inicia sesión" });

    } catch (error) {
        console.log(error);
        return res.render('register', { error: "El correo ya está registrado" });
    }
});

export default router;
