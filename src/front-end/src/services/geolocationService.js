export async function requestGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não disponível neste navegador');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      () => resolve(null),
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

export async function getCoordinatesFromAddress( address ) {

  if(!address || (!address.street && !address.cep)){
    return null
  }
  
  try {
    const street = address.street || '';
    const neighborhood = address.neighborhood || '';
    const city = address.city || 'Belo Horizonte';
    const state = address.state || 'Minas Gerais';
    
    const search = street 
      ? `${street}, ${neighborhood}, ${city}, ${state}, Brazil` 
      : `${address.cep}, Brazil`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`, 
      {
        headers: {
          'User-Agent': 'EcoAlert-PUC-Minas'
        }
      }
    );

    const data = await response.json();
    
    if (data && data.length > 0) {
      console.log(`Localização encontrada via Endereço: ${data[0].display_name}`);
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  }
  catch (error) {
    console.error('Erro ao obter coordenadas a partir do endereço:', error);
    return null;
  }
}
