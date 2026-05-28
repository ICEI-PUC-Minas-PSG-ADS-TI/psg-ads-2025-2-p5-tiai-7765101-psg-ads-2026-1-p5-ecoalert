import { Box, Card, CardContent, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import landingHero from '@/assets/landing-hero.png';
import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { Text } from '@/components/Text/Text';

const highlights = [
  {
    icon: 'cloud-rain',
    title: 'Clima em tempo real',
    description: 'Dados de chuva, vento e risco reunidos em uma visão simples para agir antes do agravamento.',
  },
  {
    icon: 'radio',
    title: 'Sensores distribuídos',
    description: 'Monitoramento por bairros e pontos vulneráveis, com status de conexão e bateria sempre visíveis.',
  },
  {
    icon: 'bell-ring',
    title: 'Alertas rápidos',
    description: 'Sinais de atenção e risco para apoiar respostas de moradores, equipes públicas e voluntários.',
  },
];

const steps = [
  'Sensores acompanham chuva e níveis críticos em áreas vulneráveis.',
  'A plataforma cruza os dados com a localização de cada região monitorada.',
  'Alertas orientam decisões rápidas quando o risco de enchente aumenta.',
];

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 'calc(100svh - 128px)', md: 'calc(100svh - 112px)' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          isolation: 'isolate',
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 6, md: 8 },
          overflow: 'hidden',
          backgroundImage: `linear-gradient(90deg, rgba(5,6,7,0.92) 0%, rgba(5,6,7,0.72) 38%, rgba(5,6,7,0.22) 72%), url(${landingHero})`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: '62% center', md: 'center' },
        }}
      >
        <Stack
          spacing={3}
          sx={{
            width: '100%',
            maxWidth: 680,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: theme.palette.success.main,
                boxShadow: `0 0 0 6px ${alpha(theme.palette.success.main, 0.14)}`,
              }}
            />
            <Text variant="body2" weight={700} sx={{ color: theme.palette.secondary.light }}>
              Monitoramento ambiental para Belo Horizonte
            </Text>
          </Stack>

          <Box>
            <Text
              component="h1"
              variant="h1"
              sx={{
                fontSize: '4rem',
                lineHeight: 0.95,
                fontWeight: 800,
                letterSpacing: 0,
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              Nimbly
            </Text>
            <Text
              variant="h5"
              sx={{
                maxWidth: 620,
                color: alpha('#FFFFFF', 0.84),
                lineHeight: 1.45,
                fontWeight: 400,
              }}
            >
              Plataforma digital para monitorar chuvas intensas, antecipar riscos de enchentes e apoiar respostas rápidas em comunidades vulneráveis.
            </Text>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ maxWidth: { xs: 320, sm: 'none' } }}>
            <Button
              size="large"
              icon="log-in"
              onClick={() => navigate('/login')}
              style={{ minHeight: 48 }}
            >
              Entrar no painel
            </Button>
            <Button
              variant="outline"
              size="large"
              icon="user-plus"
              onClick={() => navigate('/cadastro')}
              style={{
                minHeight: 48,
                backgroundColor: alpha('#FFFFFF', 0.08),
                color: '#FFFFFF',
                borderColor: alpha('#FFFFFF', 0.42),
              }}
            >
              Criar conta
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 4 }}>
            <HeroMetric value="24" label="sensores ativos" />
            <HeroMetric value="22" label="online agora" />
            <HeroMetric value="BH" label="bairros monitorados" />
          </Stack>
        </Stack>
      </Box>

      <Box
        component="section"
        id="recursos"
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Stack spacing={3} sx={{ maxWidth: 1180, mx: 'auto' }}>
          <Box sx={{ maxWidth: 680 }}>
            <Text variant="h4" weight={800}>
              Um painel para decidir antes da emergência
            </Text>
            <Text variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
              O Nimbly organiza dados climáticos, sensores e alertas em uma experiência feita para leitura rápida.
            </Text>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {highlights.map((item) => (
              <Card key={item.title} elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      color: theme.palette.secondary.light,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                      mb: 2,
                    }}
                  >
                    <Icon name={item.icon} size={22} />
                  </Box>
                  <Text variant="h6" weight={800}>
                    {item.title}
                  </Text>
                  <Text variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    {item.description}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Box>

      <Box
        component="section"
        id="impacto"
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 5, md: 7 },
          backgroundColor: theme.palette.mode === 'dark' ? '#080A0C' : alpha(theme.palette.primary.main, 0.04),
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 8 }}
          sx={{ maxWidth: 1180, mx: 'auto' }}
        >
          <Box sx={{ flex: 1 }}>
            <Text variant="h4" weight={800}>
              Do sensor ao alerta
            </Text>
            <Text variant="body1" sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 520 }}>
              A proposta do projeto é aproximar tecnologia, prevenção climática e cuidado comunitário.
            </Text>
          </Box>

          <Stack spacing={2.5} sx={{ flex: 1.2 }}>
            {steps.map((step, index) => (
              <Stack key={step} direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    color: theme.palette.primary.contrastText,
                    backgroundColor: index === 2 ? theme.palette.error.main : theme.palette.primary.main,
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </Box>
                <Text variant="body1" sx={{ color: 'text.primary', pt: 0.4 }}>
                  {step}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function HeroMetric({ value, label }) {
  return (
    <Box>
      <Text variant="h5" weight={800} sx={{ color: '#FFFFFF', lineHeight: 1 }}>
        {value}
      </Text>
      <Text variant="caption" sx={{ color: alpha('#FFFFFF', 0.68), whiteSpace: 'nowrap' }}>
        {label}
      </Text>
    </Box>
  );
}
