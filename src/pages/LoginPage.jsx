import { Alert, Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => value.trim() ? null : t('validation.usernameRequired'),
      password: (value) => value ? null : t('validation.passwordRequired'),
    },
  });
  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: (session) => {
      login(session);
      navigate('/', { replace: true });
    },
  });

  if (token) return <Navigate to="/" replace />;

  return (
    <Container size={420} py={64}>
      <Stack gap="lg">
        <Paper withBorder shadow="sm" radius="md" p="xl">
          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack>
              <Title order={3}>{t('login.title')}</Title>
              <TextInput label={t('common.username')} autoComplete="username" required {...form.getInputProps('username')} />
              <PasswordInput label={t('common.password')} autoComplete="current-password" required {...form.getInputProps('password')} />
              {mutation.isError && (
                <Alert color="red" role="alert">
                  {mutation.error?.status === 401 ? t('login.invalidCredentials') : t('login.failed')}
                </Alert>
              )}
              <Button type="submit" loading={mutation.isPending} fullWidth>{t('login.submit')}</Button>
            </Stack>
          </form>
        </Paper>
        <Text ta="center" size="sm">
          {t('login.noAccount')}{' '}<Anchor component={Link} to="/signup">{t('login.signupLink')}</Anchor>
        </Text>
      </Stack>
    </Container>
  );
}
