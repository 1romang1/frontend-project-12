import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Center mih="calc(100dvh - 64px)">
      <Stack align="center" gap="md">
        <Title order={1}>404</Title>
        <Text>Страница не найдена</Text>
        <Button component={Link} to="/">Вернуться в чат</Button>
      </Stack>
    </Center>
  );
}
