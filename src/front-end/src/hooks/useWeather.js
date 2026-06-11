import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '../services/weatherService';

export function useWeather(latitude = null, longitude = null, period = '24h') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = useCallback(async ({ reset = false } = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (reset) {
        setData([]);
      }

      const weatherData = await fetchWeatherData(latitude, longitude, period);
      setData(weatherData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados climáticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, period]);

  useEffect(() => {
    loadWeatherData({ reset: true });

    const interval = setInterval(loadWeatherData, 3600000);

    return () => clearInterval(interval);
  }, [loadWeatherData]);

  return { data, loading, error, refetch: loadWeatherData };
}
