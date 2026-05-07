import { useState, useEffect } from 'react';
import { fetchForecastData } from '../services/weatherService';

export function useForecast(latitude = null, longitude = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadForecastData = async () => {
    try {
      setLoading(true);
      setError(null);
      const forecastData = await fetchForecastData(latitude, longitude);
      setData(forecastData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar previsao climatica');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecastData();

    const interval = setInterval(loadForecastData, 3600000);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { data, loading, error, refetch: loadForecastData };
}
