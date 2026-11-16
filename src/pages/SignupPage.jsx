import { Alert, Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';
import { toSignupCredentials, validateSignup } from '../utils/signup.js';

export default function SignupPage() {
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { username: '', password: '', confirmPassword: '' },
    validate: validateSignup,
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
        form.setFieldError('username', 'Это имя пользователя уже занято');
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
              <Title order={3}>Регистрация</Title>
              <TextInput
                label="Имя пользователя"
                required
                autoFocus
                autoComplete="username"
                disabled={mutation.isPending}
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Пароль"
                required
                autoComplete="new-password"
                disabled={mutation.isPending}
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="Подтверждение пароля"
                required
                autoComplete="new-password"
                disabled={mutation.isPending}
                key={form.key('confirmPassword')}
                {...form.getInputProps('confirmPassword')}
              />
              {mutation.isError && (
                <Alert color="red" role="alert">
                  {mutation.error?.status === 409
                    ? 'Пользователь с таким именем уже существует'
                    : 'Не удалось зарегистрироваться. Проверьте соединение и попробуйте ещё раз.'}
                </Alert>
              )}
              <Button type="submit" loading={mutation.isPending} fullWidth>
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        </Paper>
        <Text ta="center" size="sm">
          Есть аккаунт? <Anchor component={Link} to="/login">Войти</Anchor>
        </Text>
      </Stack>
    </Container>
  );
}
