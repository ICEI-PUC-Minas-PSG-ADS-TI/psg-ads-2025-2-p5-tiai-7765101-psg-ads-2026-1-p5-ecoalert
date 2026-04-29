/**
 * Service para solicitar e obter permissão de geolocalização do navegador
 */

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
      (error) => {
        console.warn('Erro ao obter localização:', error.message);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Converte endereço para coordenadas aproximadas usando geocoding reverso simples
 * Nota: Para produção, considere usar um serviço como Google Maps Geocoding
 */
export async function getCoordinatesFromAddress(address) {
  try {
    // Para agora, retornamos null - em produção usar um serviço de geocoding
    // como nominatim.openstreetmap.org ou Google Maps API
    return null;
  } catch (error) {
    console.error('Erro ao converter endereço em coordenadas:', error);
    return null;
  }
}
