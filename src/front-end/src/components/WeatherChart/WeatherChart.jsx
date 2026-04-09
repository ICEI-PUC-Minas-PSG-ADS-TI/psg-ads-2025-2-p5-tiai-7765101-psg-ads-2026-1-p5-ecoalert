import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useWeather } from '../../hooks/useWeather';
import './style.css';

export function WeatherChart() {
  const theme = useTheme();
  const { data, loading, error, refetch } = useWeather();

  const isDarkMode = theme.palette.mode === 'dark';

  // Cores baseadas no tema
  const chartColors = {
    text: isDarkMode ? '#F2F2F2' : '#000000',
    grid: isDarkMode ? '#2a3f5f' : '#e0e0e0',
    line: isDarkMode ? '#60A5FA' : '#3B82F6',
    background: isDarkMode ? '#181E25' : '#F5F5F5'
  };

  if (loading && data.length === 0) {
    return (
      <Box className="weather-chart-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="weather-chart-container" sx={{ p: 2 }}>
        <Typography color="error" variant="h6">
          Erro ao carregar dados: {error}
        </Typography>
        <button onClick={refetch} style={{ marginTop: '1rem' }}>
          Tentar novamente
        </button>
      </Box>
    );
  }

  // Pega apenas os últimos 24 dados
  const displayData = data.slice(-24);

  return (
    <Box className="weather-chart-container">
      <Box className="weather-chart-header">
        <Typography variant="h5" className="weather-chart-title">
          Temperatura em Belo Horizonte (Últimas 24 horas)
        </Typography>
        <Typography variant="caption" className="weather-chart-subtitle">
          Atualiza automaticamente a cada 1 hora
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={displayData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: chartColors.text, fontSize: 12 }}
            axisLine={{ stroke: chartColors.text }}
          />
          <YAxis
            label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft', fill: chartColors.text }}
            tick={{ fill: chartColors.text, fontSize: 12 }}
            axisLine={{ stroke: chartColors.text }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.background,
              border: `1px solid ${chartColors.grid}`,
              borderRadius: '4px',
              color: chartColors.text
            }}
            labelStyle={{ color: chartColors.text }}
            formatter={(value) => `${value.toFixed(1)}°C`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px', color: chartColors.text }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={chartColors.line}
            dot={false}
            strokeWidth={2}
            name="Temperatura"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      <Box className="weather-chart-footer">
        <Typography variant="caption" className="weather-chart-update-time">
          Próxima atualização: dentro de 1 hora
        </Typography>
      </Box>
    </Box>
  );
}
