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
                console.warn('Intento de registro con campos faltantes:', { nombre, especie, edad, raza, tamaño, ubicacion });
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos',
                    campos_faltantes: {
                        nombre: !nombre,
                        especie: !especie,
                        edad: !edad,
                        raza: !raza,
                        tamaño: !tamaño,
                        ubicacion: !ubicacion
                    }
                });
            }

            // Validar tipos de datos
            if (typeof edad !== 'number' || edad < 0) {
                console.warn('Edad inválida:', edad);
                return res.status(400).json({
                    success: false,
                    message: 'La edad debe ser un número positivo'
                });
            }

            // Validar que el tamaño sea uno de los valores permitidos
            const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
            if (!tamanosPermitidos.includes(tamaño)) {
                console.warn('Tamaño inválido:', tamaño);
                return res.status(400).json({
                    success: false,
                    message: 'El tamaño debe ser Pequeño, Mediano o Grande',
                    valores_permitidos: tamanosPermitidos
                });
            }

            // Validar que el estado sea uno de los valores permitidos
            const estadosPermitidos = ['Disponible', 'Adoptado'];
            if (estado && !estadosPermitidos.includes(estado)) {
                console.warn('Estado inválido:', estado);
                return res.status(400).json({
                    success: false,
                    message: 'El estado debe ser Disponible o Adoptado',
                    valores_permitidos: estadosPermitidos
                });
            }

            // Sanitizar y validar URLs
            if (imagen_url && !imagen_url.startsWith('http')) {
                console.warn('URL de imagen inválida:', imagen_url);
                return res.status(400).json({
                    success: false,
                    message: 'La URL de la imagen debe comenzar con http'
                });
            }

            // Convertir vacunado y desparasitado a booleanos
            const vacunadoBool = Boolean(vacunado);
            const desparasitadoBool = Boolean(desparasitado);

            // Iniciar transacción
            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                const [resultado] = await connection.query(
                    `INSERT INTO mascotas 
                    (nombre, especie, edad, raza, tamaño, vacunado, desparasitado, 
                     personalidad, ubicacion, imagen_url, estado) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [nombre, especie, edad, raza, tamaño, vacunadoBool, desparasitadoBool, 
                     personalidad || null, ubicacion, imagen_url || null, estado || 'Disponible']
                );

                await connection.commit();
                connection.release();

                console.log('Mascota registrada exitosamente:', { id: resultado.insertId, nombre, especie });

                res.status(201).json({
                    success: true,
                    message: 'Mascota registrada exitosamente',
                    data: { id: resultado.insertId }
                });
            } catch (error) {
                await connection.rollback();
                connection.release();
                throw error;
            }
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar mascota',
                error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message
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
                error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message
            });
        }
    },

    // Obtener mascota por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [mascotas] = await pool.query('SELECT * FROM mascotas WHERE id = ?', [id]);

            if (mascotas.length === 0) {
                console.warn('Mascota no encontrada:', id);
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
                error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message
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

            // Validar que la mascota exista
            const [mascotaExistente] = await pool.query('SELECT id FROM mascotas WHERE id = ?', [id]);
            if (mascotaExistente.length === 0) {
                console.warn('Intento de actualizar mascota inexistente:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            // Validar tipos de datos si se proporcionan
            if (edad !== undefined && (typeof edad !== 'number' || edad < 0)) {
                console.warn('Edad inválida:', edad);
                return res.status(400).json({
                    success: false,
                    message: 'La edad debe ser un número positivo'
                });
            }

            // Validar que el tamaño sea uno de los valores permitidos si se proporciona
            if (tamaño) {
                const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
                if (!tamanosPermitidos.includes(tamaño)) {
                    console.warn('Tamaño inválido:', tamaño);
                    return res.status(400).json({
                        success: false,
                        message: 'El tamaño debe ser Pequeño, Mediano o Grande',
                        valores_permitidos: tamanosPermitidos
                    });
                }
            }

            // Validar que el estado sea uno de los valores permitidos si se proporciona
            if (estado) {
                const estadosPermitidos = ['Disponible', 'Adoptado'];
                if (!estadosPermitidos.includes(estado)) {
                    console.warn('Estado inválido:', estado);
                    return res.status(400).json({
                        success: false,
                        message: 'El estado debe ser Disponible o Adoptado',
                        valores_permitidos: estadosPermitidos
                    });
                }
            }

            // Sanitizar y validar URLs
            if (imagen_url && !imagen_url.startsWith('http')) {
                console.warn('URL de imagen inválida:', imagen_url);
                return res.status(400).json({
                    success: false,
                    message: 'La URL de la imagen debe comenzar con http'
                });
            }

            // Convertir vacunado y desparasitado a booleanos si se proporcionan
            const vacunadoBool = vacunado !== undefined ? Boolean(vacunado) : undefined;
            const desparasitadoBool = desparasitado !== undefined ? Boolean(desparasitado) : undefined;

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
            if (edad !== undefined) {
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
                console.warn('Intento de actualización sin campos:', id);
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            updateQuery += updateFields.join(', ') + ' WHERE id = ?';
            updateValues.push(id);

            const [resultado] = await pool.query(updateQuery, updateValues);

            if (resultado.affectedRows === 0) {
                console.warn('No se actualizó ninguna mascota:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            console.log('Mascota actualizada exitosamente:', { id, campos_actualizados: updateFields });

            res.json({
                success: true,
                message: 'Mascota actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar mascota',
                error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message
            });
        }
    },

    // Eliminar mascota
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar si la mascota existe
            const [mascotaExistente] = await pool.query('SELECT id FROM mascotas WHERE id = ?', [id]);
            if (mascotaExistente.length === 0) {
                console.warn('Intento de eliminar mascota inexistente:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            const [resultado] = await pool.query('DELETE FROM mascotas WHERE id = ?', [id]);

            if (resultado.affectedRows === 0) {
                console.warn('No se eliminó ninguna mascota:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            console.log('Mascota eliminada exitosamente:', id);

            res.json({
                success: true,
                message: 'Mascota eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar mascota',
                error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message
            });
        }
    }
};

module.exports = mascotasController; 