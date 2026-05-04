import { api } from '../api/api';

const BELO_HORIZONTE = {
  latitude: -19.8267,
  longitude: -43.9445
};

function getLast24HoursDates() {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

  const formatDate = (date) => date.toISOString().split('T')[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}
export async function fetchWeatherData(latitude = null, longitude = null) {
  try {
    const { startDate, endDate } = getLast24HoursDates();
    
    const coords = latitude && longitude 
      ? { latitude, longitude }
      : BELO_HORIZONTE;

    const response = await api.get('/weather/archive', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        start_date: startDate,
        end_date: endDate,
        hourly: 'temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m'
  }
    });

    const { hourly } = response.data;
    const formattedData = hourly.time.map((time, index) => ({
      time: new Date(time).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      fullTime: time,
      temperature: hourly.temperature_2m[index],
      precipitation: hourly.precipitation[index] || 0,
      windSpeed: hourly.wind_speed_10m[index],
      windGusts: hourly.wind_gusts_10m[index]
    }));

    return formattedData;
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error.data);
    throw error;
  }
}
