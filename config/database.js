const mysql = require('mysql2/promise');
require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('./config.js');

// Validación de variables de entorno (acepta Railway y local)
const envMapping = {
    DB_HOST: process.env.MYSQLHOST || process.env.DB_HOST,
    DB_USER: process.env.MYSQLUSER || process.env.DB_USER,
    DB_PASSWORD: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    DB_NAME: process.env.MYSQLDATABASE || process.env.DB_NAME
};
for (const [envVar, value] of Object.entries(envMapping)) {
    if (!value) {
        throw new Error(`La variable de entorno ${envVar} (o su equivalente de Railway) es requerida`);
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adopcion_mascotas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Configuración de SSL para producción
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
    } : undefined
});

// Manejo de errores de conexión
pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('La conexión a la base de datos se perdió');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Demasiadas conexiones a la base de datos');
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('La conexión a la base de datos fue rechazada');
    }
});

// Función para verificar la conexión
const verificarConexion = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

// Verificar la conexión al iniciar
verificarConexion();

module.exports = pool;