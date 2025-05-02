const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const adopcionesRoutes = require('./routes/adopcionesRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/adopciones', adopcionesRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}/api`);
});