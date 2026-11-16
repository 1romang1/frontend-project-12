import { ActionIcon, Button, Group, Menu, ScrollArea, Stack, Text } from '@mantine/core';
import ChannelModals from './ChannelModals.jsx';
import { useUiStore } from '../store/ui.js';

export default function ChannelSidebar({ channels, onSelect }) {
  const currentChannelId = useUiStore((state) => state.currentChannelId);
  const selectChannel = useUiStore((state) => state.selectChannel);
  const openModal = useUiStore((state) => state.openModal);

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text fw={700}>Каналы</Text>
        <Button size="compact-sm" variant="light" aria-label="Добавить канал" onClick={() => openModal('create')}>+</Button>
      </Group>
      <ScrollArea h="calc(100dvh - 190px)" type="auto" offsetScrollbars>
        <Stack gap={4}>
          {channels.map((channel) => (
            <Group key={channel.id} gap={2} wrap="nowrap" style={{ minWidth: 0 }}>
              <Button
                variant={currentChannelId === channel.id ? 'filled' : 'subtle'}
                justify="flex-start"
                style={{ minWidth: 0, flex: 1 }}
                onClick={() => {
                  selectChannel(channel.id);
                  onSelect?.();
                }}
                title={`# ${channel.name}`}
              >
                <Text span truncate># {channel.name}</Text>
              </Button>
              {channel.removable && (
                <Menu shadow="md" position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      aria-label={`Управление каналом ${channel.name}`}
                      title={`Управление каналом ${channel.name}`}
                    >
                      ⋯
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => openModal('rename', channel.id)}>Переименовать</Menu.Item>
                    <Menu.Item color="red" onClick={() => openModal('remove', channel.id)}>Удалить</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          ))}
        </Stack>
      </ScrollArea>
      <ChannelModals channels={channels} onCreated={onSelect} />
    </>
  );
}
