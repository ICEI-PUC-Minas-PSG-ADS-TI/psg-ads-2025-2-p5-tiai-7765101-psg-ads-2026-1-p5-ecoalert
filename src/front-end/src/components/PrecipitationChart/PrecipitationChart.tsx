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
  hoursToShow?: number;
}

export function PrecipitationChart({ latitude, longitude, hoursToShow = 24 }: PrecipitationChartProps) {
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

  const safeHours = Math.min(hoursToShow, data.length || hoursToShow);
  const displayData = data.slice(-safeHours);
  const totalPrecipitation = displayData.reduce((sum, point) => sum + (point.precipitation || 0), 0);
  const rangeLabel = hoursToShow >= 24 ? "Ultimas 24 horas" : `Ultimas ${hoursToShow} horas`;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Text variant="body2" sx={{ fontWeight: 600 }}>
          Precipitacao ({rangeLabel})
        </Text>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Volume acumulado: {totalPrecipitation.toFixed(1)} mm
        </Text>
      </Box>
      {totalPrecipitation <= 0 ? (
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
            Sem registro de chuva
          </Text>
        </Box>
      ) : (
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
                value: "Precipitacao (mm)",
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
              name="Nivel de Alerta"
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
              name="Nivel de Perigo"
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
              name="Precipitacao"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <Box sx={{ mt: 2 }}>
        <Text variant="caption" sx={{ color: "text.secondary" }}>
          Próxima atualização: dentro de 1 hora
        </Text>
      </Box>
    </Box>
  );
}
