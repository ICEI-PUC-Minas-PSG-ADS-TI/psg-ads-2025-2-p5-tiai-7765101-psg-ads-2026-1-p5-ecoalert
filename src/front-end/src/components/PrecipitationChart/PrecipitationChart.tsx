import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { usePrecipitation } from "../../hooks/usePrecipitation";
import { Text } from "../Text/Text";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

interface PrecipitationChartProps {
  latitude?: number | null;
  longitude?: number | null;
}

export function PrecipitationChart({ latitude, longitude }: PrecipitationChartProps) {
  const theme = useTheme();
  const { data, loading, error, refetch } = usePrecipitation(latitude, longitude);

  const chartColors = {
    text: theme.palette.text.primary,
    grid: theme.palette.text.secondary,
    bar: theme.palette.info.main,
    background: theme.palette.background.paper,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };

  const ALERT_LEVEL = 0.5;
  const DANGER_LEVEL = 0.8;

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
        <Text variant="body2" sx={{ fontWeight: 600 }}>
          Precipitação (Últimas 24 horas)
        </Text>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Atualiza automaticamente a cada 1 hora
        </Text>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
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
            label={{
              value: "Precipitação (mm)",
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
            formatter={(value) => {
              if (typeof value === "number") {
                return `${value.toFixed(2)} mm`;
              }
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px", color: chartColors.text }}
          />
          <ReferenceLine
            y={ALERT_LEVEL}
            stroke={chartColors.warning}
            strokeDasharray="5 5"
            strokeWidth={2}
            name="Nível de Alerta"
            label={{
              value: `Alerta: ${ALERT_LEVEL}mm`,
              position: "top",
              fill: chartColors.warning,
              fontSize: 11,
              offset: 5,
            }}
          />
          <ReferenceLine
            y={DANGER_LEVEL}
            stroke={chartColors.error}
            strokeDasharray="5 5"
            strokeWidth={2}
            name="Nível de Perigo"
            label={{
              value: `Perigo: ${DANGER_LEVEL}mm`,
              position: "top",
              fill: chartColors.error,
              fontSize: 11,
              offset: 5,
            }}
          />
          <Bar
            dataKey="precipitation"
            fill={chartColors.bar}
            name="Precipitação"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 2 }}>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Próxima atualização: dentro de 1 hora
        </Text>
      </Box>
    </Box>
  );
}
