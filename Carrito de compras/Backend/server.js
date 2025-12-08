import express from 'express';
import path from 'path';
import productroutes from './routes/productroutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Frontend/views'));

// Rutas
app.use('/', productroutes);

// Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
