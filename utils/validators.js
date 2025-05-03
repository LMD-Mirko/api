// Función para capitalizar strings
const capitalizar = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Función para convertir booleanos a 0/1
const toIntBoolean = val => val === true || val === 'true' || val === 1 ? 1 : 0;

// Función para validar URLs
const isValidUrl = (url) => {
    if (!url) return true; // Si no hay URL, es válido (es opcional)
    return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url);
};

// Función para validar campos requeridos
const validarCamposRequeridos = (data) => {
    const camposFaltantes = [];
    const campos = {
        nombre: data.nombre,
        especie: data.especie,
        edad: data.edad,
        raza: data.raza,
        tamaño: data.tamaño,
        ubicacion: data.ubicacion
    };

    for (const [campo, valor] of Object.entries(campos)) {
        if (!valor) camposFaltantes.push(campo);
    }

    return camposFaltantes;
};

// Función para validar edad
const validarEdad = (edad) => {
    const edadNum = Number(edad);
    return !isNaN(edadNum) && edadNum >= 0;
};

// Función para validar tamaño
const validarTamaño = (tamaño) => {
    const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
    return tamanosPermitidos.includes(tamaño);
};

// Función para validar estado
const validarEstado = (estado) => {
    if (!estado) return true; // Si no hay estado, es válido (tiene valor por defecto)
    const estadosPermitidos = ['Disponible', 'Adoptado'];
    return estadosPermitidos.includes(estado);
};

module.exports = {
    capitalizar,
    toIntBoolean,
    isValidUrl,
    validarCamposRequeridos,
    validarEdad,
    validarTamaño,
    validarEstado
}; 