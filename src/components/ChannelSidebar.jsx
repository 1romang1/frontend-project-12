import { Alert, Button, Group, Modal, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useUiStore } from '../store/ui.js';

export default function ChannelSidebar({ channels, onSelect }) {
  const queryClient = useQueryClient();
  const currentChannelId = useUiStore((state) => state.currentChannelId);
  const selectChannel = useUiStore((state) => state.selectChannel);
  const modal = useUiStore((state) => state.modal);
  const openModal = useUiStore((state) => state.openModal);
  const closeModal = useUiStore((state) => state.closeModal);
  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => value.trim().length < 3 || value.trim().length > 20
        ? 'Название должно содержать от 3 до 20 символов' : null,
    },
  });
  const mutation = useMutation({
    mutationFn: api.createChannel,
    onSuccess: (channel) => {
      queryClient.setQueryData(['channels'], (old = []) =>
        old.some(({ id }) => id === channel.id) ? old : [...old, channel],
      );
      selectChannel(channel.id);
      closeModal();
      form.reset();
      onSelect?.();
    },
  });

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={700}>Каналы</Text>
        <Button size="compact-sm" variant="light" aria-label="Добавить канал" onClick={() => openModal('create')}>+</Button>
      </Group>
      <ScrollArea h="calc(100dvh - 190px)">
        <Stack gap={4}>
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={currentChannelId === channel.id ? 'filled' : 'subtle'}
              justify="flex-start"
              fullWidth
              onClick={() => {
                selectChannel(channel.id);
                onSelect?.();
              }}
            >
              # {channel.name}
            </Button>
          ))}
        </Stack>
      </ScrollArea>
      <Modal opened={modal === 'create'} onClose={closeModal} title="Добавить канал" centered>
        <form onSubmit={form.onSubmit((values) => mutation.mutate({ name: values.name.trim() }))}>
          <Stack>
            <TextInput autoFocus label="Название канала" required {...form.getInputProps('name')} />
            {mutation.isError && <Alert color="red" role="alert">Не удалось создать канал. Повторите попытку.</Alert>}
            <Group justify="flex-end">
              <Button variant="default" onClick={closeModal}>Отмена</Button>
              <Button type="submit" loading={mutation.isPending}>Создать</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
