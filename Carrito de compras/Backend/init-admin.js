import sql from './config/dbconfig.js';

console.log('\n========================================');
console.log('Inicializando Panel de Administración');
console.log('========================================\n');

// Función para agregar columna rol si no existe
function agregarColumnaRol() {
    return new Promise((resolve, reject) => {
        const query = `
            ALTER TABLE usuarios 
            ADD COLUMN rol ENUM('usuario', 'admin') DEFAULT 'usuario'
        `;
        
        sql.query(query, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('✓ La columna "rol" ya existe en la tabla usuarios');
                    resolve();
                } else {
                    console.error('✗ Error al agregar columna rol:', err.message);
                    reject(err);
                }
            } else {
                console.log('✓ Columna "rol" agregada a la tabla usuarios');
                resolve();
            }
        });
    });
}

// Función para crear usuario admin
function crearUsuarioAdmin() {
    return new Promise((resolve, reject) => {
        // Primero verificar si ya existe
        sql.query(
            'SELECT id, rol FROM usuarios WHERE email = ?',
            ['kirtableros@gmail.com'],
            (err, results) => {
                if (err) {
                    console.error('✗ Error al verificar usuario:', err.message);
                    return reject(err);
                }
                
                if (results && results.length > 0) {
                    // El usuario existe, solo actualizar el rol
                    sql.query(
                        'UPDATE usuarios SET rol = ?, password = ? WHERE email = ?',
                        ['admin', 'admin123', 'kirtableros@gmail.com'],
                        (err, result) => {
                            if (err) {
                                console.error('✗ Error al actualizar usuario admin:', err.message);
                                return reject(err);
                            }
                            console.log('✓ Usuario administrador actualizado');
                            console.log('   Email: kirtableros@gmail.com');
                            console.log('   Password: admin123');
                            resolve();
                        }
                    );
                } else {
                    // El usuario no existe, crear nuevo
                    const query = `
                        INSERT INTO usuarios (nombre, email, password, rol) 
                        VALUES ('Kir Tableros', 'kirtableros@gmail.com', 'admin123', 'admin')
                    `;
                    
                    sql.query(query, (err, result) => {
                        if (err) {
                            console.error('✗ Error al crear usuario admin:', err.message);
                            return reject(err);
                        }
                        console.log('✓ Usuario administrador creado exitosamente');
                        console.log('   Email: kirtableros@gmail.com');
                        console.log('   Password: admin123');
                        resolve();
                    });
                }
            }
        );
    });
}

// Función para verificar configuración
function verificarConfiguracion() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, nombre, email, rol FROM usuarios WHERE rol = "admin"';
        
        sql.query(query, (err, results) => {
            if (err) {
                console.error('✗ Error al verificar configuración:', err.message);
                reject(err);
            } else {
                console.log('\n✓ Administradores registrados:');
                results.forEach(admin => {
                    console.log(`   - ${admin.nombre} (${admin.email})`);
                });
                resolve();
            }
        });
    });
}

// Ejecutar inicialización
async function inicializar() {
    try {
        await agregarColumnaRol();
        await crearUsuarioAdmin();
        await verificarConfiguracion();
        
        console.log('\n========================================');
        console.log('✓ Inicialización completada');
        console.log('========================================');
        console.log('\nPuedes acceder al panel en:');
        console.log('http://localhost:3000/admin/login\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error durante la inicialización:', error);
        process.exit(1);
    }
}

// Ejecutar
inicializar();
