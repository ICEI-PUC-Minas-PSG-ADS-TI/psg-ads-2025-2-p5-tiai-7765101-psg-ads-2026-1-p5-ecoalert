import { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';

export function usePrecipitation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrecipitationData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await fetchWeatherData();
      setData(weatherData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados climáticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrecipitationData();
  }, []);

  return { data, loading, error, refetch: loadPrecipitationData };
}
