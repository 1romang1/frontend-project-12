import { Anchor, Button, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import useLogout from '../hooks/useLogout.js';

// The same header is used in the chat and on public pages.
export default function AppHeader({ burger = null }) {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const handleLogout = useLogout();

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        {burger}
        <Anchor component={Link} to="/" c="inherit" fw={700} size="lg" underline="never">
          Hexlet Chat
        </Anchor>
      </Group>
      {token && (
        <Group gap="sm" wrap="nowrap">
          <Text size="sm" visibleFrom="xs" truncate>{username}</Text>
          <Button type="button" variant="subtle" size="compact-sm" onClick={handleLogout}>
            Выйти
          </Button>
        </Group>
      )}
    </Group>
  );
}
