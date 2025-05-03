const API_URL = 'https://web-production-aea20.up.railway.app/api/mascotas';

export const getMascotas = () => fetch(API_URL).then(res => res.json());

export const addMascota = async (data) => {
  try {
    console.log('=== DEBUG: Inicio de addMascota ===');
    console.log('Datos recibidos:', data);

    // Validación de campos requeridos
    const camposRequeridos = ['nombre', 'especie', 'edad', 'raza', 'tamaño', 'ubicacion'];
    const camposFaltantes = camposRequeridos.filter(campo => !data[campo]);
    
    if (camposFaltantes.length > 0) {
      throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`);
    }

    // Validación de tipos de datos
    if (typeof data.edad !== 'number' || data.edad < 0) {
      throw new Error('La edad debe ser un número positivo');
    }

    // Validación de tamaño
    const tamanosPermitidos = ['Pequeño', 'Mediano', 'Grande'];
    if (!tamanosPermitidos.includes(data.tamaño)) {
      throw new Error(`El tamaño debe ser uno de: ${tamanosPermitidos.join(', ')}`);
    }

    // Validación de estado si se proporciona
    if (data.estado) {
      const estadosPermitidos = ['Disponible', 'Adoptado'];
      if (!estadosPermitidos.includes(data.estado)) {
        throw new Error(`El estado debe ser uno de: ${estadosPermitidos.join(', ')}`);
      }
    }

    // Validación de URL de imagen si se proporciona
    if (data.imagen_url && !data.imagen_url.startsWith('http')) {
      throw new Error('La URL de la imagen debe comenzar con http');
    }

    // Convertir booleanos
    const datosEnviar = {
      ...data,
      vacunado: Boolean(data.vacunado),
      desparasitado: Boolean(data.desparasitado)
    };

    console.log('Datos a enviar:', JSON.stringify(datosEnviar, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(datosEnviar)
    });
    
    console.log('Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error detallado:', {
        status: response.status,
        data: responseData
      });
      
      if (response.status === 500) {
        throw new Error('Error en el servidor. Por favor, intente nuevamente más tarde.');
      } else if (response.status === 400) {
        throw new Error(responseData.message || 'Datos inválidos. Por favor, verifique la información ingresada.');
      } else {
        throw new Error(responseData.message || 'Error al registrar mascota');
      }
    }
    
    console.log('Respuesta exitosa:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error en addMascota:', error);
    throw error;
  }
};

export const updateMascota = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar mascota');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error en updateMascota:', error);
    throw error;
  }
};

export const deleteMascota = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar mascota');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error en deleteMascota:', error);
    throw error;
  }
}; 