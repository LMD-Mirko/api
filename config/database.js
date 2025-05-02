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
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Configuraciones adicionales para producción
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Manejo de reconexión
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 10000
});

// Verificar la conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    });

module.exports = pool;