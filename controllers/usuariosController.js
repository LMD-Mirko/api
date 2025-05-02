const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const usuariosController = {
    // Registrar usuario
    registrar: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;
            
            // Verificar si el usuario ya existe
            const [existente] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (existente.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const contraseñaEncriptada = await bcrypt.hash(password, salt);

            // Insertar usuario
            const [resultado] = await pool.query(
                'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
                [nombre, email, contraseñaEncriptada]
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: { id: resultado.insertId, nombre, email }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario',
                error: error.message
            });
        }
    },

    // Iniciar sesión
    iniciarSesion: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (usuarios.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const usuario = usuarios[0];
            const contraseñaValida = await bcrypt.compare(password, usuario.password);
            
            if (!contraseñaValida) {
                return res.status(400).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: {
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email
                    }
                }
            });
        } catch (error) {
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
            const [usuarios] = await pool.query(
                'SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?',
                [id]
            );

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
            const { nombre, email } = req.body;

            const [resultado] = await pool.query(
                'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
                [nombre, email, id]
            );

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
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error.message
            });
        }
    }
};

module.exports = usuariosController;