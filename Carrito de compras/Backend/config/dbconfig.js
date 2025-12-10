import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export const config = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Karl!2008",
    database: "carrito_db",
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