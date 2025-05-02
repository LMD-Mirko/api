const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adopcionesController = require('../controllers/adopcionesController');

// Validaciones
const validarAdopcion = [
    body('usuario_id').isInt().withMessage('El ID del usuario es requerido'),
    body('mascota_id').isInt().withMessage('El ID de la mascota es requerido'),
    body('estado').isIn(['Pendiente', 'Aprobada', 'Rechazada']).withMessage('Estado inválido')
];

// Rutas
router.post('/', validarAdopcion, adopcionesController.registrar);
router.get('/', adopcionesController.obtenerTodas);
router.get('/:id', adopcionesController.obtenerPorId);
router.put('/:id', validarAdopcion, adopcionesController.actualizar);
router.delete('/:id', adopcionesController.eliminar);

module.exports = router; 