import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { WeatherChart } from '@/components/WeatherChart/WeatherChart';
import { PrecipitationChart } from '@/components/PrecipitationChart/PrecipitationChart';
import { WindChart } from '@/components/WindChart/WindChart';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from '@mui/material';
import { Text } from '@/components/Text/Text';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { requestGeolocation, getCoordinatesFromAddress } from '@/services/geolocationService';

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState(null);
  const [locationSource, setLocationSource] = useState('default');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [filters, setFilters] = useState({ period: '24h', metric: 'temperatura' });
  const [appliedFilters, setAppliedFilters] = useState({ period: '24h', metric: 'temperatura' });

  const { data: weatherData } = useWeather(
    coordinates?.latitude,
    coordinates?.longitude,
    appliedFilters.period
  );


  useEffect(() => {
    const initializeLocation = async () => {
      setLoadingLocation(true);

      try{
        const geoLocation = await requestGeolocation();

        if (geoLocation) {
          setCoordinates(geoLocation);
          setLocationSource('gps');
        } else if (user?.address) {
          const addressLocation = await getCoordinatesFromAddress(user.address);

          if(addressLocation) {
            setCoordinates(addressLocation);
            setLocationSource('address');
          }
          else {
            setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
            setLocationSource('default');
          }
        } else {
          setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
          setLocationSource('default');
        }
        
      }
      catch (error){
        console.error("Erro ao definir localização:", error);
        setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
      }
      finally {
        setLoadingLocation(false);
      }
    };

    initializeLocation();
  }, [user]);

  const locationMessage = {
    gps: 'Monitorando sua localização via GPS',
    address: `Monitorando seu bairro: ${user?.address?.neighborhood ||  'cadastrado'}`,
    default: 'Exibindo dados gerais de Belo Horizonte'
  }

  const cityName = user?.address?.city || 'Belo Horizonte';

  const hoursByPeriod = {
    '6h': 6,
    '12h': 12,
    '24h': 24,
    '7d': 168,
  };

  const hoursToShow = hoursByPeriod[appliedFilters.period] || 24;
  const scopedWeatherData = useMemo(
    () => weatherData.slice(-Math.min(hoursToShow, weatherData.length || hoursToShow)),
    [weatherData, hoursToShow]
  );

  const temperatureValues = useMemo(
    () => scopedWeatherData.map((point) => point.temperature).filter((value) => typeof value === 'number'),
    [scopedWeatherData]
  );

  const currentTemp = temperatureValues.length ? temperatureValues[temperatureValues.length - 1] : null;
  const maxTemp = temperatureValues.length ? Math.max(...temperatureValues) : null;
  const minTemp = temperatureValues.length ? Math.min(...temperatureValues) : null;

  const totalRain = useMemo(
    () => scopedWeatherData.reduce((sum, point) => sum + (point.precipitation || 0), 0),
    [scopedWeatherData]
  );

  const maxWindGust = useMemo(
    () => scopedWeatherData.reduce((max, point) => Math.max(max, point.windGusts || 0), 0),
    [scopedWeatherData]
  );

  const peakTime = useMemo(() => {
    if (!scopedWeatherData.length) return null;
    const peakPoint = scopedWeatherData.reduce((max, point) => {
      if (!max || point.temperature > max.temperature) {
        return point;
      }
      return max;
    }, null);

    if (!peakPoint?.fullTime) return null;
    return new Date(peakPoint.fullTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, [scopedWeatherData]);


  const status = useMemo(() => {
    if (totalRain >= 15 || maxWindGust >= 60) {
      return { label: 'Risco alto', color: theme.palette.error.main };
    }
    if (totalRain >= 5 || maxWindGust >= 40) {
      return { label: 'Atencao', color: theme.palette.warning.main };
    }
    return { label: 'Sem risco', color: theme.palette.success.main };
  }, [totalRain, maxWindGust, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const focusBorder = (metric) =>
    appliedFilters.metric === metric
      ? { borderColor: theme.palette.primary.main, boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.2)' }
      : {};

  const rangeLabel = useMemo(() => {
    if (appliedFilters.period === '7d') return 'Ultimos 7 dias';
    if (appliedFilters.period === '24h') return 'Ultimas 24h';
    if (appliedFilters.period === '12h') return 'Ultimas 12h';
    return 'Ultimas 6h';
  }, [appliedFilters.period]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,116,144,0.08))',
          animation: 'fadeInUp 0.5s ease',
        }}
      >
        <Stack spacing={1}>
          <Text
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(120deg, #1E3A8A 0%, #0E7490 55%, #16A34A 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Central de Monitoramento Climatico - {cityName}
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary' }}>
            {loadingLocation ? 'Buscando sua localizacao...' : locationMessage[locationSource]}
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary' }}>
            {coordinates
              ? 'Dados atualizados para a sua area de monitoramento.'
              : 'Dados atualizados para Belo Horizonte.'}
          </Text>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          animation: 'fadeInUp 0.6s ease',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="period-filter">Periodo</InputLabel>
              <Select
                labelId="period-filter"
                label="Periodo"
                value={filters.period}
                onChange={handleFilterChange('period')}
              >
                <MenuItem value="6h">Ultimas 6h</MenuItem>
                <MenuItem value="12h">Ultimas 12h</MenuItem>
                <MenuItem value="24h">Ultimas 24h</MenuItem>
                <MenuItem value="7d">7 dias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="metric-filter">Metrica</InputLabel>
              <Select
                labelId="metric-filter"
                label="Metrica"
                value={filters.metric}
                onChange={handleFilterChange('metric')}
              >
                <MenuItem value="temperatura">Temperatura</MenuItem>
                <MenuItem value="precipitacao">Precipitacao</MenuItem>
                <MenuItem value="vento">Vento</MenuItem>
                <MenuItem value="umidade">Umidade</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ height: 40, fontWeight: 600 }}
            >
              Aplicar filtros
            </Button>
          </Grid>
        </Grid>
          {appliedFilters.metric === 'umidade' && (
            <Text variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Metrica de umidade sem grafico dedicado no momento.
            </Text>
          )}
      </Paper>

      <Grid container spacing={2} sx={{ animation: 'fadeInUp 0.7s ease' }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ height: '100%', ...focusBorder('temperatura') }}>
            <CardContent>
              <Text variant="caption" sx={{ color: 'text.secondary' }}>
                Temperatura atual
              </Text>
              <Text variant="h4" weight={700}>
                {currentTemp !== null ? `${currentTemp.toFixed(1)}°C` : '--'}
              </Text>
              <Text variant="body2" sx={{ color: 'text.secondary' }}>
                Sensacao em tempo real
              </Text>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ height: '100%', ...focusBorder('temperatura') }}>
            <CardContent>
              <Text variant="caption" sx={{ color: 'text.secondary' }}>
                Maxima e minima
              </Text>
              <Text variant="h4" weight={700}>
                {maxTemp !== null && minTemp !== null
                  ? `${maxTemp.toFixed(1)}° / ${minTemp.toFixed(1)}°`
                  : '--'}
              </Text>
              <Text variant="body2" sx={{ color: 'text.secondary' }}>
                  {rangeLabel}
              </Text>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ height: '100%', ...focusBorder('precipitacao') }}>
            <CardContent>
              <Text variant="caption" sx={{ color: 'text.secondary' }}>
                Volume total de chuva
              </Text>
              <Text variant="h4" weight={700}>
                {totalRain ? `${totalRain.toFixed(1)} mm` : '0 mm'}
              </Text>
              <Text variant="body2" sx={{ color: 'text.secondary' }}>
                Acumulado recente
              </Text>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Text variant="caption" sx={{ color: 'text.secondary' }}>
                Status geral
              </Text>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: status.color,
                  }}
                />
                <Text variant="h6" weight={700}>
                  {status.label}
                </Text>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip size="small" label="Normal" sx={{ backgroundColor: theme.palette.success.light }} />
                <Chip size="small" label="Atencao" sx={{ backgroundColor: theme.palette.warning.light }} />
                <Chip size="small" label="Risco" sx={{ backgroundColor: theme.palette.error.light }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        <Grid container spacing={2} sx={{ animation: 'fadeInUp 0.8s ease' }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                ...focusBorder('temperatura'),
              }}
            >
              <WeatherChart
                latitude={coordinates?.latitude}
                longitude={coordinates?.longitude}
                hoursToShow={hoursToShow}
                period={appliedFilters.period}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                ...focusBorder('precipitacao'),
              }}
            >
              <PrecipitationChart
                latitude={coordinates?.latitude}
                longitude={coordinates?.longitude}
                hoursToShow={hoursToShow}
                period={appliedFilters.period}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                ...focusBorder('vento'),
              }}
            >
              <WindChart
                latitude={coordinates?.latitude}
                longitude={coordinates?.longitude}
                hoursToShow={hoursToShow}
                period={appliedFilters.period}
              />
            </Paper>
          </Grid>
        </Grid>
    </Box>
  );
}
