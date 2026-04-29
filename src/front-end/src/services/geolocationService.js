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
  return null;
}
