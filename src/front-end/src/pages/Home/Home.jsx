import { WeatherChart } from '@/components/WeatherChart/WeatherChart';
import { Box, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <WeatherChart />
      </Box>
    </Container>
  );
}
