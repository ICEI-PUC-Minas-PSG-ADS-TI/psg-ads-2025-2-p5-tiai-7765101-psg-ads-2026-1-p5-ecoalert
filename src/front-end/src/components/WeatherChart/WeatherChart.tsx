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
  ReferenceDot,
} from "recharts";
import { Text } from "../Text/Text";
import "./style.css";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { getWeatherPeriodLabel } from "@/utils/weatherPeriods";

interface WeatherChartProps {
  data?: any[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  period?: string;
}

export function WeatherChart({
  data = [],
  loading = false,
  error = null,
  onRetry,
  period = "24h",
}: WeatherChartProps) {
  const theme = useTheme();

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
        <button onClick={onRetry} style={{ marginTop: "1rem" }}>
          Tentar novamente
        </button>
      </Box>
    );
  }

  const displayData = data;

  if (displayData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 320,
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Text variant="body2" sx={{ color: "text.secondary" }}>
          Sem dados para o período selecionado
        </Text>
      </Box>
    );
  }

  const peakPoint = displayData.reduce((max, point) => {
    if (typeof point.temperature !== "number") {
      return max;
    }

    if (!max || point.temperature > max.temperature) {
      return point;
    }

    return max;
  }, null);
  const rangeLabel = getWeatherPeriodLabel(period);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Text variant="body2" sx={{ fontWeight: 600 }}>
          Temperatura ({rangeLabel})
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
            dataKey="label"
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
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
            }}
            labelStyle={{ color: chartColors.text }}
            formatter={(value) => (typeof value === "number" ? `${value.toFixed(1)}°C` : value)}
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
          {peakPoint && (
            <ReferenceDot
              x={peakPoint.label}
              y={peakPoint.temperature}
              r={6}
              fill={chartColors.line}
              stroke="#FFFFFF"
              strokeWidth={2}
              label={{
                value: `Pico ${peakPoint.temperature.toFixed(1)}°C`,
                position: "top",
                fill: chartColors.text,
                fontSize: 12,
              }}
            />
          )}
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
