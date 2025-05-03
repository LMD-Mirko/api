const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Configuración de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsear JSON con logging
app.use(express.json({ 
    limit: '10kb',
    verify: (req, res, buf) => {
        try {
            const rawBody = buf.toString();
            console.log('=== DEBUG: Raw request body ===');
            console.log(rawBody);
            JSON.parse(rawBody);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            res.status(400).json({
                success: false,
                message: "JSON inválido en la petición",
                error: e.message
            });
            throw e;
        }
    }
}));

// Middleware para manejar errores de JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Error de sintaxis JSON:', err);
        return res.status(400).json({
            success: false,
            message: "JSON inválido en la petición",
            error: err.message
        });
    }
    next();
});

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log('=== DEBUG: Request details ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Limitar el tamaño del body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compresión de respuestas
app.use(compression());

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por IP
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde'
    }
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});

// Configuración de puerto
const PORT = process.env.PORT || 3001;

module.exports = { app, PORT }; 