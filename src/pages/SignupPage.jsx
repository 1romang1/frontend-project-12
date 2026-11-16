import { Alert, Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function SignupPage() {
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => value.trim().length >= 3 ? null : 'Минимум 3 символа',
      password: (value) => value.length >= 6 ? null : 'Минимум 6 символов',
    },
  });
  const mutation = useMutation({
    mutationFn: api.signup,
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
        <Paper withBorder radius="md" p="xl">
          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack>
              <Title order={3}>Регистрация</Title>
              <TextInput label="Имя пользователя" required autoComplete="username" {...form.getInputProps('username')} />
              <PasswordInput label="Пароль" required autoComplete="new-password" {...form.getInputProps('password')} />
              {mutation.isError && (
                <Alert color="red" role="alert">
                  {mutation.error?.status === 409 ? 'Это имя уже занято' : 'Не удалось зарегистрироваться. Попробуйте ещё раз.'}
                </Alert>
              )}
              <Button type="submit" loading={mutation.isPending}>Создать аккаунт</Button>
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
