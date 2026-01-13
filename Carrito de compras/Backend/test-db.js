import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n' + '='.repeat(60));
console.log('DIAGNÓSTICO DE CONEXIÓN A BASE DE DATOS');
console.log('='.repeat(60));

console.log('\nVariables de entorno:');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_USER:', process.env.DB_USER || 'root');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME || 'carrito_db');

// Intentar conectar sin especificar base de datos
const connectionWithoutDB = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Karl!2008'
});

console.log('\n' + '='.repeat(60));
console.log('PASO 1: Conectando a MySQL sin base de datos...');
console.log('='.repeat(60));

connectionWithoutDB.connect((err) => {
    if (err) {
        console.error('\n❌ ERROR: No se pudo conectar a MySQL');
        console.error('Mensaje:', err.message);
        console.error('Código:', err.code);
        console.error('\nPosibles causas:');
        console.error('- MySQL no está ejecutándose');
        console.error('- Usuario o contraseña incorrectos');
        console.error('- Puerto 3306 bloqueado');
        process.exit(1);
    }
    
    console.log('✅ Conexión a MySQL exitosa');
    
    // Verificar si la base de datos existe
    console.log('\n' + '='.repeat(60));
    console.log('PASO 2: Verificando base de datos "carrito_db"...');
    console.log('='.repeat(60));
    
    connectionWithoutDB.query('SHOW DATABASES LIKE "carrito_db"', (err, results) => {
        if (err) {
            console.error('❌ Error al verificar base de datos:', err.message);
            connectionWithoutDB.end();
            process.exit(1);
        }
        
        if (results.length === 0) {
            console.log('❌ La base de datos "carrito_db" NO EXISTE');
            console.log('\nSOLUCIÓN: Ejecuta el archivo database.sql');
            console.log('Comando: mysql -u root -p < database.sql');
            connectionWithoutDB.end();
            process.exit(1);
        }
        
        console.log('✅ La base de datos "carrito_db" existe');
        
        // Conectar a la base de datos específica
        connectionWithoutDB.end();
        
        const connectionWithDB = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Karl!2008',
            database: process.env.DB_NAME || 'carrito_db'
        });
        
        console.log('\n' + '='.repeat(60));
        console.log('PASO 3: Conectando a la base de datos "carrito_db"...');
        console.log('='.repeat(60));
        
        connectionWithDB.connect((err) => {
            if (err) {
                console.error('❌ Error al conectar a carrito_db:', err.message);
                process.exit(1);
            }
            
            console.log('✅ Conexión a carrito_db exitosa');
            
            // Verificar tablas
            console.log('\n' + '='.repeat(60));
            console.log('PASO 4: Verificando tablas...');
            console.log('='.repeat(60));
            
            connectionWithDB.query('SHOW TABLES', (err, results) => {
                if (err) {
                    console.error('❌ Error al listar tablas:', err.message);
                    connectionWithDB.end();
                    process.exit(1);
                }
                
                const tableNames = results.map(r => Object.values(r)[0]);
                console.log('\nTablas encontradas:');
                tableNames.forEach(table => console.log('  -', table));
                
                const requiredTables = ['usuarios', 'productos', 'carrito', 'ventas', 'detalle_ventas'];
                const missingTables = requiredTables.filter(t => !tableNames.includes(t));
                
                if (missingTables.length > 0) {
                    console.log('\n❌ Faltan tablas:', missingTables.join(', '));
                    console.log('\nSOLUCIÓN: Ejecuta el archivo database.sql');
                    connectionWithDB.end();
                    process.exit(1);
                }
                
                console.log('\n✅ Todas las tablas requeridas existen');
                
                // Verificar datos de prueba
                console.log('\n' + '='.repeat(60));
                console.log('PASO 5: Verificando datos de productos...');
                console.log('='.repeat(60));
                
                connectionWithDB.query('SELECT id, nombre, stock FROM productos', (err, results) => {
                    if (err) {
                        console.error('❌ Error al consultar productos:', err.message);
                        connectionWithDB.end();
                        process.exit(1);
                    }
                    
                    console.log(`\nProductos encontrados: ${results.length}`);
                    results.forEach(p => {
                        console.log(`  - ID: ${p.id}, Nombre: ${p.nombre}, Stock: ${p.stock}`);
                    });
                    
                    console.log('\n' + '='.repeat(60));
                    console.log('✅ DIAGNÓSTICO COMPLETO - TODO ESTÁ CONFIGURADO CORRECTAMENTE');
                    console.log('='.repeat(60));
                    console.log('\nLa base de datos está lista para usar.');
                    console.log('Si aún tienes problemas, revisa los logs del servidor.\n');
                    
                    connectionWithDB.end();
                    process.exit(0);
                });
            });
        });
    });
});
