import express from 'express';
import path from 'path';
//aqui nosotros tenemos que agregar las rutas que se van a consumir
import productroutes from './routes/productroutes.js';


const app = express();
const PORT = process.env.PORT || 3000;  

const __dirname = path.resolve(); // Obtener el directorio actual

// Middleware ANTES de las rutas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Frontend/views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'Frontend')));

// Rutas
app.use('/', productroutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});