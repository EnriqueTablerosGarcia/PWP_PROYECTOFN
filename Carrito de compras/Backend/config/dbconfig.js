import mysql from 'mysql2';
import dotenv from 'dotenv';

//si vamos a tener una bd en servidor
//import {fileURLToPath} from 'url';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//dotenv.config({path: path.resolve(__dirname, '../.env')});
dotenv.config();

const config = mysql.createPool({
    
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'curso',

    //connectionLimit : 10,
    //acquireTimeout : 30000,
    //idleTimeout : 30000,
});

config.getConnection((err) => {
    if(err){
        console.log('Error de conexion a la base de datos', err);
        return;
    }   
    console.log('Conexion exitosa a la base de datos');
    connection.release();
});

export default config;