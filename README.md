# 🐾 PetConnect API

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" width="100" height="100" alt="Node.js"/>
</p>

API REST para la gestión de adopciones de mascotas, desarrollada con Node.js, Express y MySQL.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints](#-endpoints)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ⚙ Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior)
- npm (gestor de paquetes de Node.js)

## 📥 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Area-de-Desarrollo-React-Jueves/Plataforma-Mascotas.git
cd backend
```

2. Instalar todas las dependencias necesarias:
```bash
# Dependencias principales
npm install express mysql2 cors dotenv morgan express-validator bcryptjs jsonwebtoken
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el siguiente contenido y ajustar según tu configuración:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_DATABASE=petconnect1
JWT_SECRET=petconnect_secret_key_development
PORT=3000
```

4. Configurar la base de datos:
   - Abrir MySQL
   - Crear la base de datos:
   ```sql
   CREATE DATABASE petconnect1;
   ```

5. Iniciar el servidor:
```bash
node app.js
```

## 🛠 Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - MySQL
  - JWT (JSON Web Tokens)
  - Express Validator
  - BCryptjs
  - Morgan
  - CORS
  - Dotenv

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── adopcionesController.js
│   ├── mascotasController.js
│   └── usuariosController.js
├── middlewares/
│   └── auth.js
├── routes/
│   ├── adopcionesRoutes.js
│   ├── mascotasRoutes.js
│   └── usuariosRoutes.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Endpoints

### Adopciones

- `POST /api/adopciones` - Registrar nueva adopción
- `GET /api/adopciones` - Obtener todas las adopciones
- `GET /api/adopciones/:id` - Obtener adopción por ID
- `PUT /api/adopciones/:id` - Actualizar adopción
- `DELETE /api/adopciones/:id` - Eliminar adopción

### Mascotas

- `POST /api/mascotas` - Registrar nueva mascota
- `GET /api/mascotas` - Obtener todas las mascotas
- `GET /api/mascotas/:id` - Obtener mascota por ID
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota

### Usuarios

- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil de usuario
- `PUT /api/usuarios/perfil` - Actualizar perfil

## 📝 Ejemplos de Uso

### Registrar una adopción

```bash
curl -X POST http://localhost:3000/api/adopciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_jwt" \
  -d '{
    "usuario_id": 1,
    "mascota_id": 1,
    "estado": "Pendiente"
  }'
```

### Obtener adopciones

```bash
curl -X GET http://localhost:3000/api/adopciones \
  -H "Authorization: Bearer tu_token_jwt"
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con el ❤️  