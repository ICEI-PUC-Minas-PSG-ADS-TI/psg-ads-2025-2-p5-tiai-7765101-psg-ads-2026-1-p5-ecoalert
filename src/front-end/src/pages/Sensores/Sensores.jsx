import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Icon } from '@/components/Icon/Icon';
import { Text } from '@/components/Text/Text';
import { requestGeolocation } from '@/services/geolocationService';
import { fetchSensors } from '@/services/sensorService';

const PER_PAGE = 20;
const EMPTY_SUMMARY = {
  online: 0,
  offline: 0,
  lowBattery: 0,
};

export default function Sensores() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [sensors, setSensors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: PER_PAGE,
    total: 0,
    totalPages: 1,
    summary: EMPTY_SUMMARY,
  });
  const [locationParams, setLocationParams] = useState({});
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [cepFilter, setCepFilter] = useState('');
  const [cepError, setCepError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      try {
        const location = await requestGeolocation();

        if (!isMounted) return;
        setLocationParams(location ? {
          latitude: location.latitude,
          longitude: location.longitude,
        } : {});
      } catch {
        if (isMounted) setLocationParams({});
      } finally {
        if (isMounted) setIsLocationReady(true);
      }
    }

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLocationReady && !cepFilter) return;

    let isMounted = true;

    async function loadSensors() {
      setIsLoading(true);
      setFetchError('');

      try {
        const data = await fetchSensors({
          page,
          perPage: PER_PAGE,
          ...(cepFilter ? { cep: cepFilter } : locationParams),
        });

        if (!isMounted) return;

        const total = Number(data.total ?? 0);
        const responsePerPage = Number(data.perPage ?? PER_PAGE);
        const totalPages = Math.max(1, Number(data.totalPages ?? Math.ceil(total / responsePerPage)));

        setSensors((data.items ?? []).map(mapSensorToTable));
        setPagination({
          page: Number(data.page ?? page),
          perPage: responsePerPage,
          total,
          totalPages,
          summary: normalizeSummary(data.summary),
        });
      } catch {
        if (!isMounted) return;

        setFetchError(
          cepFilter
            ? 'Nao foi possivel encontrar sensores para este CEP.'
            : 'Nao foi possivel carregar os sensores.'
        );
        setSensors([]);
        setPagination({
          page,
          perPage: PER_PAGE,
          total: 0,
          totalPages: 1,
          summary: EMPTY_SUMMARY,
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSensors();

    return () => {
      isMounted = false;
    };
  }, [cepFilter, isLocationReady, locationParams, page]);

  const pageCount = Math.max(1, pagination.totalPages);
  const visiblePage = Math.min(page, pageCount);
  const rangeStart = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.perPage + 1;
  const rangeEnd = Math.min(pagination.page * pagination.perPage, pagination.total);
  const onlineCount = pagination.summary.online;
  const offlineCount = pagination.summary.offline;
  const lowBatteryCount = pagination.summary.lowBattery;

  const handlePageChange = (_event, value) => {
    setPage(value);
  };

  const handleCepChange = (event) => {
    setCepInput(formatCep(event.target.value));
    setCepError('');
  };

  const handleCepSearch = (event) => {
    event.preventDefault();

    const normalized = normalizeCep(cepInput);

    if (!normalized) {
      setCepFilter('');
      setCepError('');
      setFetchError('');
      setPage(1);
      return;
    }

    if (normalized.length !== 8) {
      setCepError('Informe um CEP com 8 digitos.');
      return;
    }

    setCepError('');
    setFetchError('');
    setPage(1);
    setCepFilter(normalized);
  };

  const handleCepClear = () => {
    setCepInput('');
    setCepFilter('');
    setCepError('');
    setFetchError('');
    setPage(1);
  };

  const statusColors = {
    online: theme.palette.success.main,
    offline: theme.palette.error.main,
  };

  const surfaceColor = theme.palette.mode === 'dark' ? '#0B0D0F' : theme.palette.background.paper;
  const mutedSurface = theme.palette.mode === 'dark' ? '#101316' : '#F8FAFC';

  const getBatteryColor = (battery, status) => {
    if (status === 'offline') return theme.palette.error.main;
    if (battery <= 25) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
      }}
    >
      <Box>
        <Text variant="h5" weight={700}>
          Sensores
        </Text>
        <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Monitoramento e gerenciamento de sensores
        </Text>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <StatCard
          iconName="radio"
          label="Total de Sensores"
          value={pagination.total}
          color={theme.palette.secondary.light}
          background={alpha(theme.palette.secondary.main, 0.14)}
        />
        <StatCard
          iconName="wifi"
          label="Online"
          value={onlineCount}
          color={theme.palette.success.main}
          background={alpha(theme.palette.success.main, 0.14)}
        />
        <StatCard
          iconName="wifi-off"
          label="Offline"
          value={offlineCount}
          color={theme.palette.error.main}
          background={alpha(theme.palette.error.main, 0.14)}
        />
        <StatCard
          iconName="battery-low"
          label="Bateria Baixa"
          value={lowBatteryCount}
          color={theme.palette.warning.main}
          background={alpha(theme.palette.warning.main, 0.15)}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: surfaceColor,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{ p: { xs: 2, sm: 3 } }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1.5}
          flexWrap="wrap"
        >
          <Text variant="subtitle1" weight={700}>
            Status dos Sensores
          </Text>

          <Box
            component="form"
            onSubmit={handleCepSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <TextField
              size="small"
              label="CEP"
              value={cepInput}
              onChange={handleCepChange}
              inputProps={{ inputMode: 'numeric', maxLength: 9 }}
              sx={{ width: { xs: '100%', sm: 150 } }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ minHeight: 40 }}
            >
              Buscar
            </Button>
            {cepFilter ? (
              <Button
                type="button"
                variant="text"
                onClick={handleCepClear}
                disabled={isLoading}
                sx={{ minHeight: 40 }}
              >
                Limpar
              </Button>
            ) : null}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: '100%' }}>
            <LegendItem color={theme.palette.success.main} label={`${onlineCount} Online`} />
            <LegendItem color={theme.palette.error.main} label={`${offlineCount} Offline`} />
          </Box>
        </Box>

        {cepError || fetchError ? (
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2, mt: -1 }}>
            <Text variant="body2" sx={{ color: 'error.main' }}>
              {cepError || fetchError}
            </Text>
          </Box>
        ) : null}

        <TableContainer
          aria-busy={isLoading}
          sx={{
            maxHeight: { xs: 520, lg: 380 },
            minHeight: sensors.length === 0 ? 260 : undefined,
            overflowX: 'auto',
            position: 'relative',
          }}
        >
          <Table
            stickyHeader
            aria-label="Tabela de status dos sensores"
            sx={{
              minWidth: 780,
              opacity: isLoading ? 0.42 : 1,
              transition: 'opacity 180ms ease',
            }}
          >
            <TableHead>
              <TableRow>
                {['ID', 'Localização', 'Status', 'Bateria', 'Última Atualização'].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      backgroundColor: mutedSurface,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                    align={heading === 'Última Atualização' ? 'right' : 'left'}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!isLoading && sensors.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ borderColor: 'divider', color: 'text.secondary', py: 8 }}
                  >
                    Nenhum sensor encontrado
                  </TableCell>
                </TableRow>
              ) : sensors.map((sensor) => {
                const statusColor = statusColors[sensor.status];
                const batteryColor = getBatteryColor(sensor.battery, sensor.status);

                return (
                  <TableRow
                    key={sensor.id}
                    hover
                    onClick={() => navigate(`/sensores/${sensor.id}`)}
                    sx={{
                      '&:last-of-type td': { borderBottom: 0 },
                      '&:hover td': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell sx={{ borderColor: 'divider', color: 'text.primary', fontWeight: 700 }}>
                      {sensor.id}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'divider', color: 'text.primary', fontWeight: 600 }}>
                      {sensor.location}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'divider' }}>
                      <StatusPill
                        color={statusColor}
                        label={sensor.status === 'online' ? 'Online' : 'Offline'}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <LinearProgress
                          variant="determinate"
                          value={sensor.battery}
                          sx={{
                            width: 78,
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: alpha(batteryColor, 0.12),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 999,
                              backgroundColor: batteryColor,
                            },
                          }}
                        />
                        <Text variant="caption" sx={{ color: 'text.secondary', minWidth: 32 }}>
                          {sensor.battery}%
                        </Text>
                      </Stack>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ borderColor: 'divider', color: 'text.secondary', whiteSpace: 'nowrap' }}
                    >
                      {sensor.updatedAt}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {isLoading ? (
            <Box
              role="status"
              aria-live="polite"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: alpha(surfaceColor, 0.82),
                pointerEvents: 'none',
              }}
            >
              <Stack alignItems="center" spacing={1.5}>
                <CircularProgress size={32} />
                <Text variant="body2" weight={600} sx={{ color: 'text.secondary' }}>
                  Carregando sensores...
                </Text>
              </Stack>
            </Box>
          ) : null}
        </TableContainer>

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Text variant="body2" sx={{ color: 'text.secondary' }}>
            {isLoading
              ? 'Carregando sensores...'
              : pagination.total === 0
                ? 'Nenhum sensor encontrado'
                : `Mostrando ${rangeStart}-${rangeEnd} de ${pagination.total} sensores`}
          </Text>

          <Pagination
            count={pageCount}
            page={visiblePage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            disabled={isLoading || pageCount <= 1}
          />
        </Box>
      </Paper>
    </Box>
  );
}

