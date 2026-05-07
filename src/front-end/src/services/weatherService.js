import { api } from '../api/api';

const BELO_HORIZONTE = {
  latitude: -19.8267,
  longitude: -43.9445
};

function getDateRange(daysBack = 1) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

  const formatDate = (date) => date.toISOString().split('T')[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}

function getDaysForPeriod(period) {
  if (period === '7d') {
    return 7;
  }

  return 1;
}

export async function fetchWeatherData(latitude = null, longitude = null, period = '24h') {
  try {
    const daysBack = getDaysForPeriod(period);
    const { startDate, endDate } = getDateRange(daysBack);
    
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

export async function fetchForecastData(latitude = null, longitude = null) {
  try {
    const coords = latitude && longitude
      ? { latitude, longitude }
      : BELO_HORIZONTE;

    const response = await api.get('/weather/forecast', {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        hourly: [
          'temperature_2m',
          'apparent_temperature',
          'relativehumidity_2m',
          'uv_index',
          'precipitation_probability',
          'precipitation'
        ].join(','),
        forecast_days: 2,
        timezone: 'auto'
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
      apparentTemperature: hourly.apparent_temperature[index],
      relativeHumidity: hourly.relativehumidity_2m[index],
      uvIndex: hourly.uv_index[index],
      precipitationProbability: hourly.precipitation_probability[index] ?? 0,
      precipitation: hourly.precipitation[index] ?? 0
    }));

    return formattedData;
  } catch (error) {
    console.error('Erro ao buscar previsao climatica:', error.data);
    throw error;
  }
}
