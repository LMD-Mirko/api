const pool = require('../config/database');

const solicitudesController = {
    // Crear nueva solicitud de adopción
    crear: async (req, res) => {
        try {
            const {
                mascota_id,
                usuario_id,
                nombre_adoptante,
                email,
                direccion,
                telefono,
                tipo_vivienda,
                fecha_tramite,
                otras_mascotas,
                motivo_adopcion
            } = req.body;

            // Validar que la mascota exista
            const [mascota] = await pool.query('SELECT id FROM mascotas WHERE id = ?', [mascota_id]);
            if (mascota.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La mascota no existe'
                });
            }

            // Validar que el usuario exista
            const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
            if (usuario.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario no existe'
                });
            }

            const [resultado] = await pool.query(
                `INSERT INTO solicitudes_adopcion 
                (mascota_id, usuario_id, nombre_adoptante, email, direccion, telefono, 
                 tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [mascota_id, usuario_id, nombre_adoptante, email, direccion, telefono,
                 tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion]
            );

            res.status(201).json({
                success: true,
                message: 'Solicitud de adopción creada exitosamente',
                data: { id: resultado.insertId }
            });
        } catch (error) {
            console.error('Error al crear solicitud de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear solicitud de adopción',
                error: error.message
            });
        }
    },

    // Obtener todas las solicitudes
    obtenerTodas: async (req, res) => {
        try {
            const [solicitudes] = await pool.query(`
                SELECT s.*, m.nombre as nombre_mascota, u.nombre as nombre_usuario
                FROM solicitudes_adopcion s
                JOIN mascotas m ON s.mascota_id = m.id
                JOIN usuarios u ON s.usuario_id = u.id
            `);
            
            res.json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitudes',
                error: error.message
            });
        }
    },

    // Obtener solicitud por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [solicitudes] = await pool.query(`
                SELECT s.*, m.nombre as nombre_mascota, u.nombre as nombre_usuario
                FROM solicitudes_adopcion s
                JOIN mascotas m ON s.mascota_id = m.id
                JOIN usuarios u ON s.usuario_id = u.id
                WHERE s.id = ?
            `, [id]);

            if (solicitudes.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }

            res.json({
                success: true,
                data: solicitudes[0]
            });
        } catch (error) {
            console.error('Error al obtener solicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitud',
                error: error.message
            });
        }
    },

    // Actualizar solicitud
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                mascota_id,
                usuario_id,
                nombre_adoptante,
                email,
                direccion,
                telefono,
                tipo_vivienda,
                fecha_tramite,
                otras_mascotas,
                motivo_adopcion
            } = req.body;

            // Validar que la mascota exista si se está actualizando
            if (mascota_id) {
                const [mascota] = await pool.query('SELECT id FROM mascotas WHERE id = ?', [mascota_id]);
                if (mascota.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'La mascota no existe'
                    });
                }
            }

            // Validar que el usuario exista si se está actualizando
            if (usuario_id) {
                const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
                if (usuario.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'El usuario no existe'
                    });
                }
            }

            const [resultado] = await pool.query(
                `UPDATE solicitudes_adopcion SET 
                mascota_id = ?, usuario_id = ?, nombre_adoptante = ?, email = ?, 
                direccion = ?, telefono = ?, tipo_vivienda = ?, fecha_tramite = ?, 
                otras_mascotas = ?, motivo_adopcion = ? 
                WHERE id = ?`,
                [mascota_id, usuario_id, nombre_adoptante, email, direccion, telefono,
                 tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion, id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Solicitud actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar solicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar solicitud',
                error: error.message
            });
        }
    },

    // Eliminar solicitud
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM solicitudes_adopcion WHERE id = ?', [id]);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Solicitud eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar solicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar solicitud',
                error: error.message
            });
        }
    }
};

module.exports = solicitudesController;