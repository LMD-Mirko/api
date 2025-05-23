const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mascotasController = require('../controllers/mascotasController');

// Validaciones
const validarMascota = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('edad').isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
    body('raza').notEmpty().withMessage('La raza es requerida'),
    body('tamaño').isIn(['Pequeño', 'Mediano', 'Grande']).withMessage('Tamaño inválido'),
    body('ubicacion').notEmpty().withMessage('La ubicación es requerida')
];

// Rutas
router.post('/', validarMascota, mascotasController.registrar);
router.get('/', mascotasController.obtenerTodas);
router.get('/:id', mascotasController.obtenerPorId);
router.put('/:id', validarMascota, mascotasController.actualizar);
router.delete('/:id', mascotasController.eliminar);

module.exports = router; 