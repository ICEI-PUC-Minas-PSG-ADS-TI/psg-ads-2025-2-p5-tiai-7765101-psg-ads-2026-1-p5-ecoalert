import { Box, Card, CardContent, Avatar, Divider, Stack } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { Text } from '@/components/Text/Text';
import { Icon } from '@/components/Icon/Icon';

export default function Conta() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Text variant="body1">Carregando dados do usuário...</Text>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 600}}>
      <Text variant="h5" weight={800} sx={{ mb: 3 }}>
        Minha Conta
      </Text>

      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Text variant="h6" weight={700}>
                {user.name + user.lastName || 'Usuário'}
              </Text>
              <Text variant="body2" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Text>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Text variant="subtitle2" weight={700} sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase' }}>
            Informações de Localização
          </Text>

          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Icon name="map-pin" size={20}/>
              <Box>
                <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Cidade / Estado
                </Text>
                <Text variant="body2" weight={600}>
                  {user.address?.city || 'Não informada'} - {user.address?.state || 'UF'}
                </Text>
              </Box>
            </Stack>

            {user.address?.neighborhood && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Icon name="home" size={20} />
                <Box>
                  <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Bairro
                  </Text>
                  <Text variant="body2" weight={600}>
                    {user.address.neighborhood}
                  </Text>
                </Box>
                <Box>
                    <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Rua
                    </Text>
                    <Text variant="body2" weight={600}>
                        {user.address.street}
                    </Text>
                </Box>
                <Box>
                    <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Número
                    </Text>
                    <Text variant="body2" weight={600}>
                        {user.address.number}
                    </Text>
                </Box>
                <Box>
                    <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        CEP
                    </Text>
                    <Text variant="body2" weight={600}>
                        {user.address.cep}
                    </Text>
                </Box>
              </Stack>
            )}
          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}