const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const solicitudesController = require('../controllers/solicitudesController');

// Validaciones
const validarSolicitud = [
    body('mascota_id').isInt().withMessage('ID de mascota inválido'),
    body('usuario_id').isInt().withMessage('ID de usuario inválido'),
    body('nombre_adoptante').notEmpty().withMessage('El nombre del adoptante es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('direccion').notEmpty().withMessage('La dirección es requerida'),
    body('telefono').notEmpty().withMessage('El teléfono es requerido'),
    body('tipo_vivienda').notEmpty().withMessage('El tipo de vivienda es requerido'),
    body('fecha_tramite').isDate().withMessage('Fecha de trámite inválida'),
    body('motivo_adopcion').notEmpty().withMessage('El motivo de adopción es requerido')
];

// Rutas
router.post('/', validarSolicitud, solicitudesController.crear);
router.get('/', solicitudesController.obtenerTodas);
router.get('/:id', solicitudesController.obtenerPorId);
router.put('/:id', validarSolicitud, solicitudesController.actualizar);
router.delete('/:id', solicitudesController.eliminar);

module.exports = router;