import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { Text } from '@/components/Text/Text';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { fetchWeatherReport } from '@/services/weatherService';
import { getCoordinatesFromAddress, requestGeolocation } from '@/services/geolocationService';
import { prepareWeatherDataForPeriod } from '@/utils/weatherPeriods';

const PERIOD_OPTIONS = [
  { value: '6h', label: '6h', summary: 'Últimas 6 horas' },
  { value: '12h', label: '12h', summary: 'Últimas 12 horas' },
  { value: '24h', label: '24h', summary: 'Últimas 24 horas' },
  { value: '7d', label: '7 dias', summary: 'Últimos 7 dias' },
];

export default function RelatorioIA() {
  const theme = useTheme();
  const { user } = useAuth();
  const [coordinates, setCoordinates] = useState(null);
  const [locationSource, setLocationSource] = useState('default');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [report, setReport] = useState('');
  const [reportGeneratedAt, setReportGeneratedAt] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

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
    let isActive = true;

    const initializeLocation = async () => {
      setLoadingLocation(true);

      try {
        const geoLocation = await requestGeolocation();

        if (!isActive) return;

        if (geoLocation) {
          setCoordinates(geoLocation);
          setLocationSource('gps');
          return;
        }

        if (user?.address) {
          const addressLocation = await getCoordinatesFromAddress(user.address);

          if (!isActive) return;

          if (addressLocation) {
            setCoordinates(addressLocation);
            setLocationSource('address');
            return;
          }
        }

        setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
        setLocationSource('default');
      } catch (error) {
        console.error('Erro ao definir localização:', error);

        if (isActive) {
          setCoordinates({ latitude: -19.9167, longitude: -43.9333 });
          setLocationSource('default');
        }
      } finally {
        if (isActive) {
          setLoadingLocation(false);
        }
      }
    };

    initializeLocation();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    setReport('');
    setReportGeneratedAt(null);
    setReportError(null);
  }, [selectedPeriod, coordinates?.latitude, coordinates?.longitude]);

  const cityName = user?.address?.city || 'Belo Horizonte';
  const neighborhood = user?.address?.neighborhood || cityName;
  const selectedPeriodOption = PERIOD_OPTIONS.find((option) => option.value === selectedPeriod) || PERIOD_OPTIONS[2];

  const scopedWeatherData = useMemo(
    () => prepareWeatherDataForPeriod(weatherData, selectedPeriod),
    [selectedPeriod, weatherData],
  );

  const temperatureValues = useMemo(
    () => scopedWeatherData.map((point) => point.temperature).filter((value) => typeof value === 'number'),
    [scopedWeatherData],
  );

  const windSpeedValues = useMemo(
    () => scopedWeatherData.map((point) => point.windSpeed).filter((value) => typeof value === 'number'),
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

  const averageWindSpeed = useMemo(() => {
    if (!windSpeedValues.length) return null;

    return windSpeedValues.reduce((sum, value) => sum + value, 0) / windSpeedValues.length;
  }, [windSpeedValues]);

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
    address: user?.address?.neighborhood ? `no bairro ${user.address.neighborhood}` : 'no endereco cadastrado',
    default: `em ${cityName}`,
  }[locationSource];

  const metrics = useMemo(() => ({
    periodLabel: selectedPeriodOption.summary,
    currentTemperature: roundMetric(currentTemp),
    maxTemperature: roundMetric(maxTemp),
    minTemperature: roundMetric(minTemp),
    totalRain: roundMetric(totalRain),
    maxWindGust: roundMetric(maxWindGust),
    averageWindSpeed: roundMetric(averageWindSpeed),
    riskStatus: status.label,
    riskDescription: status.description,
    dataPoints: scopedWeatherData.length,
    locationSource: locationLabel,
  }), [
    averageWindSpeed,
    currentTemp,
    locationLabel,
    maxTemp,
    maxWindGust,
    minTemp,
    scopedWeatherData.length,
    selectedPeriodOption.summary,
    status.description,
    status.label,
    totalRain,
  ]);

  const surfaceColor = theme.palette.mode === 'dark' ? '#0B0D0F' : theme.palette.background.paper;
  const subtleSurface = theme.palette.mode === 'dark' ? '#101316' : '#F8FAFC';
  const canGenerateReport = Boolean(
    coordinates &&
    !loadingLocation &&
    !weatherLoading &&
    !weatherError &&
    scopedWeatherData.length > 0
  );

  const handlePeriodChange = (_, nextPeriod) => {
    if (nextPeriod) {
      setSelectedPeriod(nextPeriod);
    }
  };

  const handleGenerateReport = async () => {
    if (!coordinates) return;

    try {
      setReportLoading(true);
      setReportError(null);
      setReportGeneratedAt(null);

      const generatedAt = new Date().toISOString();

      const generatedReport = await fetchWeatherReport({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        neighborhood,
        metrics: {
          ...metrics,
          generatedAt,
        },
      });

      setReport(generatedReport);
      setReportGeneratedAt(generatedAt);
    } catch (error) {
      console.error(error);
      setReportError('Não foi possível gerar o relatório inteligente agora.');
    } finally {
      setReportLoading(false);
    }
  };

  const handleGeneratePdf = () => {
    if (!report) return;

    const printWindow = window.open('', '_blank', 'width=900,height=720');

    if (!printWindow) {
      window.alert('Permita pop-ups para gerar o PDF do relatório.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintableReportHtml({
      report,
      generatedAt: reportGeneratedAt,
      neighborhood,
      locationLabel,
      status,
      metrics,
    }));
    printWindow.document.close();
    printWindow.focus();

    printWindow.setTimeout(() => {
      printWindow.print();
    }, 250);
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
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        gap={3}
        sx={{ width: '100%' }}
      >
        <Box>
          <Text variant="h5" weight={800}>
            Relatório Inteligente
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            IA aplicada ao monitoramento climático {loadingLocation ? 'com localização em processamento' : locationLabel}
          </Text>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'stretch', md: 'flex-end' },
            flex: 1,
          }}
        >
          <Button
            icon="sparkles"
            loading={reportLoading}
            disabled={!canGenerateReport || reportLoading}
            onClick={handleGenerateReport}
            style={{
              minWidth: 236,
              height: 48,
              borderRadius: 14,
              background: canGenerateReport
                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                : undefined,
              border: canGenerateReport ? '1px solid rgba(255, 255, 255, 0.18)' : undefined,
              boxShadow: canGenerateReport ? `0 16px 34px ${alpha(theme.palette.primary.main, 0.28)}` : undefined,
              letterSpacing: 0.2,
            }}
          >
            Gerar relatório
          </Button>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: surfaceColor,
          alignSelf: { xs: 'stretch', md: 'flex-start' },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Text
            variant="body2"
            weight={700}
            sx={{
              color: 'text.secondary',
              px: { xs: 1, sm: 1.25 },
            }}
          >
            Periodo
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
        </Stack>
      </Paper>

      {weatherError && (
        <Alert
          severity="warning"
          action={
            <Button variant="text" size="small" color="info" onClick={() => refetchWeather({ reset: true })}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possivel carregar as métricas climáticas.
        </Alert>
      )}

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
        <MetricCard
          title="Temperatura atual"
          value={formatNumber(currentTemp)}
          unit="C"
          detail={selectedPeriodOption.summary}
          iconName="thermometer"
          color={theme.palette.secondary.light}
          background={alpha(theme.palette.secondary.main, 0.14)}
          loading={loadingLocation || weatherLoading}
        />
        <MetricCard
          title="Chuva acumulada"
          value={formatNumber(totalRain)}
          unit="mm"
          detail="Contexto principal do risco"
          iconName="cloud-rain"
          color={theme.palette.info.light}
          background={alpha(theme.palette.info.main, 0.14)}
          loading={loadingLocation || weatherLoading}
        />
        <MetricCard
          title="Maior rajada"
          value={formatNumber(maxWindGust)}
          unit="km/h"
          detail="Pico de vento no período"
          iconName="wind"
          color={theme.palette.primary.light}
          background={alpha(theme.palette.primary.main, 0.14)}
          loading={loadingLocation || weatherLoading}
        />
        <MetricCard
          title="Status geral"
          value={status.label}
          detail={status.description}
          iconName="shield-alert"
          color={status.color}
          background={alpha(status.color, 0.14)}
          valueColor={status.color}
          loading={loadingLocation || weatherLoading}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 0.8fr) minmax(0, 1.2fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: surfaceColor,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  color: theme.palette.secondary.light,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.14),
                }}
              >
                <Icon name="list-checks" size={20} />
              </Box>
              <Box>
                <Text variant="subtitle1" weight={800}>
                  Contexto enviado
                </Text>
                <Text variant="caption" sx={{ color: 'text.secondary' }}>
                  Métricas usadas no prompt da IA
                </Text>
              </Box>
            </Stack>

            <Divider />

            <Stack spacing={1.4}>
              <ContextRow label="Local" value={neighborhood} />
              <ContextRow label="Origem" value={locationLabel} />
              <ContextRow label="Período" value={selectedPeriodOption.summary} />
              <ContextRow label="Máxima / mínima" value={`${formatNumber(maxTemp)}C / ${formatNumber(minTemp)}C`} />
              <ContextRow label="Vento médio" value={`${formatNumber(averageWindSpeed)} km/h`} />
              <ContextRow label="Pontos analisados" value={scopedWeatherData.length || '--'} />
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            minHeight: 420,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: surfaceColor,
          }}
        >
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              gap={1.5}
            >
              <Box>
                <Text variant="subtitle1" weight={800}>
                  Relatório gerado pela IA
                </Text>
                <Text variant="caption" sx={{ color: 'text.secondary' }}>
                  Análise textual baseada nos dados meteorológicos e métricas atuais
                </Text>
              </Box>

              {report && (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <Button
                    variant="outline"
                    color="info"
                    icon="file-down"
                    onClick={handleGeneratePdf}
                    style={{
                      minHeight: 38,
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Gerar PDF do relatório
                  </Button>
                  <StatusPill color={status.color} label={status.label} />
                </Stack>
              )}
            </Stack>

            <Divider />

            <Box
              sx={{
                flex: 1,
                minHeight: 280,
                borderRadius: 2,
                backgroundColor: report ? 'transparent' : subtleSurface,
                display: 'flex',
                alignItems: report ? 'stretch' : 'center',
                justifyContent: report ? 'flex-start' : 'center',
                overflow: 'hidden',
              }}
            >
              {reportLoading ? (
                <EmptyState
                  iconName="loader-circle"
                  title="Gerando análise"
                  description="A IA está cruzando as métricas com os dados meteorológicos."
                  loading
                />
              ) : reportError ? (
                <EmptyState
                  iconName="circle-alert"
                  title="Falha ao gerar relatório"
                  description={reportError}
                  toneColor={theme.palette.error.main}
                />
              ) : report ? (
                <ReportContent report={report} />
              ) : (
                <EmptyState
                  iconName="sparkles"
                  title="Pronto para gerar"
                  description="Revise as métricas e clique em 'Gerar relatório' para criar a análise inteligente."
                  toneColor={theme.palette.secondary.light}
                />
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function MetricCard({ title, value, unit, detail, iconName, color, background, valueColor, loading }) {
  return (
    <Card
      elevation={0}
      sx={{
        minHeight: 154,
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

          {loading ? (
            <LoadingSpinner size={24} />
          ) : (
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
          )}

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
            backgroundColor: background,
            flexShrink: 0,
          }}
        >
          <Icon name={iconName} size={22} />
        </Box>
      </CardContent>
    </Card>
  );
}

function ContextRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <Text variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Text>
      <Text variant="body2" weight={700} sx={{ textAlign: 'right', overflowWrap: 'anywhere' }}>
        {value || '--'}
      </Text>
    </Stack>
  );
}

function StatusPill({ color, label }) {
  return (
    <Stack
      direction="row"
      spacing={0.85}
      alignItems="center"
      sx={{
        px: 1.35,
        py: 0.65,
        borderRadius: 999,
        color,
        backgroundColor: alpha(color, 0.1),
        border: '1px solid',
        borderColor: alpha(color, 0.3),
        boxShadow: `0 8px 24px ${alpha(color, 0.08)}`,
        lineHeight: 1,
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 0 3px ${alpha(color, 0.12)}`,
        }}
      />
      <Text variant="caption" weight={800} color="inherit" sx={{ lineHeight: 1 }}>
        {label}
      </Text>
    </Stack>
  );
}

function EmptyState({ iconName, title, description, toneColor, loading = false }) {
  return (
    <Stack
      spacing={1.75}
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: 300,
        px: { xs: 2.5, md: 4 },
        py: { xs: 4, md: 5 },
        textAlign: 'center',
        color: toneColor || 'primary.main',
      }}
    >
      <Box
        sx={{
          width: 58,
          height: 58,
          borderRadius: 2.5,
          display: 'grid',
          placeItems: 'center',
          color: 'inherit',
          backgroundColor: 'currentColor',
          boxShadow: '0 14px 34px rgb(0 0 0 / 0.18)',
          '& > *': {
            color: 'background.paper',
          },
          opacity: 0.92,
        }}
      >
        {loading ? (
          <LoadingSpinner size={26} color="inherit" />
        ) : (
          <Icon name={iconName} size={26} />
        )}
      </Box>

      <Stack spacing={0.75} alignItems="center" sx={{ maxWidth: 440 }}>
        <Text variant="subtitle1" weight={800} color="text.primary">
          {title}
        </Text>
        <Text variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
          {description}
        </Text>
      </Stack>
    </Stack>
  );
}

function ReportContent({ report }) {
  const lines = report.split('\n');

  return (
    <Stack spacing={1.25}>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          return <Box key={`space-${index}`} sx={{ height: 4 }} />;
        }

        if (trimmedLine.startsWith('###')) {
          return (
            <Text key={index} variant="subtitle1" weight={800} sx={{ mt: index === 0 ? 0 : 1 }}>
              {formatInlineMarkdown(trimmedLine.replace(/^###\s*/, ''))}
            </Text>
          );
        }

        if (trimmedLine.startsWith('-')) {
          return (
            <Stack key={index} direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'secondary.light',
                  mt: 1,
                  flexShrink: 0,
                }}
              />
              <Text variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                {formatInlineMarkdown(trimmedLine.replace(/^-\s*/, ''))}
              </Text>
            </Stack>
          );
        }

        return (
          <Text key={index} variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
            {formatInlineMarkdown(trimmedLine)}
          </Text>
        );
      })}
    </Stack>
  );
}

function buildPrintableReportHtml({ report, generatedAt, neighborhood, locationLabel, status, metrics }) {
  const generatedAtLabel = formatDateTime(generatedAt);
  const statusColor = status?.color || '#2563EB';
  const statusLabel = status?.label || '--';
  const metricRows = [
    ['Local', neighborhood],
    ['Origem', locationLabel],
    ['Periodo', metrics.periodLabel],
    ['Status', `${metrics.riskStatus} - ${metrics.riskDescription}`],
    ['Temperatura atual', `${formatNumber(metrics.currentTemperature)} C`],
    ['Maxima / minima', `${formatNumber(metrics.maxTemperature)} C / ${formatNumber(metrics.minTemperature)} C`],
    ['Chuva acumulada', `${formatNumber(metrics.totalRain)} mm`],
    ['Maior rajada', `${formatNumber(metrics.maxWindGust)} km/h`],
    ['Vento medio', `${formatNumber(metrics.averageWindSpeed)} km/h`],
    ['Pontos analisados', metrics.dataPoints || '--'],
  ];

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Relatório IA EcoAlert</title>
        <style>
          @page {
            margin: 18mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            color: #111827;
            background: #FFFFFF;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.55;
          }

          .page {
            max-width: 780px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            padding-bottom: 18px;
            border-bottom: 1px solid #D1D5DB;
          }

          .eyebrow {
            margin: 0 0 6px;
            color: #4B5563;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1.2;
          }

          .meta {
            min-width: 190px;
            color: #4B5563;
            font-size: 12px;
            text-align: right;
          }

          .pill {
            display: inline-block;
            margin-top: 10px;
            padding: 6px 10px;
            border: 1px solid ${statusColor};
            border-radius: 999px;
            color: ${statusColor};
            font-size: 12px;
            font-weight: 700;
          }

          .metrics {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 18px;
            margin: 24px 0;
            padding: 16px;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            background: #F9FAFB;
          }

          .metric-label {
            margin: 0;
            color: #6B7280;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .metric-value {
            margin: 2px 0 0;
            color: #111827;
            font-size: 13px;
            font-weight: 700;
          }

          .report {
            margin-top: 20px;
          }

          .report h2 {
            margin: 20px 0 8px;
            font-size: 17px;
            line-height: 1.3;
          }

          .report p {
            margin: 0 0 10px;
            color: #374151;
            font-size: 14px;
          }

          .report .bullet {
            position: relative;
            margin: 0 0 8px;
            padding-left: 16px;
            color: #374151;
            font-size: 14px;
          }

          .report .bullet::before {
            content: '';
            position: absolute;
            top: 0.72em;
            left: 0;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #2563EB;
          }

          .spacer {
            height: 8px;
          }

          strong {
            color: #111827;
          }

          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <header class="header">
            <div>
              <p class="eyebrow">EcoAlert</p>
              <h1>Relatório Inteligente</h1>
            </div>
            <div class="meta">
              <div>Gerado em ${escapeHtml(generatedAtLabel)}</div>
              <span class="pill">${escapeHtml(statusLabel)}</span>
            </div>
          </header>

          <section class="metrics">
            ${metricRows.map(([label, value]) => `
              <div>
                <p class="metric-label">${escapeHtml(label)}</p>
                <p class="metric-value">${escapeHtml(value)}</p>
              </div>
            `).join('')}
          </section>

          <section class="report">
            ${renderPrintableReport(report)}
          </section>
        </main>
      </body>
    </html>
  `;
}

function renderPrintableReport(report) {
  return report.split('\n').map((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return '<div class="spacer"></div>';
    }

    if (trimmedLine.startsWith('###')) {
      return `<h2>${formatInlineMarkdownForPrint(trimmedLine.replace(/^###\s*/, ''))}</h2>`;
    }

    if (trimmedLine.startsWith('-')) {
      return `<div class="bullet">${formatInlineMarkdownForPrint(trimmedLine.replace(/^-\s*/, ''))}</div>`;
    }

    return `<p>${formatInlineMarkdownForPrint(trimmedLine)}</p>`;
  }).join('');
}

function formatInlineMarkdownForPrint(text) {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, (_, value) => `<strong>${value}</strong>`);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

function formatDateTime(value) {
  if (!value) {
    return new Date().toLocaleString('pt-BR');
  }

  return new Date(value).toLocaleString('pt-BR');
}

function formatInlineMarkdown(text) {
  return text.split('**').map((part, index) => (
    index % 2 === 1 ? (
      <Box key={index} component="strong" sx={{ color: 'text.primary', fontWeight: 800 }}>
        {part}
      </Box>
    ) : (
      <Box key={index} component="span">
        {part}
      </Box>
    )
  ));
}

function roundMetric(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(1));
}

function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }

  return value.toFixed(1);
}
