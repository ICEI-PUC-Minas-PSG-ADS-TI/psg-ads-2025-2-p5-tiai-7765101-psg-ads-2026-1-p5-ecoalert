import { WeatherChart } from '@/components/WeatherChart/WeatherChart';
import { PrecipitationChart } from '@/components/PrecipitationChart/PrecipitationChart';
import { Box, Grid, Paper } from '@mui/material';
import { Text } from '@/components/Text/Text';

export default function Home() {
  return (
    <Box>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Text 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Central de Monitoramento Climático
          </Text>
          <Text variant="body2" sx={{ color: 'text.secondary' }}>
            Acompanhe em tempo real as condições climáticas de Belo Horizonte
          </Text>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                    : '0 8px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 12px 24px rgba(0, 0, 0, 0.5)'
                      : '0 12px 24px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <WeatherChart />
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                    : '0 8px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 12px 24px rgba(0, 0, 0, 0.5)'
                      : '0 12px 24px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <PrecipitationChart />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
