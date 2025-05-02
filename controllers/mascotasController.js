const pool = require('../config/database');

const mascotasController = {
    // Registrar nueva mascota
    registrar: async (req, res) => {
        try {
            const {
                nombre,
                edad,
                raza,
                tamaño,
                vacunado,
                desparasitado,
                personalidad,
                ubicacion,
                imagen_url
            } = req.body;

            const [resultado] = await pool.query(
                `INSERT INTO mascotas 
                (nombre, edad, raza, tamaño, vacunado, desparasitado, personalidad, ubicacion, imagen_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, edad, raza, tamaño, vacunado, desparasitado, personalidad, ubicacion, imagen_url]
            );

            res.status(201).json({
                success: true,
                message: 'Mascota registrada exitosamente',
                data: { id: resultado.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al registrar mascota',
                error: error.message
            });
        }
    },

    // Obtener todas las mascotas
    obtenerTodas: async (req, res) => {
        try {
            const [mascotas] = await pool.query('SELECT * FROM mascotas');
            res.json({
                success: true,
                data: mascotas
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener mascotas',
                error: error.message
            });
        }
    },

    // Obtener mascota por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [mascotas] = await pool.query('SELECT * FROM mascotas WHERE id = ?', [id]);

            if (mascotas.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.json({
                success: true,
                data: mascotas[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener mascota',
                error: error.message
            });
        }
    },

    // Actualizar mascota
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nombre,
                edad,
                raza,
                tamaño,
                vacunado,
                desparasitado,
                personalidad,
                ubicacion,
                imagen_url,
                estado
            } = req.body;

            const [resultado] = await pool.query(
                `UPDATE mascotas SET 
                nombre = ?, edad = ?, raza = ?, tamaño = ?, vacunado = ?, 
                desparasitado = ?, personalidad = ?, ubicacion = ?, 
                imagen_url = ?, estado = ? 
                WHERE id = ?`,
                [nombre, edad, raza, tamaño, vacunado, desparasitado, 
                 personalidad, ubicacion, imagen_url, estado, id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Mascota actualizada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar mascota',
                error: error.message
            });
        }
    },

    // Eliminar mascota
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM mascotas WHERE id = ?', [id]);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Mascota eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar mascota',
                error: error.message
            });
        }
    }
};

module.exports = mascotasController; 