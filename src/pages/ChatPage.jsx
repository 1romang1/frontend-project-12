import { useEffect } from 'react';
import { Alert, AppShell, Box, Burger, Button, Center, Group, Loader, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import ChannelSidebar from '../components/ChannelSidebar.jsx';
import MessageComposer from '../components/MessageComposer.jsx';
import { useAuthStore } from '../store/auth.js';
import { useUiStore } from '../store/ui.js';
import { getDefaultChannelId } from '../utils/channels.js';

export default function ChatPage() {
  const [mobileOpened, { toggle, close }] = useDisclosure(false);
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const channelId = useUiStore((state) => state.currentChannelId);
  const selectChannel = useUiStore((state) => state.selectChannel);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const channelsQuery = useQuery({ queryKey: ['channels'], queryFn: api.channels, enabled: Boolean(token) });
  const messagesQuery = useQuery({ queryKey: ['messages'], queryFn: api.messages, enabled: Boolean(token) });
  const channels = channelsQuery.data ?? [];
  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    if (channelsQuery.isSuccess && channels.length > 0 && !channels.some(({ id }) => id === channelId)) {
      selectChannel(getDefaultChannelId(channels));
    }
  }, [channels, channelId, channelsQuery.isSuccess, selectChannel]);

  const currentChannel = channels.find(({ id }) => id === channelId);
  const currentMessages = messages.filter((message) => message.channelId === channelId);

  const handleLogout = () => {
    logout();
    selectChannel(null);
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Открыть меню" />
            <Title order={3}>Hexlet Chat</Title>
          </Group>
          <Group gap="sm">
            <Text size="sm" visibleFrom="xs">{username}</Text>
            <Button variant="subtle" size="compact-sm" onClick={handleLogout}>Выйти</Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ChannelSidebar channels={channels} onSelect={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        {(channelsQuery.isPending || messagesQuery.isPending) && (
          <Center h="60vh"><Loader aria-label="Загрузка чата" /></Center>
        )}
        {(channelsQuery.isError || messagesQuery.isError) && (
          <Alert color="red" title="Не удалось загрузить чат" role="alert">
            Проверьте подключение к сети или повторно войдите в аккаунт.
            <Group mt="md">
              <Button size="xs" onClick={() => { channelsQuery.refetch(); messagesQuery.refetch(); }}>Повторить</Button>
              <Button size="xs" variant="outline" onClick={handleLogout}>Войти заново</Button>
            </Group>
          </Alert>
        )}
        {channelsQuery.isSuccess && messagesQuery.isSuccess && (
          <Stack h="calc(100dvh - 110px)" gap="md" style={{ minHeight: 0 }}>
            <Paper withBorder p="md" radius="md">
              <Text fw={700} style={{ overflowWrap: 'anywhere' }}># {currentChannel?.name ?? 'Загрузка канала'}</Text>
              <Text size="sm" c="dimmed">Сообщений: {currentMessages.length}</Text>
            </Paper>
            <Box style={{ minHeight: 0, minWidth: 0, flex: 1 }}>
              <ScrollArea h="100%" type="auto" offsetScrollbars>
                <Stack gap="md" px="xs" py="sm">
                  {currentMessages.length === 0 && (
                    <Text c="dimmed">Пока нет сообщений. Напишите первое!</Text>
                  )}
                  {currentMessages.map((message) => (
                    <Box key={message.id}>
                      <Text fw={700} size="sm" style={{ overflowWrap: 'anywhere' }}>{message.username}</Text>
                      <Text size="sm" style={{ overflowWrap: 'anywhere' }}>{message.body}</Text>
                    </Box>
                  ))}
                </Stack>
              </ScrollArea>
            </Box>
            <MessageComposer channelId={channelId} />
          </Stack>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
