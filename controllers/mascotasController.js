const pool = require('../config/database');

const mascotasController = {
    // Registrar nueva mascota
    registrar: async (req, res) => {
        try {
            const {
                nombre,
                especie,
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

            // Validar campos requeridos
            if (!nombre || !especie || !edad || !raza || !tamaño || !ubicacion) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos'
                });
            }

            // Validar que el tamaño sea uno de los valores permitidos
            const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
            if (!tamanosPermitidos.includes(tamaño)) {
                return res.status(400).json({
                    success: false,
                    message: 'El tamaño debe ser Pequeño, Mediano o Grande'
                });
            }

            // Validar que el estado sea uno de los valores permitidos
            const estadosPermitidos = ['Disponible', 'Adoptado'];
            if (estado && !estadosPermitidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'El estado debe ser Disponible o Adoptado'
                });
            }

            // Convertir vacunado y desparasitado a booleanos si no están definidos
            const vacunadoBool = vacunado ? 1 : 0;
            const desparasitadoBool = desparasitado ? 1 : 0;

            const [resultado] = await pool.query(
                `INSERT INTO mascotas 
                (nombre, especie, edad, raza, tamaño, vacunado, desparasitado, 
                 personalidad, ubicacion, imagen_url, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, especie, edad, raza, tamaño, vacunadoBool, desparasitadoBool, 
                 personalidad || null, ubicacion, imagen_url || null, estado || 'Disponible']
            );

            res.status(201).json({
                success: true,
                message: 'Mascota registrada exitosamente',
                data: { id: resultado.insertId }
            });
        } catch (error) {
            console.error('Error al registrar mascota:', error);
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
            console.error('Error al obtener mascotas:', error);
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
            console.error('Error al obtener mascota:', error);
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
                especie,
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

            // Validar que el tamaño sea uno de los valores permitidos si se proporciona
            if (tamaño) {
                const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
                if (!tamanosPermitidos.includes(tamaño)) {
                    return res.status(400).json({
                        success: false,
                        message: 'El tamaño debe ser Pequeño, Mediano o Grande'
                    });
                }
            }

            // Validar que el estado sea uno de los valores permitidos si se proporciona
            if (estado) {
                const estadosPermitidos = ['Disponible', 'Adoptado'];
                if (!estadosPermitidos.includes(estado)) {
                    return res.status(400).json({
                        success: false,
                        message: 'El estado debe ser Disponible o Adoptado'
                    });
                }
            }

            // Convertir vacunado y desparasitado a booleanos si se proporcionan
            const vacunadoBool = vacunado !== undefined ? (vacunado ? 1 : 0) : undefined;
            const desparasitadoBool = desparasitado !== undefined ? (desparasitado ? 1 : 0) : undefined;

            // Construir la consulta dinámicamente
            let updateQuery = 'UPDATE mascotas SET ';
            const updateValues = [];
            const updateFields = [];

            if (nombre) {
                updateFields.push('nombre = ?');
                updateValues.push(nombre);
            }
            if (especie) {
                updateFields.push('especie = ?');
                updateValues.push(especie);
            }
            if (edad) {
                updateFields.push('edad = ?');
                updateValues.push(edad);
            }
            if (raza) {
                updateFields.push('raza = ?');
                updateValues.push(raza);
            }
            if (tamaño) {
                updateFields.push('tamaño = ?');
                updateValues.push(tamaño);
            }
            if (vacunadoBool !== undefined) {
                updateFields.push('vacunado = ?');
                updateValues.push(vacunadoBool);
            }
            if (desparasitadoBool !== undefined) {
                updateFields.push('desparasitado = ?');
                updateValues.push(desparasitadoBool);
            }
            if (personalidad !== undefined) {
                updateFields.push('personalidad = ?');
                updateValues.push(personalidad);
            }
            if (ubicacion) {
                updateFields.push('ubicacion = ?');
                updateValues.push(ubicacion);
            }
            if (imagen_url !== undefined) {
                updateFields.push('imagen_url = ?');
                updateValues.push(imagen_url);
            }
            if (estado) {
                updateFields.push('estado = ?');
                updateValues.push(estado);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            updateQuery += updateFields.join(', ') + ' WHERE id = ?';
            updateValues.push(id);

            const [resultado] = await pool.query(updateQuery, updateValues);

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
            console.error('Error al actualizar mascota:', error);
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
            console.error('Error al eliminar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar mascota',
                error: error.message
            });
        }
    }
};

module.exports = mascotasController; 