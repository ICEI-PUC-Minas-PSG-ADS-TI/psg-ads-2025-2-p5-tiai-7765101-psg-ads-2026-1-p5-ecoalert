import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
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
    if (!isLocationReady) return;

    let isMounted = true;

    async function loadSensors() {
      setIsLoading(true);

      try {
        const data = await fetchSensors({
          page,
          perPage: PER_PAGE,
          ...locationParams,
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
  }, [isLocationReady, locationParams, page]);

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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <LegendItem color={theme.palette.success.main} label={`${onlineCount} Online`} />
            <LegendItem color={theme.palette.error.main} label={`${offlineCount} Offline`} />
          </Box>
        </Box>

        <TableContainer
          sx={{
            maxHeight: { xs: 520, lg: 380 },
            overflowX: 'auto',
          }}
        >
          <Table stickyHeader aria-label="Tabela de status dos sensores" sx={{ minWidth: 780 }}>
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
              {sensors.map((sensor) => {
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
