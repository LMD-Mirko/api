const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const usuariosController = require('../controllers/usuariosController');

// Validaciones
const validarRegistro = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validarLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Rutas
router.post('/registrar', validarRegistro, usuariosController.registrar);
router.post('/login', validarLogin, usuariosController.iniciarSesion);
router.get('/', usuariosController.obtenerTodos);
router.get('/:id', usuariosController.obtenerPorId);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

module.exports = router;