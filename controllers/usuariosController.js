const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const usuariosController = {
    // Registrar nuevo usuario
    registrar: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;

            // Validar que el email no exista
            const [existeEmail] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (existeEmail.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const [resultado] = await pool.query(
                `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
                [nombre, email, passwordHash]
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: { id: resultado.insertId }
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario',
                error: error.message
            });
        }
    },

    // Iniciar sesión
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario por email
            const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (usuarios.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const usuario = usuarios[0];

            // Verificar contraseña
            const passwordValido = await bcrypt.compare(password, usuario.password);
            if (!passwordValido) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Eliminar la contraseña del objeto de respuesta
            delete usuario.password;

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: usuario
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión',
                error: error.message
            });
        }
    },

    // Obtener todos los usuarios
    obtenerTodos: async (req, res) => {
        try {
            const [usuarios] = await pool.query('SELECT id, nombre, email, fecha_registro FROM usuarios');
            
            res.json({
                success: true,
                data: usuarios
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios',
                error: error.message
            });
        }
    },

    // Obtener usuario por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [usuarios] = await pool.query('SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?', [id]);

            if (usuarios.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: usuarios[0]
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuario',
                error: error.message
            });
        }
    },

    // Actualizar usuario
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, email, password } = req.body;

            // Verificar si el email ya existe en otro usuario
            if (email) {
                const [existeEmail] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
                if (existeEmail.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'El email ya está registrado'
                    });
                }
            }

            let updateQuery = 'UPDATE usuarios SET ';
            const updateValues = [];
            const updateFields = [];

            if (nombre) {
                updateFields.push('nombre = ?');
                updateValues.push(nombre);
            }

            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);
                updateFields.push('password = ?');
                updateValues.push(passwordHash);
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
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar usuario',
                error: error.message
            });
        }
    },

    // Eliminar usuario
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error.message
            });
        }
    }
};

module.exports = usuariosController;