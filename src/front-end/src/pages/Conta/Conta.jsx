import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Avatar, Divider, Stack } from '@mui/material';

import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { Input } from '@/components/Input/Input';
import { Text } from '@/components/Text/Text';
import { useFlashMessage } from '@/contexts/FlashMessageContext';
import { useAuth } from '@/hooks/useAuth';
import { updateLoggedUser } from '@/services/userService';
import { ApiError } from '@/types/Error';
import { maskCep, maskCpf } from '@/utils/formatter';

const initialForm = {
  name: '',
  lastName: '',
  email: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  number: '',
  currentPassword: '',
};

export default function Conta() {
  const { user, setUser } = useAuth();
  const { showMessage } = useFlashMessage();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(buildFormFromUser(user));
      setErrors({});
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Text variant="body1">Carregando dados do usuário...</Text>
      </Box>
    );
  }

  function handleChange(field, formatter) {
    return (event) => {
      const value = formatter ? formatter(event.target.value) : event.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const updatedUser = await updateLoggedUser(buildUpdatePayload(form));

      setUser(updatedUser);
      setForm({ ...buildFormFromUser(updatedUser), currentPassword: '' });
      setErrors({});
      showMessage('Dados atualizados com sucesso!', 'success');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fields || {});
        showMessage(error.message || 'Erro ao atualizar dados', 'error');
        return;
      }

      showMessage('Erro ao atualizar dados', 'error');
    } finally {
      setLoading(false);
    }
  }

  const initials =
    `${user?.name?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() ||
    'U';

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, width: '100%', maxWidth: 1120 }}>
      <Box sx={{ mb: 3 }}>
        <Text variant="h5" weight={800}>
          Minha Conta
        </Text>
        <Text variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Atualize seus dados cadastrais e confirme a alteração com sua senha.
        </Text>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '340px minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Text variant="h6" weight={700} truncate>
                  {`${user.name || ''} ${user.lastName || ''}`.trim() || 'Usuário'}
                </Text>
                <Text variant="body2" sx={{ color: 'text.secondary' }} truncate>
                  {user.email}
                </Text>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <AccountInfo icon="mail" label="E-mail" value={user.email} />
              <AccountInfo
                icon="phone"
                label="Telefone"
                value={formatPhoneDisplay(user.phone)}
              />
              <AccountInfo
                icon="map-pin"
                label="Cidade / Estado"
                value={`${user.address?.city || 'Não informada'}${user.address?.state ? ` - ${user.address.state}` : ''}`}
              />
              <AccountInfo
                icon="home"
                label="Endereço"
                value={formatAddressDisplay(user.address)}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Text
                variant="subtitle2"
                weight={700}
                sx={{
                  mb: 2,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Dados pessoais
              </Text>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <Input
                  label="Nome"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <Input
                  label="Sobrenome"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <Input
                  label="CPF"
                  value={form.cpf}
                  onChange={handleChange('cpf', maskCpf)}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                />
                <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                  <Input
                    label="Telefone"
                    value={form.phone}
                    onChange={handleChange('phone', maskPhone)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Text
                variant="subtitle2"
                weight={700}
                sx={{
                  mb: 2,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Endereço
              </Text>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <Input
                  label="CEP"
                  value={form.cep}
                  onChange={handleChange('cep', maskCep)}
                  error={!!errors.cep}
                  helperText={errors.cep}
                />
                <Input
                  label="Cidade"
                  value={form.city}
                  onChange={handleChange('city')}
                  error={!!errors.city}
                  helperText={errors.city}
                />
                <Input
                  label="Rua"
                  value={form.street}
                  onChange={handleChange('street')}
                  error={!!errors.street}
                  helperText={errors.street}
                />
                <Input
                  label="Bairro"
                  value={form.neighborhood}
                  onChange={handleChange('neighborhood')}
                  error={!!errors.neighborhood}
                  helperText={errors.neighborhood}
                />
                <Input
                  label="Número"
                  value={form.number}
                  onChange={handleChange('number')}
                  error={!!errors.number}
                  helperText={errors.number}
                />
                <Input
                  label="Estado"
                  value={form.state}
                  onChange={handleChange('state')}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
                  gap: 2,
                  alignItems: 'end',
                }}
              >
                <Input
                  label="Senha atual"
                  type={showPassword ? 'text' : 'password'}
                  secure
                  value={form.currentPassword}
                  onChange={handleChange('currentPassword')}
                  error={!!errors.currentPassword}
                  helperText={
                    errors.currentPassword ||
                    'Obrigatória para confirmar a edição dos dados'
                  }
                  endIcon={showPassword ? 'eye-off' : 'eye'}
                  onEndIconClick={() => setShowPassword((prev) => !prev)}
                />
                <Button
                  type="submit"
                  color="primary"
                  shape="rounded"
                  icon="check"
                  loading={loading}
                  fullWidth
                  style={{ minHeight: 46, whiteSpace: 'nowrap' }}
                >
                  Salvar alterações
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function AccountInfo({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: 'text.secondary', pt: 0.25 }}>
        <Icon name={icon} size={20} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Text variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Text>
        <Text variant="body2" weight={600} sx={{ overflowWrap: 'anywhere' }}>
          {value || 'Não informado'}
        </Text>
      </Box>
    </Stack>
  );
}

function buildFormFromUser(user) {
  return {
    name: user.name || '',
    lastName: user.lastName || '',
    email: user.email || '',
    cpf: maskCpf(user.cpf || ''),
    phone: maskPhone(`${user.phone?.ddd || ''}${user.phone?.number || ''}`),
    cep: maskCep(user.address?.cep || ''),
    street: user.address?.street || '',
    neighborhood: user.address?.neighborhood || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    number: user.address?.number || '',
    currentPassword: '',
  };
}

function buildUpdatePayload(form) {
  const phone = onlyDigits(form.phone);

  return {
    name: form.name.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    cpf: onlyDigits(form.cpf),
    phone: {
      ddd: phone.slice(0, 2),
      number: phone.slice(2),
    },
    address: {
      cep: onlyDigits(form.cep),
      street: form.street.trim(),
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim() || null,
      number: form.number.trim(),
    },
    currentPassword: form.currentPassword,
  };
}

function validateForm(form) {
  const nextErrors = {};
  const requiredFields = {
    name: 'Informe seu nome',
    lastName: 'Informe seu sobrenome',
    email: 'Informe seu e-mail',
    cpf: 'Informe seu CPF',
    phone: 'Informe seu telefone',
    cep: 'Informe seu CEP',
    street: 'Informe sua rua',
    neighborhood: 'Informe seu bairro',
    city: 'Informe sua cidade',
    number: 'Informe o número',
    currentPassword: 'Informe sua senha atual',
  };

  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!String(form[field] || '').trim()) {
      nextErrors[field] = message;
    }
  });

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    nextErrors.email = 'Informe um e-mail válido';
  }

  if (onlyDigits(form.cpf).length !== 11) {
    nextErrors.cpf = 'Informe um CPF com 11 dígitos';
  }

  const phone = onlyDigits(form.phone);
  if (phone.length < 10 || phone.length > 11) {
    nextErrors.phone = 'Informe um telefone com DDD';
  }

  if (onlyDigits(form.cep).length !== 8) {
    nextErrors.cep = 'Informe um CEP com 8 dígitos';
  }

  return nextErrors;
}

function formatAddressDisplay(address) {
  if (!address) return 'Não informado';

  const parts = [
    address.street,
    address.number,
    address.neighborhood,
    address.cep ? `CEP ${maskCep(address.cep)}` : null,
  ].filter(Boolean);

  return parts.join(', ');
}

function formatPhoneDisplay(phone) {
  if (!phone) return 'Não informado';

  return maskPhone(`${phone.ddd || ''}${phone.number || ''}`);
}

function maskPhone(value) {
  const phone = onlyDigits(value).slice(0, 11);

  if (phone.length <= 2) return phone;
  if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  if (phone.length <= 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }

  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
}

function onlyDigits(value = '') {
  return value.replace(/\D/g, '');
}