function StatCard({ iconName, label, value, color, background }) {
  return (
    <Card
      elevation={0}
      sx={{
        minHeight: 150,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'none',
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: { xs: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2.5, md: 3 } },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color,
            backgroundColor: background,
            flexShrink: 0,
          }}
        >
          <Icon name={iconName} size={20} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Text variant="h5" weight={800} sx={{ lineHeight: 1.1 }}>
            {value}
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {label}
          </Text>
        </Box>
      </CardContent>
    </Card>
  );
}

function LegendItem({ color, label }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }} />
      <Text variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {label}
      </Text>
    </Stack>
  );
}

function StatusPill({ color, label }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
      <Text variant="body2" weight={600} sx={{ color }}>
        {label}
      </Text>
    </Stack>
  );
}

function normalizeSummary(summary) {
  return {
    online: Number(summary?.online ?? 0),
    offline: Number(summary?.offline ?? 0),
    lowBattery: Number(summary?.lowBattery ?? 0),
  };
}

function normalizeCep(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatCep(value) {
  const digits = normalizeCep(value).slice(0, 8);

  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function mapSensorToTable(sensor) {
  return {
    id: sensor.id,
    location: sensor.address || sensor.neighborhood || sensor.name || formatCoordinates(sensor),
    status: sensor.status === 'ACTIVE' ? 'online' : 'offline',
    battery: sensor.batery ?? 0,
    updatedAt: formatLastUpdate(sensor.lastCommunicationAt || sensor.updatedAt),
  };
}

function formatCoordinates(sensor) {
  const latitude = Number(sensor.latitude);
  const longitude = Number(sensor.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return 'Localização indisponível';
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function formatLastUpdate(value) {
  if (!value) return 'Sem registro';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sem registro';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Há ${diffHours}h`;

  return date.toLocaleDateString('pt-BR');
}
