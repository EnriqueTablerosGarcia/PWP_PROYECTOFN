import express from 'express';
import path from 'path';
//aqui nosotros tenemos que agregar las rutas que se van a consumir
import productroutes from './routes/productroutes.js';


const app = express();
const PORT = process.env.PORT || 3000;  

const __dirname = path.resolve(); // Obtener el directorio actual

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,  '../Frontend', 'public')));

app.set('views engine', 'ejs');
app.set('public', path.join(__dirname, '../Frontend', 'public'));

//vamos a consumir las rutas
app.use('/', productroutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});