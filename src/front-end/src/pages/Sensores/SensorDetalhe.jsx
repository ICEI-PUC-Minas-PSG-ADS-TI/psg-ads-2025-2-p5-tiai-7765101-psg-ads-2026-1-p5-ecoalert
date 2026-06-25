import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Icon } from '@/components/Icon/Icon';
import { Text } from '@/components/Text/Text';
import { fetchSensorById } from '@/services/sensorService';

const SENSOR_TYPE_LABELS = {
  RAIN: 'Chuva',
  RIVER_LEVEL: 'Nivel do rio',
  SOIL_MOISTURE: 'Umidade do solo',
  WEATHER: 'Clima',
  TEMPERATURE: 'Temperatura',
  HUMIDITY: 'Umidade',
};

const STATUS_LABELS = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  MAINTENANCE: 'Manutencao',
  OFFLINE: 'Offline',
};

export default function SensorDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const measurements = useMemo(() => {
    return [...(sensor?.measurementsHistory ?? [])].reverse();
  }, [sensor]);

  useEffect(() => {
    let isMounted = true;

    async function loadSensor() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchSensorById(id);
        if (isMounted) setSensor(data);
      } catch {
        if (isMounted) setError('Nao foi possivel carregar este sensor.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSensor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const statusColor = sensor ? getStatusColor(sensor.status, theme) : theme.palette.text.secondary;
  const batteryColor = sensor ? getBatteryColor(sensor.batery, sensor.status, theme) : theme.palette.text.secondary;
  const mutedSurface = theme.palette.mode === 'dark' ? '#101316' : '#F8FAFC';

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 360 }}>
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (error || !sensor) {
    return (
      <Stack spacing={2}>
        <Button
          variant="text"
          startIcon={<Icon name="arrow-left" size={18} />}
          onClick={() => navigate('/sensores')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Voltar
        </Button>
        <Alert severity="error">{error || 'Sensor nao encontrado.'}</Alert>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1.5}>
        <Box>
          <Button
            variant="text"
            startIcon={<Icon name="arrow-left" size={18} />}
            onClick={() => navigate('/sensores')}
            sx={{ mb: 1, px: 0 }}
          >
            Voltar
          </Button>
          <Text variant="h5" weight={700}>
            {sensor.name}
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {sensor.id}
          </Text>
        </Box>

        <StatusPill color={statusColor} label={STATUS_LABELS[sensor.status] ?? sensor.status} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <InfoPanel iconName="radio" label="Tipo" value={SENSOR_TYPE_LABELS[sensor.type] ?? sensor.type} />
        <InfoPanel iconName="battery-medium" label="Bateria" value={formatBattery(sensor.batery)} />
        <InfoPanel iconName="map-pin" label="Endereco" value={sensor.address || sensor.neighborhood || 'Sem endereco'} />
        <InfoPanel iconName="clock" label="Ultima comunicacao" value={formatDateTime(sensor.lastCommunicationAt)} />
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          gap={2}
          sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Box>
            <Text variant="subtitle1" weight={700}>
              Localizacao
            </Text>
            <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Latitude {formatCoordinate(sensor.latitude)} | Longitude {formatCoordinate(sensor.longitude)}
            </Text>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <LinearProgress
              variant="determinate"
              value={sensor.batery ?? 0}
              sx={{
                width: 96,
                height: 6,
                borderRadius: 999,
                backgroundColor: alpha(batteryColor, 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  backgroundColor: batteryColor,
                },
              }}
            />
            <Text variant="caption" sx={{ color: 'text.secondary', minWidth: 42 }}>
              {formatBattery(sensor.batery)}
            </Text>
          </Stack>
        </Stack>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Text variant="subtitle1" weight={700} sx={{ mb: 2 }}>
            Histórico de medições
          </Text>

          <TableContainer sx={{ maxHeight: 420, overflowX: 'auto' }}>
            <Table stickyHeader aria-label="Histórico de medições" sx={{ minWidth: 620 }}>
              <TableHead>
                <TableRow>
                  {['Momento', 'Valor', 'Unidade'].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        backgroundColor: mutedSurface,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                      Nenhuma medicao registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  measurements.map((measurement, index) => (
                    <TableRow key={`${measurement.measuredAt}-${index}`}>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        {formatDateTime(measurement.measuredAt)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider', fontWeight: 700 }}>
                        {formatMeasurementValue(measurement.value)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                        {measurement.unit}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}

function InfoPanel({ iconName, label, value }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        minHeight: 118,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 1,
            display: 'grid',
            placeItems: 'center',
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            flexShrink: 0,
          }}
        >
          <Icon name={iconName} size={19} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Text variant="caption" sx={{ color: 'text.secondary' }}>
            {label}
          </Text>
          <Text variant="body1" weight={700} sx={{ mt: 0.25, overflowWrap: 'anywhere' }}>
            {value}
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
}

function StatusPill({ color, label }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
      <Text variant="body2" weight={700} sx={{ color }}>
        {label}
      </Text>
    </Stack>
  );
}

function getStatusColor(status, theme) {
  if (status === 'ACTIVE') return theme.palette.success.main;
  if (status === 'OFFLINE') return theme.palette.error.main;
  if (status === 'MAINTENANCE') return theme.palette.warning.main;
  return theme.palette.text.secondary;
}

function getBatteryColor(battery, status, theme) {
  if (status === 'OFFLINE') return theme.palette.error.main;
  if (battery === null || battery === undefined) return theme.palette.text.secondary;
  if (battery <= 25) return theme.palette.warning.main;
  return theme.palette.success.main;
}

function formatBattery(battery) {
  if (battery === null || battery === undefined) return 'Sem dado';
  return `${battery}%`;
}

function formatCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(6) : 'indisponivel';
}

function formatMeasurementValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return String(number).replace('.', ',');
}

function formatDateTime(value) {
  if (!value) return 'Sem registro';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sem registro';

  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
