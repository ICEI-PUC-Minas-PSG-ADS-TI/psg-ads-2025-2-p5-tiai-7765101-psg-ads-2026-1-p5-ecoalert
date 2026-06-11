import { useEffect, useMemo, useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Paper, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { Icon } from '@/components/Icon/Icon';
import { PrecipitationChart } from '@/components/PrecipitationChart/PrecipitationChart';
import { Text } from '@/components/Text/Text';
import { WeatherChart } from '@/components/WeatherChart/WeatherChart';
import { WindChart } from '@/components/WindChart/WindChart';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { getCoordinatesFromAddress, requestGeolocation } from '@/services/geolocationService';
import { prepareWeatherDataForPeriod } from '@/utils/weatherPeriods';

const PERIOD_OPTIONS = [
  { value: '6h', label: '6h', hours: 6, summary: 'Últimas 6h', rainSummary: 'Acumulado nas últimas 6h' },
  { value: '12h', label: '12h', hours: 12, summary: 'Últimas 12h', rainSummary: 'Acumulado nas últimas 12h' },
  { value: '24h', label: '24h', hours: 24, summary: 'Últimas 24h', rainSummary: 'Acumulado nas últimas 24h' },
  { value: '7d', label: '7 dias', hours: 168, summary: 'Últimos 7 dias', rainSummary: 'Acumulado nos últimos 7 dias' },
];

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState(null);
  const [locationSource, setLocationSource] = useState('default');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(
    coordinates?.latitude,
    coordinates?.longitude,
    selectedPeriod,
  );

  useEffect(() => {
    const initializeLocation = async () => {
      setLoadingLocation(true);

      try {
        const geoLocation = await requestGeolocation();

        if (geoLocation) {
          setCoordinates(geoLocation);
          setLocationSource('gps');
        } else if (user?.address) {
          const addressLocation = await getCoordinatesFromAddress(user.address);

          if (addressLocation) {
            setCoordinates(addressLocation);
            setLocationSource('address');
          } else {
            setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
            setLocationSource('default');
          }
        } else {
          setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
          setLocationSource('default');
        }
      } catch (error) {
        console.error('Erro ao definir localização:', error);
        setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
        setLocationSource('default');
      } finally {
        setLoadingLocation(false);
      }
    };

    initializeLocation();
  }, [user]);

  const cityName = user?.address?.city || 'Belo Horizonte';
  const selectedPeriodOption = PERIOD_OPTIONS.find((option) => option.value === selectedPeriod) || PERIOD_OPTIONS[2];

  const scopedWeatherData = useMemo(
    () => prepareWeatherDataForPeriod(weatherData, selectedPeriod),
    [selectedPeriod, weatherData],
  );

  const temperatureValues = useMemo(
    () => scopedWeatherData.map((point) => point.temperature).filter((value) => typeof value === 'number'),
    [scopedWeatherData],
  );

  const currentTemp = temperatureValues.length ? temperatureValues[temperatureValues.length - 1] : null;
  const maxTemp = temperatureValues.length ? Math.max(...temperatureValues) : null;
  const minTemp = temperatureValues.length ? Math.min(...temperatureValues) : null;

  const totalRain = useMemo(
    () => scopedWeatherData.reduce((sum, point) => sum + (point.precipitation || 0), 0),
    [scopedWeatherData],
  );

  const maxWindGust = useMemo(
    () => scopedWeatherData.reduce((max, point) => Math.max(max, point.windGusts || 0), 0),
    [scopedWeatherData],
  );

  const status = useMemo(() => {
    if (totalRain >= 15 || maxWindGust >= 60) {
      return {
        label: 'Risco',
        color: theme.palette.error.main,
        description: 'Condições críticas detectadas',
      };
    }
    if (totalRain >= 5 || maxWindGust >= 40) {
      return {
        label: 'Atenção',
        color: theme.palette.warning.main,
        description: 'Acompanhe as próximas atualizações',
      };
    }
    return {
      label: 'Seguro',
      color: theme.palette.success.main,
      description: 'Sem risco elevado no momento',
    };
  }, [totalRain, maxWindGust, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]);

  const locationLabel = {
    gps: 'via GPS',
    address: user?.address?.neighborhood ? `no bairro ${user.address.neighborhood}` : 'no endereço cadastrado',
    default: `em ${cityName}`,
  }[locationSource];

  const cardBackground = theme.palette.mode === 'dark' ? '#0B0D0F' : theme.palette.background.paper;
  const handlePeriodChange = (_, nextPeriod) => {
    if (nextPeriod) {
      setSelectedPeriod(nextPeriod);
    }
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
        <Text variant="h5" weight={800}>
          Dashboard
        </Text>
        <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {loadingLocation
            ? 'Buscando localização para o monitoramento climático em tempo real'
            : `Monitoramento climático em tempo real ${locationLabel}`}
        </Text>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: cardBackground,
          alignSelf: { xs: 'stretch', md: 'flex-start' },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <div style={{display: 'flex', alignItems: 'center',gap: '16px',flexDirection: 'row'}}>
            <Text 
              variant="body2" 
              weight={700} 
              sx={{ 
                color: 'text.secondary', 
                px: { xs: 1, sm: 1.25 },
              }}>
              Período
            </Text>
            <ToggleButtonGroup
              exclusive
              value={selectedPeriod}
              onChange={handlePeriodChange}
              aria-label="Filtro de período"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, auto)' },
                gap: 0.75,
                '& .MuiToggleButtonGroup-grouped': {
                  m: 0,
                  px: 2,
                  py: 0.75,
                  minWidth: { xs: 0, sm: 72 },
                  border: '1px solid',
                  borderColor: 'divider !important',
                  borderRadius: '8px !important',
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.18),
                  },
                },
              }}
            >
              {PERIOD_OPTIONS.map((option) => (
                <ToggleButton key={option.value} value={option.value} aria-label={option.summary}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        </Stack>
      </Paper>

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
        <DashboardCard
          title="Temperatura atual"
          value={currentTemp !== null ? currentTemp.toFixed(1) : '--'}
          unit="°C"
          detail="Sensação em tempo real"
          iconName="thermometer"
          color={theme.palette.secondary.light}
        />
        <DashboardCard
          title="Máxima e mínima"
          value={maxTemp !== null && minTemp !== null ? `${maxTemp.toFixed(1)}° / ${minTemp.toFixed(1)}°` : '--'}
          detail={selectedPeriodOption.summary}
          iconName="activity"
          color={theme.palette.primary.light}
        />
        <DashboardCard
          title="Volume total de chuva"
          value={totalRain ? totalRain.toFixed(1) : '0'}
          unit="mm"
          detail={selectedPeriodOption.rainSummary}
          iconName="cloud-rain"
          color={theme.palette.info.light}
        />
        <DashboardCard
          title="Status geral"
          value={status.label}
          detail={status.description}
          iconName="shield-alert"
          color={status.color}
          valueColor={status.color}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
        }}
      >
        <ChartPanel background={cardBackground}>
          <WeatherChart
            data={scopedWeatherData}
            loading={weatherLoading}
            error={weatherError}
            onRetry={() => refetchWeather()}
            period={selectedPeriod}
          />
        </ChartPanel>

        <ChartPanel background={cardBackground}>
          <PrecipitationChart
            data={scopedWeatherData}
            loading={weatherLoading}
            error={weatherError}
            onRetry={() => refetchWeather()}
            period={selectedPeriod}
          />
        </ChartPanel>

        <ChartPanel background={cardBackground}>
          <WindChart
            data={scopedWeatherData}
            loading={weatherLoading}
            error={weatherError}
            onRetry={() => refetchWeather()}
            period={selectedPeriod}
          />
        </ChartPanel>
      </Box>
    </Box>
  );
}

function DashboardCard({ title, value, unit, detail, iconName, color, valueColor }) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        minHeight: 186,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'none',
        backgroundColor: theme.palette.mode === 'dark' ? '#0B0D0F' : theme.palette.background.paper,
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: { xs: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2.5, md: 3 } },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Text variant="body2" sx={{ color: 'text.secondary', mb: 1.25 }}>
            {title}
          </Text>
          <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ minWidth: 0 }}>
            <Text
              variant="h5"
              weight={800}
              sx={{
                color: valueColor || 'text.primary',
                lineHeight: 1,
                overflowWrap: 'anywhere',
              }}
            >
              {value}
            </Text>
            {unit && (
              <Text variant="body2" weight={700} sx={{ color: 'text.primary' }}>
                {unit}
              </Text>
            )}
          </Stack>
          <Text
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              mt: 1.5,
            }}
          >
            {detail}
          </Text>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color,
            backgroundColor: alpha(color, 0.12),
            flexShrink: 0,
          }}
        >
          <Icon name={iconName} size={22} />
        </Box>
      </CardContent>
    </Card>
  );
}

function ChartPanel({ children, background }) {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: background,
        overflow: 'hidden',
      }}
    >
      {children}
    </Paper>
  );
}
