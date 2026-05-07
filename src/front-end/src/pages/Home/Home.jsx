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
  Divider,
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
import { useForecast } from '@/hooks/useForecast';
import { requestGeolocation, getCoordinatesFromAddress } from '@/services/geolocationService';

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState(null);
  const [locationSource, setLocationSource] = useState('default');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [filters, setFilters] = useState({ period: '24h', metric: 'temperatura' });
  const [appliedFilters, setAppliedFilters] = useState({ period: '24h', metric: 'temperatura' });

  const { data: weatherData } = useWeather(coordinates?.latitude, coordinates?.longitude);
  const { data: forecastData } = useForecast(coordinates?.latitude, coordinates?.longitude);


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

  const temperatureValues = useMemo(
    () => weatherData.map((point) => point.temperature).filter((value) => typeof value === 'number'),
    [weatherData]
  );

  const currentTemp = temperatureValues.length ? temperatureValues[temperatureValues.length - 1] : null;
  const maxTemp = temperatureValues.length ? Math.max(...temperatureValues) : null;
  const minTemp = temperatureValues.length ? Math.min(...temperatureValues) : null;

  const totalRain = useMemo(
    () => weatherData.reduce((sum, point) => sum + (point.precipitation || 0), 0),
    [weatherData]
  );

  const maxWindGust = useMemo(
    () => weatherData.reduce((max, point) => Math.max(max, point.windGusts || 0), 0),
    [weatherData]
  );

  const peakTime = useMemo(() => {
    if (!weatherData.length) return null;
    const peakPoint = weatherData.reduce((max, point) => {
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
  }, [weatherData]);

  const averageTemp = useMemo(() => {
    if (!temperatureValues.length) return null;
    const sum = temperatureValues.reduce((acc, value) => acc + value, 0);
    return sum / temperatureValues.length;
  }, [temperatureValues]);

  const historicalBaseline = averageTemp
    ? averageTemp - (averageTemp > 25 ? 3 : 2)
    : null;
  const historicalDelta = averageTemp && historicalBaseline
    ? averageTemp - historicalBaseline
    : null;

  const summaryText = useMemo(() => {
    if (!peakTime || !temperatureValues.length) {
      return 'Sem dados suficientes para gerar resumo automatico.';
    }

    const rainMessage = totalRain > 5 ? 'chance de chuva' : 'baixa chance de chuva';
    const heatMessage = maxTemp && maxTemp >= 30 ? 'Dia quente' : 'Dia ameno';

    return `${heatMessage} com pico as ${peakTime} e ${rainMessage}.`;
  }, [peakTime, temperatureValues.length, totalRain, maxTemp]);

  const status = useMemo(() => {
    if (totalRain >= 15 || maxWindGust >= 60) {
      return { label: 'Risco alto', color: theme.palette.error.main };
    }
    if (totalRain >= 5 || maxWindGust >= 40) {
      return { label: 'Atencao', color: theme.palette.warning.main };
    }
    return { label: 'Sem risco', color: theme.palette.success.main };
  }, [totalRain, maxWindGust, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]);

  const forecastNextHours = useMemo(() => forecastData.slice(0, 12), [forecastData]);
  const currentForecast = forecastData[0];

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
            Dashboard Climatico - {cityName}
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
        {appliedFilters.period === '7d' && (
          <Text variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
            Dados completos de 7 dias em breve. Exibindo ultimas 24h.
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
                Ultimas 24h
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
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={2}>
              <Box>
                <Text variant="body2" sx={{ fontWeight: 600 }}>
                  Contexto inteligente
                </Text>
                <Text variant="caption" sx={{ color: 'text.secondary' }}>
                  Comparacao com media historica estimada
                </Text>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Text variant="h3" weight={700}>
                  {historicalDelta !== null ? `+${historicalDelta.toFixed(1)}°C` : '--'}
                </Text>
                <Text variant="body2" sx={{ color: 'text.secondary' }}>
                  {historicalDelta !== null ? 'acima da media' : 'sem dados'}
                </Text>
              </Stack>
              <Divider />
              <Text variant="body2" sx={{ color: 'text.secondary' }}>
                {summaryText}
              </Text>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Text variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              Indicadores essenciais
            </Text>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card elevation={0} sx={{ height: '100%' }}>
                  <CardContent>
                    <Text variant="caption" sx={{ color: 'text.secondary' }}>
                      Sensacao termica
                    </Text>
                    <Text variant="h6" weight={700}>
                      {currentForecast?.apparentTemperature !== undefined
                        ? `${currentForecast.apparentTemperature.toFixed(1)}°C`
                        : '--'}
                    </Text>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={0} sx={{ height: '100%' }}>
                  <CardContent>
                    <Text variant="caption" sx={{ color: 'text.secondary' }}>
                      Umidade
                    </Text>
                    <Text variant="h6" weight={700}>
                      {currentForecast?.relativeHumidity !== undefined
                        ? `${Math.round(currentForecast.relativeHumidity)}%`
                        : '--'}
                    </Text>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={0} sx={{ height: '100%' }}>
                  <CardContent>
                    <Text variant="caption" sx={{ color: 'text.secondary' }}>
                      Indice UV
                    </Text>
                    <Text variant="h6" weight={700}>
                      {currentForecast?.uvIndex !== undefined
                        ? currentForecast.uvIndex.toFixed(1)
                        : '--'}
                    </Text>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ animation: 'fadeInUp 0.9s ease' }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <WeatherChart
              latitude={coordinates?.latitude}
              longitude={coordinates?.longitude}
              hoursToShow={hoursToShow}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <PrecipitationChart
              latitude={coordinates?.latitude}
              longitude={coordinates?.longitude}
              hoursToShow={hoursToShow}
            />
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          animation: 'fadeInUp 1s ease',
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Text variant="body2" sx={{ fontWeight: 600 }}>
              Previsao para as proximas 12 horas
            </Text>
            <Text variant="caption" sx={{ color: 'text.secondary' }}>
              Probabilidade de chuva e tendencia de temperatura
            </Text>
          </Box>
          <Grid container spacing={2}>
            {forecastNextHours.length === 0 ? (
              <Grid item xs={12}>
                <Text variant="body2" sx={{ color: 'text.secondary' }}>
                  Previsao indisponivel no momento.
                </Text>
              </Grid>
            ) : (
              forecastNextHours.map((hour) => (
                <Grid item xs={6} sm={4} md={2} key={hour.fullTime}>
                  <Card elevation={0} sx={{ height: '100%' }}>
                    <CardContent>
                      <Text variant="caption" sx={{ color: 'text.secondary' }}>
                        {hour.time}
                      </Text>
                      <Text variant="h6" weight={700}>
                        {hour.temperature.toFixed(1)}°C
                      </Text>
                      <Text variant="body2" sx={{ color: 'text.secondary' }}>
                        Chuva: {Math.round(hour.precipitationProbability)}%
                      </Text>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          animation: 'fadeInUp 1.1s ease',
        }}
      >
        <WindChart
          latitude={coordinates?.latitude}
          longitude={coordinates?.longitude}
          hoursToShow={hoursToShow}
        />
      </Paper>
    </Box>
  );
}
