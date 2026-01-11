import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//aqui nosotros tenemos que agregar las rutas que se van a consumir
import productroutes from './routes/productroutes.js';
import carritoroutes from './routes/carritoroutes.js';
import ventasroutes from './routes/ventasroutes.js';
import { sanitizeAll } from './middleware/sanitize-middleware.js';


const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..'); // Subir un nivel desde Backend

console.log('__dirname:', __dirname);
console.log('projectRoot:', projectRoot);
console.log('Views path:', path.join(projectRoot, 'Frontend', 'views'));
console.log('Static path:', path.join(projectRoot, 'Frontend'));

// Middleware ANTES de las rutas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para detectar URLs malformadas
app.use((req, res, next) => {
    try {
        // Intentar decodificar la URL
        decodeURIComponent(req.url);
        next();
    } catch (error) {
        console.log('[SERVER] URL malformada detectada:', req.url);
        console.log('[SERVER] Error:', error.message);
        // Redirigir a la página principal
        return res.redirect('/principal');
    }
});

// Middleware de sanitización (protección contra inyección)
app.use(sanitizeAll);

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'Frontend', 'views'));

// Archivos estáticos
app.use(express.static(path.join(projectRoot, 'Frontend')));

// Rutas
app.use('/', productroutes);
app.use('/api/carrito', carritoroutes);
app.use('/api/ventas', ventasroutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    console.log('[SERVER] Ruta no encontrada:', req.url);
    
    // Enviar una página HTML con alerta y redirección a la página anterior
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Página no encontrada</title>
    </head>
    <body>
        <script>
            alert('La página "${req.url}" no existe.\\n\\nSerás redirigido a la página anterior.');
            
            // Intentar ir a la página anterior, si no hay anterior ir a principal
            if (document.referrer && document.referrer !== window.location.href) {
                window.location.href = document.referrer;
            } else if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/principal';
            }
        </script>
    </body>
    </html>
    `;
    
    res.status(404).send(htmlResponse);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('http://localhost:3000')
});