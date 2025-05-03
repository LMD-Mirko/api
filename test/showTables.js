const pool = require('../config/database');

async function showTableStructure() {
    try {
        const connection = await pool.getConnection();
        console.log('=== Conectado a la base de datos ===');

        // Mostrar todas las tablas
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\nTablas en la base de datos:');
        console.log(tables);

        // Mostrar estructura de la tabla mascotas
        const [columns] = await connection.query('DESCRIBE mascotas');
        console.log('\nEstructura de la tabla mascotas:');
        console.log(columns);

        connection.release();
    } catch (error) {
        console.error('Error:', error);
    }
}

showTableStructure(); 