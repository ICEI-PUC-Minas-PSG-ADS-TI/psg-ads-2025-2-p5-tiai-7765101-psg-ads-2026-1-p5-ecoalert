import {
  Box,
  Card,
  CardContent,
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

const sensors = [
  { id: 'SNS-001', location: 'Savassi', status: 'online', battery: 92, updatedAt: 'Há 2 min' },
  { id: 'SNS-002', location: 'Lourdes', status: 'online', battery: 78, updatedAt: 'Há 3 min' },
  { id: 'SNS-003', location: 'Funcionários', status: 'online', battery: 85, updatedAt: 'Há 1 min' },
  { id: 'SNS-004', location: 'Santa Efigênia', status: 'offline', battery: 42, updatedAt: 'Há 2h' },
  { id: 'SNS-005', location: 'Floresta', status: 'online', battery: 95, updatedAt: 'Há 4 min' },
  { id: 'SNS-006', location: 'Santa Tereza', status: 'online', battery: 67, updatedAt: 'Há 2 min' },
  { id: 'SNS-007', location: 'Pampulha', status: 'online', battery: 88, updatedAt: 'Há 5 min' },
  { id: 'SNS-008', location: 'Cidade Nova', status: 'online', battery: 73, updatedAt: 'Há 6 min' },
  { id: 'SNS-009', location: 'Sagrada Família', status: 'online', battery: 64, updatedAt: 'Há 8 min' },
  { id: 'SNS-010', location: 'Buritis', status: 'online', battery: 21, updatedAt: 'Há 9 min' },
  { id: 'SNS-011', location: 'Belvedere', status: 'online', battery: 58, updatedAt: 'Há 10 min' },
  { id: 'SNS-012', location: 'Mangabeiras', status: 'online', battery: 99, updatedAt: 'Há 1 min' },
  { id: 'SNS-013', location: 'Serra', status: 'online', battery: 81, updatedAt: 'Há 7 min' },
  { id: 'SNS-014', location: 'Anchieta', status: 'offline', battery: 38, updatedAt: 'Há 58 min' },
  { id: 'SNS-015', location: 'Prado', status: 'online', battery: 76, updatedAt: 'Há 3 min' },
  { id: 'SNS-016', location: 'Gutierrez', status: 'online', battery: 24, updatedAt: 'Há 11 min' },
  { id: 'SNS-017', location: 'Carlos Prates', status: 'online', battery: 87, updatedAt: 'Há 5 min' },
  { id: 'SNS-018', location: 'Caiçara', status: 'online', battery: 69, updatedAt: 'Há 12 min' },
  { id: 'SNS-019', location: 'Castelo', status: 'online', battery: 18, updatedAt: 'Há 14 min' },
  { id: 'SNS-020', location: 'Ouro Preto', status: 'online', battery: 91, updatedAt: 'Há 2 min' },
  { id: 'SNS-021', location: 'Venda Nova', status: 'online', battery: 66, updatedAt: 'Há 4 min' },
  { id: 'SNS-022', location: 'Barreiro', status: 'online', battery: 72, updatedAt: 'Há 6 min' },
  { id: 'SNS-023', location: 'Horto', status: 'online', battery: 83, updatedAt: 'Há 3 min' },
  { id: 'SNS-024', location: 'Dona Clara', status: 'online', battery: 60, updatedAt: 'Há 8 min' },
];

export default function Sensores() {
  const theme = useTheme();

  const onlineCount = sensors.filter((sensor) => sensor.status === 'online').length;
  const offlineCount = sensors.length - onlineCount;
  const lowBatteryCount = sensors.filter((sensor) => sensor.battery <= 25).length;

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
          value={sensors.length}
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          gap={1.5}
          sx={{ p: { xs: 2, sm: 3 } }}
        >
          <Text variant="subtitle1" weight={700}>
            Status dos Sensores
          </Text>

          <Stack direction="row" spacing={2} alignItems="center">
            <LegendItem color={theme.palette.success.main} label={`${onlineCount} Online`} />
            <LegendItem color={theme.palette.error.main} label={`${offlineCount} Offline`} />
          </Stack>
        </Stack>

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
