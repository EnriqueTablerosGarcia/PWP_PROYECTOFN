import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//aqui nosotros tenemos que agregar las rutas que se van a consumir
import productroutes from './routes/productroutes.js';


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

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'Frontend', 'views'));

// Archivos estáticos
app.use(express.static(path.join(projectRoot, 'Frontend')));

// Rutas
app.use('/', productroutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});