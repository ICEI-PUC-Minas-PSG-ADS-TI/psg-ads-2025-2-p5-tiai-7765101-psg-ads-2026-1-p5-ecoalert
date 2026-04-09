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
export async function fetchWeatherData() {
  try {
    const { startDate, endDate } = getLast24HoursDates();

    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/weather/archive`, {
      params: {
        latitude: BELO_HORIZONTE.latitude,
        longitude: BELO_HORIZONTE.longitude,
        start_date: startDate,
        end_date: endDate,
        hourly: 'temperature_2m'
      },
      headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZjhlYjhhOC1mYmI3LTRkZTMtYTZhYi0yZmMxNWZiZWRkYmQiLCJlbWFpbCI6InNhbXVlbC5tYWlhM0BlbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3NTY5OTQ4NywiZXhwIjoxNzc1Nzg1ODg3fQ.vUWqMeBeBIZR0LXuVz_aIAqOtHwIazlkGFmKvLuF5KI"
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
      temperature: hourly.temperature_2m[index]
    }));

    return formattedData;
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error.data);
    throw error;
  }
}
