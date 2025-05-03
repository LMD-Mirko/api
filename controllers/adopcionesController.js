const pool = require('../config/database');

const adopcionesController = {
    // Registrar una nueva adopción
    async registrar(req, res) {
        try {
            const { usuario_id, mascota_id, estado } = req.body;
            
            // Verificar si el usuario existe
            const [usuario] = await pool.query(
                'SELECT id FROM usuarios WHERE id = ?',
                [usuario_id]
            );
            
            if (usuario.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            // Verificar si la mascota existe y su estado
            const [mascota] = await pool.query(
                'SELECT estado FROM mascotas WHERE id = ?',
                [mascota_id]
            );
            
            if (mascota.length === 0) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
            
            if (mascota[0].estado === 'Adoptado') {
                return res.status(400).json({ error: 'La mascota ya está adoptada' });
            }
            
            // Verificar si ya existe una adopción pendiente para esta mascota
            const [adopcionExistente] = await pool.query(
                'SELECT id FROM solicitudes_adopcion WHERE mascota_id = ? AND estado = "Pendiente"',
                [mascota_id]
            );
            
            if (adopcionExistente.length > 0) {
                return res.status(400).json({ error: 'Ya existe una solicitud de adopción pendiente para esta mascota' });
            }
            
            // Insertar la adopción
            const [result] = await pool.query(
                'INSERT INTO solicitudes_adopcion (usuario_id, mascota_id, estado) VALUES (?, ?, ?)',
                [usuario_id, mascota_id, estado]
            );
            
            // Actualizar el estado de la mascota si la adopción es aprobada
            if (estado === 'Aprobada') {
                await pool.query(
                    'UPDATE mascotas SET estado = "Adoptado" WHERE id = ?',
                    [mascota_id]
                );
            }
            
            // Obtener los detalles completos de la adopción
            const [adopcion] = await pool.query(`
                SELECT a.*, u.nombre as usuario_nombre, m.nombre as mascota_nombre
                FROM solicitudes_adopcion a
                JOIN usuarios u ON a.usuario_id = u.id
                JOIN mascotas m ON a.mascota_id = m.id
                WHERE a.id = ?
            `, [result.insertId]);
            
            res.status(201).json(adopcion[0]);
        } catch (error) {
            console.error('Error al registrar adopción:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    // Obtener todas las adopciones con información detallada
    async obtenerTodas(req, res) {
        try {
            const [adopciones] = await pool.query(`
                SELECT 
                    a.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.especie as mascota_especie,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad
                FROM solicitudes_adopcion a
                JOIN usuarios u ON a.usuario_id = u.id
                JOIN mascotas m ON a.mascota_id = m.id
                ORDER BY a.fecha_creacion DESC
            `);
            res.json(adopciones);
        } catch (error) {
            console.error('Error al obtener adopciones:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    // Obtener una adopción por ID con información detallada
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const [adopciones] = await pool.query(`
                SELECT 
                    a.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.especie as mascota_especie,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad,
                    m.descripcion as mascota_descripcion
                FROM solicitudes_adopcion a
                JOIN usuarios u ON a.usuario_id = u.id
                JOIN mascotas m ON a.mascota_id = m.id
                WHERE a.id = ?
            `, [id]);
            
            if (adopciones.length === 0) {
                return res.status(404).json({ error: 'Adopción no encontrada' });
            }
            
            res.json(adopciones[0]);
        } catch (error) {
            console.error('Error al obtener adopción:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    // Actualizar una adopción
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { usuario_id, mascota_id, estado } = req.body;
            
            // Verificar si la adopción existe
            const [adopciones] = await pool.query(
                'SELECT * FROM solicitudes_adopcion WHERE id = ?',
                [id]
            );
            
            if (adopciones.length === 0) {
                return res.status(404).json({ error: 'Adopción no encontrada' });
            }
            
            // Verificar si el usuario existe
            const [usuario] = await pool.query(
                'SELECT id FROM usuarios WHERE id = ?',
                [usuario_id]
            );
            
            if (usuario.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            // Verificar si la mascota existe
            const [mascota] = await pool.query(
                'SELECT estado FROM mascotas WHERE id = ?',
                [mascota_id]
            );
            
            if (mascota.length === 0) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
            
            // Actualizar la adopción
            await pool.query(
                'UPDATE solicitudes_adopcion SET usuario_id = ?, mascota_id = ?, estado = ? WHERE id = ?',
                [usuario_id, mascota_id, estado, id]
            );
            
            // Actualizar el estado de la mascota si la adopción es aprobada
            if (estado === 'Aprobada') {
                await pool.query(
                    'UPDATE mascotas SET estado = "Adoptado" WHERE id = ?',
                    [mascota_id]
                );
            }
            
            // Obtener los detalles actualizados de la adopción
            const [adopcionActualizada] = await pool.query(`
                SELECT 
                    a.*, 
                    u.nombre as usuario_nombre,
                    u.email as usuario_email,
                    m.nombre as mascota_nombre,
                    m.especie as mascota_especie,
                    m.raza as mascota_raza,
                    m.edad as mascota_edad
                FROM solicitudes_adopcion a
                JOIN usuarios u ON a.usuario_id = u.id
                JOIN mascotas m ON a.mascota_id = m.id
                WHERE a.id = ?
            `, [id]);
            
            res.json(adopcionActualizada[0]);
        } catch (error) {
            console.error('Error al actualizar adopción:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    // Eliminar una adopción
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar si la adopción existe
            const [adopciones] = await pool.query(
                'SELECT * FROM solicitudes_adopcion WHERE id = ?',
                [id]
            );
            
            if (adopciones.length === 0) {
                return res.status(404).json({ error: 'Adopción no encontrada' });
            }
            
            // Si la adopción estaba aprobada, actualizar el estado de la mascota
            if (adopciones[0].estado === 'Aprobada') {
                await pool.query(
                    'UPDATE mascotas SET estado = "Disponible" WHERE id = ?',
                    [adopciones[0].mascota_id]
                );
            }
            
            // Eliminar la adopción
            await pool.query('DELETE FROM solicitudes_adopcion WHERE id = ?', [id]);
            
            res.json({ message: 'Adopción eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar adopción:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = adopcionesController; 