require('dotenv').config();
const { app, PORT } = require('./config/app');
const pool = require('./config/database');

// Importar rutas
const mascotasRoutes = require('./routes/mascotasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');

// Usar rutas
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('Excepción no capturada:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada no manejada:', err);
    process.exit(1);
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre gracioso
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        pool.end(() => {
            console.log('Conexiones a la base de datos cerradas');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('Recibida señal SIGINT, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        pool.end(() => {
            console.log('Conexiones a la base de datos cerradas');
            process.exit(0);
        });
    });
});
});