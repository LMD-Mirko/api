const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos (Railway)
const dbConfig = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    ssl: {
        rejectUnauthorized: true
    }
};

// Verificar variables de entorno
const requiredVars = ['MYSQLHOST', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Faltan variables de entorno:', missingVars.join(', '));
    process.exit(1);
}

async function fixMascotasTable() {
    console.log('Intentando conectar a la base de datos...');
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Conexión exitosa. Verificando tabla mascotas...');
        
        // Verificar si la tabla existe
        const [tables] = await connection.query("SHOW TABLES LIKE 'mascotas'");
        if (tables.length === 0) {
            console.log('La tabla mascotas no existe. Creándola...');
            await connection.query(`
                CREATE TABLE mascotas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    especie VARCHAR(50) NOT NULL,
                    edad INT NOT NULL,
                    raza VARCHAR(100) NOT NULL,
                    tamaño ENUM('Pequeño', 'Mediano', 'Grande') NOT NULL,
                    vacunado TINYINT(1) NOT NULL DEFAULT 0,
                    desparasitado TINYINT(1) NOT NULL DEFAULT 0,
                    personalidad TEXT,
                    ubicacion VARCHAR(100) NOT NULL,
                    imagen_url TEXT,
                    estado ENUM('Disponible', 'Adoptado') NOT NULL DEFAULT 'Disponible',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            console.log('Tabla mascotas creada exitosamente');
        } else {
            console.log('La tabla mascotas ya existe. Verificando estructura...');
            
            // Verificar si la columna especie existe
            const [columns] = await connection.query("SHOW COLUMNS FROM mascotas LIKE 'especie'");
            if (columns.length === 0) {
                console.log('La columna especie no existe. Agregándola...');
                await connection.query("ALTER TABLE mascotas ADD COLUMN especie VARCHAR(50) NOT NULL AFTER nombre");
                console.log('Columna especie agregada exitosamente');
            } else {
                console.log('La columna especie ya existe. Verificando si es NOT NULL...');
                const [columnInfo] = await connection.query("SHOW COLUMNS FROM mascotas WHERE Field = 'especie'");
                if (columnInfo[0].Null === 'YES') {
                    console.log('La columna especie permite NULL. Modificándola a NOT NULL...');
                    await connection.query("ALTER TABLE mascotas MODIFY COLUMN especie VARCHAR(50) NOT NULL");
                    console.log('Columna especie modificada a NOT NULL exitosamente');
                } else {
                    console.log('La columna especie ya está configurada correctamente (NOT NULL)');
                }
            }
        }
        
        console.log('Verificación y corrección completadas');
    } catch (error) {
        console.error('Error al verificar/corregir la tabla mascotas:', error);
        throw error;
    } finally {
        connection.end();
    }
}

// Ejecutar el script
fixMascotasTable()
    .then(() => {
        console.log('Script ejecutado exitosamente');
        process.exit(0);
    })
    .catch(error => {
        console.error('Error al ejecutar el script:', error);
        process.exit(1);
    }); 