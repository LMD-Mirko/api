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
('Juan Pérez', 'juan@gmail.com', 'juandesa'),
('María García', 'maria@gmail.com', 'maria123we'),
('Carlos López', 'carlos@gmail.com', 'carlos236');

-- Insertar datos de ejemplo en mascotas
INSERT INTO mascotas (nombre, especie, edad, raza, tamaño, vacunado, desparasitado, personalidad, ubicacion, imagen_url, estado) VALUES
('Max', 'Perro', 2, 'Labrador', 'Grande', TRUE, TRUE, 'Amigable y juguetón', 'Chancay', 'data:image/jpeg;base64,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', 'Disponible'),
('Luna', 'Gato', 1, 'Persa', 'Pequeño', TRUE, TRUE, 'Tranquila y cariñosa', 'Olivos', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaEFD2LbELXYciDct3BsYpNxgmGhvv3Cc_Xg&s', 'Disponible'),
('Rocky', 'Perro', 3, 'Bulldog', 'Mediano', TRUE, TRUE, 'Protector y leal', 'Surco', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq1pAon83CsrXXwX6XTOTQsvLlHs70CKw7bA&s', 'Disponible'),
('Milo', 'Gato', 2, 'Siamés', 'Mediano', TRUE, TRUE, 'Curioso y activo', 'Comas', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS616kn8bcEldbybkmtk42SQcQOuOLz4CZaHA&s', 'Disponible'),
('Bella', 'Perro', 1, 'Golden Retriever', 'Grande', TRUE, TRUE, 'Dulce y cariñosa', 'Lima', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSBqa63mgHe1fLDcbUZRt9StG38k2C_gMEig&s', 'Disponible');

-- Insertar datos de ejemplo en solicitudes_adopcion
INSERT INTO solicitudes_adopcion (mascota_id, usuario_id, nombre_adoptante, email, direccion, telefono, tipo_vivienda, fecha_tramite, otras_mascotas, motivo_adopcion) VALUES
(1, 1, 'Juan Pérez', 'juan@example.com', 'Calle Principal 123', '555-123-4567', 'Casa', '2024-03-20', FALSE, 'Quiero darle un hogar amoroso a Max'),
(2, 2, 'María García', 'maria@example.com', 'Avenida Central 456', '555-987-6543', 'Departamento', '2024-03-21', TRUE, 'Busco un compañero para mi gato actual'),
(3, 3, 'Carlos López', 'carlos@example.com', 'Boulevard Norte 789', '555-456-7890', 'Casa', '2024-03-22', FALSE, 'Siempre he querido tener un bulldog');
