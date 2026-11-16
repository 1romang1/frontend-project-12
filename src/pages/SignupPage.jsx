import { Alert, Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApi } from '../api/client.js';
import { useToasts } from '../services/toastsContext.js';
import { useAuthStore } from '../store/auth.js';
import { toSignupCredentials, validateSignup } from '../utils/signup.js';

export default function SignupPage() {
  const { t } = useTranslation();
  const api = useApi();
  const { notifyRequestError } = useToasts();
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { username: '', password: '', confirmPassword: '' },
    validate: (values) => validateSignup(values, t),
    validateInputOnBlur: true,
  });
  const mutation = useMutation({
    mutationFn: api.signup,
    onSuccess: (session) => {
      login(session);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      if (error.status === 409) {
        form.setFieldError('username', t('signup.duplicateField'));
      } else {
        notifyRequestError(error, 'signup.failed');
      }
    },
  });

  if (token) return <Navigate to="/" replace />;

  return (
    <Container size={420} py={64}>
      <Stack gap="lg">
        <Paper withBorder radius="md" p="xl">
          <form onSubmit={form.onSubmit((values) => {
            if (!mutation.isPending) mutation.mutate(toSignupCredentials(values));
          })}>
            <Stack>
              <Title order={3}>{t('signup.title')}</Title>
              <TextInput
                label={t('common.username')}
                required
                autoFocus
                autoComplete="username"
                disabled={mutation.isPending}
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label={t('common.password')}
                required
                autoComplete="new-password"
                disabled={mutation.isPending}
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label={t('signup.confirmPassword')}
                required
                autoComplete="new-password"
                disabled={mutation.isPending}
                key={form.key('confirmPassword')}
                {...form.getInputProps('confirmPassword')}
              />
              {mutation.isError && (
                <Alert color="red" role="alert">
                  {mutation.error?.status === 409 ? t('signup.duplicate') : t('signup.failed')}
                </Alert>
              )}
              <Button type="submit" loading={mutation.isPending} fullWidth>
                {t('signup.submit')}
              </Button>
            </Stack>
          </form>
        </Paper>
        <Text ta="center" size="sm">
          {t('signup.hasAccount')}{' '}<Anchor component={Link} to="/login">{t('signup.loginLink')}</Anchor>
        </Text>
      </Stack>
    </Container>
  );
}
