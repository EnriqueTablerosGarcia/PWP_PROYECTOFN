import mysql from 'mysql2';
import dotenv from 'dotenv';

//si vamos a tener una bd en servidor
//import {fileURLToPath} from 'url';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//dotenv.config({path: path.resolve(__dirname, '../.env')});
dotenv.config();

const config = mysql.createPool({

    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sebas1108.',
    database: process.env.DB_NAME || 'carrito_db',

    //connectionLimit : 10,
    //acquireTimeout : 30000,
    //idleTimeout : 30000,
});

config.getConnection((err, connection) => {
    if (err) {
        console.log('Error de conexion a la base de datos', err);
        return;
    }
    console.log('Conexion exitosa a la base de datos');
    connection.release();
});

export default config;