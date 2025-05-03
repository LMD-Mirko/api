const fetch = require('node-fetch');

const API_URL = 'https://web-production-aea20.up.railway.app/api/mascotas';

async function testRegister() {
    try {
        const mascota = {
            nombre: "Max",
            especie: "Perro",
            edad: 2,
            raza: "Labrador",
            tamaño: "Grande",
            ubicacion: "Lima"
        };

        console.log('=== Iniciando prueba de registro ===');
        console.log('URL:', API_URL);
        console.log('Datos a enviar:', JSON.stringify(mascota, null, 2));

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(mascota)
        };

        console.log('Opciones de la petición:', JSON.stringify(requestOptions, null, 2));

        const response = await fetch(API_URL, requestOptions);

        console.log('Status de la respuesta:', response.status);
        console.log('Headers de la respuesta:', JSON.stringify(Object.fromEntries([...response.headers]), null, 2));

        const responseText = await response.text();
        console.log('Respuesta del servidor (texto):', responseText);

        try {
            const data = JSON.parse(responseText);
            console.log('Respuesta del servidor (JSON):', JSON.stringify(data, null, 2));
        } catch (parseError) {
            console.error('Error al parsear la respuesta como JSON:', parseError);
        }
    } catch (error) {
        console.error('Error en la prueba:', error);
        if (error.response) {
            console.error('Status del error:', error.response.status);
            console.error('Headers del error:', error.response.headers);
            try {
                const errorText = await error.response.text();
                console.error('Respuesta de error (texto):', errorText);
                const errorData = JSON.parse(errorText);
                console.error('Respuesta de error (JSON):', errorData);
            } catch (parseError) {
                console.error('Error al parsear la respuesta de error:', parseError);
            }
        }
    }
}

testRegister(); 