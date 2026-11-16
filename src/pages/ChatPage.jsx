import { useEffect } from 'react';
import { Alert, AppShell, Box, Burger, Button, Center, Group, Loader, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import useLogout from '../hooks/useLogout.js';
import { useApi } from '../api/client.js';
import AppHeader from '../components/AppHeader.jsx';
import ChannelSidebar from '../components/ChannelSidebar.jsx';
import MessageComposer from '../components/MessageComposer.jsx';
import { useAuthStore } from '../store/auth.js';
import { useUiStore } from '../store/ui.js';
import { getDefaultChannelId } from '../utils/channels.js';
import { censorProfanity } from '../utils/profanity.js';

export default function ChatPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [mobileOpened, { toggle, close }] = useDisclosure(false);
  const token = useAuthStore((state) => state.token);
  const channelId = useUiStore((state) => state.currentChannelId);
  const selectChannel = useUiStore((state) => state.selectChannel);
  const handleLogout = useLogout();
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

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !mobileOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader burger={(
          <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label={t('chat.openMenu')} />
        )} />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ChannelSidebar channels={channels} onSelect={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        {(channelsQuery.isPending || messagesQuery.isPending) && (
          <Center h="60vh"><Loader aria-label={t('chat.loading')} /></Center>
        )}
        {(channelsQuery.isError || messagesQuery.isError) && (
          <Alert color="red" title={t('chat.loadFailedTitle')} role="alert">
            {t('chat.loadFailedHelp')}
            <Group mt="md">
              <Button size="xs" onClick={() => { channelsQuery.refetch(); messagesQuery.refetch(); }}>{t('chat.retry')}</Button>
              <Button size="xs" variant="outline" onClick={handleLogout}>{t('chat.loginAgain')}</Button>
            </Group>
          </Alert>
        )}
        {channelsQuery.isSuccess && messagesQuery.isSuccess && (
          <Stack h="calc(100dvh - 110px)" gap="md" style={{ minHeight: 0 }}>
            <Paper withBorder p="md" radius="md">
              <Text fw={700} style={{ overflowWrap: 'anywhere' }}># {currentChannel?.name ?? t('chat.loadingChannel')}</Text>
              <Text size="sm" c="dimmed">{t('chat.messagesCount', { number: currentMessages.length })}</Text>
            </Paper>
            <Box style={{ minHeight: 0, minWidth: 0, flex: 1 }}>
              <ScrollArea h="100%" type="auto" offsetScrollbars>
                <Stack gap="md" px="xs" py="sm">
                  {currentMessages.length === 0 && (
                    <Text c="dimmed">{t('chat.empty')}</Text>
                  )}
                  {currentMessages.map((message) => (
                    <Box key={message.id}>
                      <Text fw={700} size="sm" style={{ overflowWrap: 'anywhere' }}>{message.username}</Text>
                      <Text size="sm" style={{ overflowWrap: 'anywhere' }}>{censorProfanity(message.body)}</Text>
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
