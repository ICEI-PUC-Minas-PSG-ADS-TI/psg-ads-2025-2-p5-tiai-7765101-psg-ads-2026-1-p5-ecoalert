import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useWeather } from "../../hooks/useWeather";
import { Text } from "../Text/Text";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";


export function WindChart({ latitude, longitude, hoursToShow = 24, period = '24h' }) {
  const theme = useTheme();
  const { data, loading, error, refetch } = useWeather(latitude, longitude, period);

  const chartColors = {
    text: theme.palette.text.primary,
    grid: theme.palette.text.secondary,
    primary: theme.palette.primary.main,
    warning: theme.palette.warning.main,
    background: theme.palette.background.paper,
  };

  if (loading && data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="h6">
          Erro ao carregar ventos: {error}
        </Typography>
        <button onClick={refetch} style={{ marginTop: "1rem" }}>
          Tentar novamente
        </button>
      </Box>
    );
  }

  const safeHours = Math.min(hoursToShow, data.length || hoursToShow);
  const displayData = data.slice(-safeHours);
  const rangeLabel = hoursToShow >= 24 ? "Ultimas 24 horas" : `Ultimas ${hoursToShow} horas`;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Text variant="body2" sx={{ fontWeight: 600 }}>
          Velocidade e Rajadas de Vento ({rangeLabel})
        </Text>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Unidade de medida: km/h
        </Text>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={displayData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.2} />
              <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0} />
            </linearGradient>
          </defs>

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
            label={{
              value: "Velocidade (km/h)",
              angle: -90,
              position: "insideLeft",
              fill: chartColors.text,
            }}
            tick={{ fill: chartColors.text, fontSize: 12 }}
            axisLine={{ stroke: chartColors.text }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.background,
              border: `1px solid ${chartColors.grid}`,
              borderRadius: "4px",
              color: chartColors.text,
            }}
            labelStyle={{ color: chartColors.text }}
            formatter={(value) => `${value.toFixed(1)} km/h`}
          />
          
          <Legend wrapperStyle={{ paddingTop: "20px", color: chartColors.text }} />

          <Area
            type="monotone"
            dataKey="windGusts"
            name="Rajadas"
            stroke={chartColors.warning}
            fill="url(#gustGradient)"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />

          <Area
            type="monotone"
            dataKey="windSpeed"
            name="Velocidade Média"
            stroke={chartColors.primary}
            fill="url(#windGradient)"
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 2 }}>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Próxima atualização: dentro de 1 hora
        </Text>
      </Box>
    </Box>
  );
}