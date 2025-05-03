const pool = require('../config/database');

const solicitudesController = {
    // Crear solicitud de adopción
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

            // Verificar si la mascota existe y está disponible
            const [mascota] = await pool.query(
                'SELECT estado FROM mascotas WHERE id = ?',
                [mascota_id]
            );

            if (mascota.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            if (mascota[0].estado !== 'Disponible') {
                return res.status(400).json({
                    success: false,
                    message: 'La mascota no está disponible para adopción'
                });
            }

            const [resultado] = await pool.query(
                `INSERT INTO solicitudes_adopcion 
                (mascota_id, usuario_id, nombre_adoptante, email, direccion, 
                telefono, tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [mascota_id, usuario_id, nombre_adoptante, email, direccion,
                 telefono, tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion]
            );

            res.status(201).json({
                success: true,
                message: 'Solicitud de adopción creada exitosamente',
                data: { id: resultado.insertId }
            });
        } catch (error) {
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
                SELECT 
                    s.*, 
                    m.nombre AS nombre_mascota, 
                    m.especie AS especie_mascota, -- Incluir la columna especie
                    u.nombre AS nombre_usuario
                FROM solicitudes_adopcion s
                JOIN mascotas m ON s.mascota_id = m.id
                JOIN usuarios u ON s.usuario_id = u.id
            `);
            res.json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
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
                SELECT 
                    s.*, 
                    m.nombre AS nombre_mascota, 
                    m.especie AS especie_mascota, -- Incluir la columna especie
                    u.nombre AS nombre_usuario
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
                nombre_adoptante,
                email,
                direccion,
                telefono,
                tipo_vivienda,
                fecha_tramite,
                otras_mascotas,
                motivo_adopcion
            } = req.body;

            const [resultado] = await pool.query(
                `UPDATE solicitudes_adopcion SET 
                nombre_adoptante = ?, email = ?, direccion = ?, telefono = ?, 
                tipo_vivienda = ?, fecha_tramite = ?, otras_mascotas = ?, 
                motivo_adopcion = ? 
                WHERE id = ?`,
                [nombre_adoptante, email, direccion, telefono, tipo_vivienda,
                 fecha_tramite, otras_mascotas, motivo_adopcion, id]
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
            const [resultado] = await pool.query(
                'DELETE FROM solicitudes_adopcion WHERE id = ?',
                [id]
            );

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
            res.status(500).json({
                success: false,
                message: 'Error al eliminar solicitud',
                error: error.message
            });
        }
    }
};

module.exports = solicitudesController;