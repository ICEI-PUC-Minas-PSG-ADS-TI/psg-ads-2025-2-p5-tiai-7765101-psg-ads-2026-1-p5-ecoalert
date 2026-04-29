import { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';

export function useWeather(latitude = null, longitude = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await fetchWeatherData(latitude, longitude);
      setData(weatherData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados climáticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();

    const interval = setInterval(loadWeatherData, 3600000);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { data, loading, error, refetch: loadWeatherData };
}
