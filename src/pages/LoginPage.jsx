import { Alert, Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => value.trim() ? null : 'Введите имя пользователя',
      password: (value) => value ? null : 'Введите пароль',
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
    <Container size={420} py={80}>
      <Stack gap="lg">
        <Title ta="center">Hexlet Chat</Title>
        <Paper withBorder shadow="sm" radius="md" p="xl">
          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack>
              <Title order={3}>Войти в чат</Title>
              <TextInput label="Имя пользователя" autoComplete="username" required {...form.getInputProps('username')} />
              <PasswordInput label="Пароль" autoComplete="current-password" required {...form.getInputProps('password')} />
              {mutation.isError && (
                <Alert color="red" role="alert">
                  {mutation.error?.status === 401 ? 'Неверное имя пользователя или пароль' : 'Не удалось войти. Проверьте соединение и попробуйте ещё раз.'}
                </Alert>
              )}
              <Button type="submit" loading={mutation.isPending} fullWidth>Войти</Button>
            </Stack>
          </form>
        </Paper>
        <Text ta="center" size="sm">
          Нет аккаунта? <Anchor component={Link} to="/signup">Зарегистрироваться</Anchor>
        </Text>
      </Stack>
    </Container>
  );
}
