const pool = require('../config/database');

const adopcionesController = {
    // Registrar una nueva solicitud de adopción
    async registrar(req, res) {
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
            
            // Verificar si el usuario existe
            const [usuario] = await pool.query(
                'SELECT id FROM usuarios WHERE id = ?',
                [usuario_id]
            );
            
            if (usuario.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            
            // Verificar si la mascota existe y su estado
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
            
            if (mascota[0].estado === 'Adoptado') {
                return res.status(400).json({
                    success: false,
                    message: 'La mascota ya está adoptada'
                });
            }
            
            // Verificar si ya existe una solicitud pendiente para esta mascota
            const [solicitudExistente] = await pool.query(
                'SELECT id FROM solicitudes_adopcion WHERE mascota_id = ?',
                [mascota_id]
            );
            
            if (solicitudExistente.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una solicitud de adopción para esta mascota'
                });
            }
            
            // Insertar la solicitud de adopción
            const [resultado] = await pool.query(
                `INSERT INTO solicitudes_adopcion (
                    mascota_id, usuario_id, nombre_adoptante, email, 
                    direccion, telefono, tipo_vivienda, fecha_tramite,
                    otras_mascotas, motivo_adopcion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    mascota_id, usuario_id, nombre_adoptante, email,
                    direccion, telefono, tipo_vivienda, fecha_tramite,
                    otras_mascotas, motivo_adopcion
                ]
            );
            
            // Obtener los detalles completos de la solicitud
            const [solicitud] = await pool.query(`
                SELECT 
                    s.*,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad,
                    m.tamaño as mascota_tamaño
                FROM solicitudes_adopcion s
                JOIN usuarios u ON s.usuario_id = u.id
                JOIN mascotas m ON s.mascota_id = m.id
                WHERE s.id = ?
            `, [resultado.insertId]);
            
            res.status(201).json({
                success: true,
                message: 'Solicitud de adopción registrada exitosamente',
                data: solicitud[0]
            });
        } catch (error) {
            console.error('Error al registrar solicitud de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar solicitud de adopción',
                error: error.message
            });
        }
    },
    
    // Obtener todas las solicitudes de adopción con información detallada
    async obtenerTodas(req, res) {
        try {
            const [solicitudes] = await pool.query(`
                SELECT 
                    s.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad,
                    m.tamaño as mascota_tamaño
                FROM solicitudes_adopcion s
                JOIN usuarios u ON s.usuario_id = u.id
                JOIN mascotas m ON s.mascota_id = m.id
                ORDER BY s.fecha_solicitud DESC
            `);
            
            res.json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
            console.error('Error al obtener solicitudes de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitudes de adopción',
                error: error.message
            });
        }
    },
    
    // Obtener una solicitud de adopción por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const [solicitudes] = await pool.query(`
                SELECT 
                    s.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad,
                    m.tamaño as mascota_tamaño
                FROM solicitudes_adopcion s
                JOIN usuarios u ON s.usuario_id = u.id
                JOIN mascotas m ON s.mascota_id = m.id
                WHERE s.id = ?
            `, [id]);
            
            if (solicitudes.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud de adopción no encontrada'
                });
            }
            
            res.json({
                success: true,
                data: solicitudes[0]
            });
        } catch (error) {
            console.error('Error al obtener solicitud de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitud de adopción',
                error: error.message
            });
        }
    },
    
    // Actualizar una solicitud de adopción
    async actualizar(req, res) {
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
            
            // Verificar si la solicitud existe
            const [solicitud] = await pool.query(
                'SELECT * FROM solicitudes_adopcion WHERE id = ?',
                [id]
            );
            
            if (solicitud.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud de adopción no encontrada'
                });
            }
            
            // Actualizar la solicitud
            await pool.query(
                `UPDATE solicitudes_adopcion SET 
                    nombre_adoptante = ?,
                    email = ?,
                    direccion = ?,
                    telefono = ?,
                    tipo_vivienda = ?,
                    fecha_tramite = ?,
                    otras_mascotas = ?,
                    motivo_adopcion = ?
                WHERE id = ?`,
                [
                    nombre_adoptante,
                    email,
                    direccion,
                    telefono,
                    tipo_vivienda,
                    fecha_tramite,
                    otras_mascotas,
                    motivo_adopcion,
                    id
                ]
            );
            
            // Obtener los detalles actualizados
            const [solicitudActualizada] = await pool.query(`
                SELECT 
                    s.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad,
                    m.tamaño as mascota_tamaño
                FROM solicitudes_adopcion s
                JOIN usuarios u ON s.usuario_id = u.id
                JOIN mascotas m ON s.mascota_id = m.id
                WHERE s.id = ?
            `, [id]);
            
            res.json({
                success: true,
                message: 'Solicitud de adopción actualizada exitosamente',
                data: solicitudActualizada[0]
            });
        } catch (error) {
            console.error('Error al actualizar solicitud de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar solicitud de adopción',
                error: error.message
            });
        }
    },
    
    // Eliminar una solicitud de adopción
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar si la solicitud existe
            const [solicitud] = await pool.query(
                'SELECT * FROM solicitudes_adopcion WHERE id = ?',
                [id]
            );
            
            if (solicitud.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud de adopción no encontrada'
                });
            }
            
            // Eliminar la solicitud
            await pool.query('DELETE FROM solicitudes_adopcion WHERE id = ?', [id]);
            
            res.json({
                success: true,
                message: 'Solicitud de adopción eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar solicitud de adopción:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar solicitud de adopción',
                error: error.message
            });
        }
    }
};

module.exports = adopcionesController; 