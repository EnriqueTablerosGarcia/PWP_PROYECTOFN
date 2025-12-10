import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export const config = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// mensaje de prueba
try {
    const connection = await config.getConnection();
    console.log("Conexion exitosa a la base de datos");
    connection.release();
} catch (error) {
    console.log("Error de conexion a la base de datos", error);
}

export default config;