const fetch = require('node-fetch');

const API_URL = 'https://web-production-aea20.up.railway.app/api/mascotas';

const testData = {
    nombre: "Pelusa",
    especie: "cuy",
    edad: 1,
    raza: "Peruano",
    tamaño: "Pequeño",
    vacunado: true,
    desparasitado: true,
    personalidad: "Amigable y curioso",
    ubicacion: "Lima",
    imagen_url: "https://ejemplo.com/cuy.jpg",
    estado: "Disponible"
};

async function testRegisterPet() {
    try {
        console.log('=== Iniciando prueba de registro de mascota ===');
        console.log('Datos a enviar:', JSON.stringify(testData, null, 2));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log('=== Respuesta del servidor ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const data = await response.json();
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar mascota');
        }

        console.log('=== Prueba completada exitosamente ===');
    } catch (error) {
        console.error('=== Error en la prueba ===');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

testRegisterPet(); 