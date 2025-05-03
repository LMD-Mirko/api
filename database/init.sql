-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS petconnect1;

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS petconnect1;

-- Usar la base de datos
USE petconnect1;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    raza VARCHAR(100) NOT NULL,
    tamaño ENUM('Pequeño', 'Mediano', 'Grande') NOT NULL,
    vacunado BOOLEAN NOT NULL DEFAULT FALSE,
    desparasitado BOOLEAN NOT NULL DEFAULT FALSE,
    personalidad TEXT,
    ubicacion VARCHAR(255) NOT NULL,
    imagen_url VARCHAR(255),
    estado ENUM('Disponible', 'Adoptado') NOT NULL DEFAULT 'Disponible'
);

-- Tabla solicitudes_adopcion
CREATE TABLE IF NOT EXISTS solicitudes_adopcion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nombre_adoptante VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    tipo_vivienda VARCHAR(100) NOT NULL,
    fecha_tramite DATE NOT NULL,
    otras_mascotas BOOLEAN NOT NULL DEFAULT FALSE,
    motivo_adopcion TEXT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insertar datos de ejemplo en usuarios
INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@example.com', '$2a$10$rDkPvvAFV6GgW5K7Jvq9Oe3Zz3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3'),
('María García', 'maria@example.com', '$2a$10$rDkPvvAFV6GgW5K7Jvq9Oe3Zz3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3'),
('Carlos López', 'carlos@example.com', '$2a$10$rDkPvvAFV6GgW5K7Jvq9Oe3Zz3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3');

-- Insertar datos de ejemplo en mascotas
INSERT INTO mascotas (nombre, especie, edad, raza, tamaño, vacunado, desparasitado, personalidad, ubicacion, imagen_url, estado) VALUES
('Max', 'Perro', 2, 'Labrador', 'Grande', TRUE, TRUE, 'Amigable y juguetón', 'Ciudad de México', 'https://ejemplo.com/max.jpg', 'Disponible'),
('Luna', 'Gato', 1, 'Persa', 'Pequeño', TRUE, TRUE, 'Tranquila y cariñosa', 'Guadalajara', 'https://ejemplo.com/luna.jpg', 'Disponible'),
('Rocky', 'Perro', 3, 'Bulldog', 'Mediano', TRUE, TRUE, 'Protector y leal', 'Monterrey', 'https://ejemplo.com/rocky.jpg', 'Disponible'),
('Milo', 'Gato', 2, 'Siamés', 'Mediano', TRUE, TRUE, 'Curioso y activo', 'Puebla', 'https://ejemplo.com/milo.jpg', 'Disponible'),
('Bella', 'Perro', 1, 'Golden Retriever', 'Grande', TRUE, TRUE, 'Dulce y cariñosa', 'Tijuana', 'https://ejemplo.com/bella.jpg', 'Disponible');

-- Insertar datos de ejemplo en solicitudes_adopcion
INSERT INTO solicitudes_adopcion (mascota_id, usuario_id, nombre_adoptante, email, direccion, telefono, tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion) VALUES
(1, 1, 'Juan Pérez', 'juan@example.com', 'Calle Principal 123', '555-123-4567', 'Casa', '2024-03-20', FALSE, 'Quiero darle un hogar amoroso a Max'),
(2, 2, 'María García', 'maria@example.com', 'Avenida Central 456', '555-987-6543', 'Departamento', '2024-03-21', TRUE, 'Busco un compañero para mi gato actual'),
(3, 3, 'Carlos López', 'carlos@example.com', 'Boulevard Norte 789', '555-456-7890', 'Casa', '2024-03-22', FALSE, 'Siempre he querido tener un bulldog');