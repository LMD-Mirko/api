const pool = require('../config/database');
const {
    capitalizar,
    toIntBoolean,
    isValidUrl,
    validarCamposRequeridos,
    validarEdad,
    validarTamaño,
    validarEstado
} = require('../utils/validators');

const mascotasController = {
    // Registrar nueva mascota
    registrar: async (req, res) => {
        try {
            console.log('=== DEBUG: Inicio de registrar mascota ===');
            console.log('Request body completo:', JSON.stringify(req.body, null, 2));
            console.log('Headers:', JSON.stringify(req.headers, null, 2));

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

            // Log de cada campo individual
            console.log('Campos recibidos:', {
                nombre: nombre || 'undefined',
                especie: especie || 'undefined',
                edad: edad || 'undefined',
                raza: raza || 'undefined',
                tamaño: tamaño || 'undefined',
                vacunado: vacunado || 'undefined',
                desparasitado: desparasitado || 'undefined',
                personalidad: personalidad || 'undefined',
                ubicacion: ubicacion || 'undefined',
                imagen_url: imagen_url || 'undefined',
                estado: estado || 'undefined'
            });

            // Validar campos requeridos
            const camposFaltantes = validarCamposRequeridos(req.body);
            if (camposFaltantes.length > 0) {
                console.log('Campos faltantes:', camposFaltantes);
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos',
                    camposFaltantes
                });
            }

            // Validar edad
            if (!validarEdad(edad)) {
                console.log('Edad inválida:', edad);
                return res.status(400).json({
                    success: false,
                    message: 'La edad debe ser un número positivo'
                });
            }

            // Validar tamaño
            if (!validarTamaño(tamaño)) {
                console.log('Tamaño inválido:', tamaño);
                return res.status(400).json({
                    success: false,
                    message: 'El tamaño debe ser Pequeño, Mediano o Grande'
                });
            }

            // Validar URL de imagen
            if (!isValidUrl(imagen_url)) {
                console.log('URL de imagen inválida:', imagen_url);
                return res.status(400).json({
                    success: false,
                    message: 'La URL de la imagen no es válida'
                });
            }

            // Convertir booleanos a 0/1
            const vacunadoInt = toIntBoolean(vacunado);
            const desparasitadoInt = toIntBoolean(desparasitado);

            // Capitalizar strings
            const nombreCapitalizado = capitalizar(nombre.trim());
            const especieCapitalizada = capitalizar(especie.trim());
            const razaCapitalizada = capitalizar(raza.trim());
            const ubicacionCapitalizada = capitalizar(ubicacion.trim());

            // Log de datos procesados
            console.log('Datos procesados:', {
                nombreCapitalizado,
                especieCapitalizada,
                edad: Number(edad),
                razaCapitalizada,
                tamaño,
                vacunadoInt,
                desparasitadoInt,
                personalidad: personalidad ? personalidad.trim() : null,
                ubicacionCapitalizada,
                imagen_url: imagen_url ? imagen_url.trim() : null,
                estado: estado || 'Disponible'
            });

            const connection = await pool.getConnection();
            try {
                const query = `INSERT INTO mascotas 
                    (nombre, especie, edad, raza, tamaño, vacunado, desparasitado, 
                     personalidad, ubicacion, imagen_url, estado) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                
                const values = [
                    nombreCapitalizado,
                    especieCapitalizada,
                    Number(edad),
                    razaCapitalizada,
                    tamaño,
                    vacunadoInt,
                    desparasitadoInt,
                    personalidad ? personalidad.trim() : null,
                    ubicacionCapitalizada,
                    imagen_url ? imagen_url.trim() : null,
                    estado || 'Disponible'
                ];

                console.log('Query SQL:', query);
                console.log('Valores:', values);

                const [resultado] = await connection.query(query, values);

                console.log('Resultado de la inserción:', resultado);

                res.status(201).json({
                    success: true,
                    message: 'Mascota registrada exitosamente',
                    data: { id: resultado.insertId }
                });
            } catch (error) {
                console.error('Error en la inserción:', error);
                console.error('Código de error:', error.code);
                console.error('Mensaje de error:', error.message);
                console.error('Stack trace:', error.stack);
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            console.error('Stack trace:', error.stack);
            
            res.status(500).json({
                success: false,
                message: 'Error al registrar mascota',
                error: error.message,
                code: error.code
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

            // Validar edad si se proporciona
            if (edad !== undefined && !validarEdad(edad)) {
                return res.status(400).json({
                    success: false,
                    message: 'La edad debe ser un número positivo'
                });
            }

            // Validar tamaño si se proporciona
            if (tamaño && !validarTamaño(tamaño)) {
                return res.status(400).json({
                    success: false,
                    message: 'El tamaño debe ser Pequeño, Mediano o Grande'
                });
            }

            // Validar estado si se proporciona
            if (estado && !validarEstado(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'El estado debe ser Disponible o Adoptado'
                });
            }

            // Validar URL de imagen si se proporciona
            if (imagen_url && !isValidUrl(imagen_url)) {
                return res.status(400).json({
                    success: false,
                    message: 'La URL de la imagen no es válida'
                });
            }

            // Construir la consulta dinámicamente
            let updateQuery = 'UPDATE mascotas SET ';
            const updateValues = [];
            const updateFields = [];

            if (nombre) {
                updateFields.push('nombre = ?');
                updateValues.push(capitalizar(nombre.trim()));
            }
            if (especie) {
                updateFields.push('especie = ?');
                updateValues.push(capitalizar(especie.trim()));
            }
            if (edad !== undefined) {
                updateFields.push('edad = ?');
                updateValues.push(Number(edad));
            }
            if (raza) {
                updateFields.push('raza = ?');
                updateValues.push(capitalizar(raza.trim()));
            }
            if (tamaño) {
                updateFields.push('tamaño = ?');
                updateValues.push(tamaño);
            }
            if (vacunado !== undefined) {
                updateFields.push('vacunado = ?');
                updateValues.push(toIntBoolean(vacunado));
            }
            if (desparasitado !== undefined) {
                updateFields.push('desparasitado = ?');
                updateValues.push(toIntBoolean(desparasitado));
            }
            if (personalidad !== undefined) {
                updateFields.push('personalidad = ?');
                updateValues.push(personalidad.trim());
            }
            if (ubicacion) {
                updateFields.push('ubicacion = ?');
                updateValues.push(capitalizar(ubicacion.trim()));
            }
            if (imagen_url !== undefined) {
                updateFields.push('imagen_url = ?');
                updateValues.push(imagen_url.trim());
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