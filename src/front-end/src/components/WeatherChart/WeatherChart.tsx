import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
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
import "./style.css";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

interface WeatherChartProps {
  latitude?: number | null;
  longitude?: number | null;
}

export function WeatherChart({ latitude, longitude }: WeatherChartProps) {
  const theme = useTheme();
  const { data, loading, error, refetch } = useWeather(latitude, longitude);

  const chartColors = {
    text: theme.palette.text.primary,
    grid: theme.palette.text.secondary,
    line: theme.palette.primary.main,
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
          Erro ao carregar dados: {error}
        </Typography>
        <button onClick={refetch} style={{ marginTop: "1rem" }}>
          Tentar novamente
        </button>
      </Box>
    );
  }

  const displayData = data.slice(-24);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Text variant="h5" sx={{ fontWeight: 600 }}>
          Temperatura (Últimas 24 horas)
        </Text>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Atualiza automaticamente a cada 1 hora
        </Text>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={displayData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.line}
                stopOpacity={0.3}
              />
              <stop offset="95%" stopColor={chartColors.line} stopOpacity={0} />
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
              value: "Temperatura (°C)",
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
            formatter={(value) => `${value.toFixed(1)}°C`}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px", color: chartColors.text }}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={chartColors.line}
            fill="url(#revenueGradient)"
            strokeWidth={2}
            dot={false}
            name="Temperatura"
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
