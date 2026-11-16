import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { handleChannelRemoval } from '../services/channelCache.js';
import { useUiStore } from '../store/ui.js';
import { validateChannelName } from '../utils/channels.js';

function ChannelNameModal({ type, channels, channel, onCreated }) {
  const queryClient = useQueryClient();
  const selectChannel = useUiStore((state) => state.selectChannel);
  const closeModal = useUiStore((state) => state.closeModal);
  const isCreate = type === 'create';
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: isCreate ? '' : channel?.name ?? '' },
    validate: {
      name: (value) => validateChannelName(value, channels, isCreate ? null : channel?.id),
    },
  });
  const mutation = useMutation({
    mutationFn: isCreate ? api.createChannel : api.renameChannel,
    onSuccess: (result) => {
      queryClient.setQueryData(['channels'], (old = []) => {
        if (isCreate) return old.some(({ id }) => id === result.id) ? old : [...old, result];
        return old.map((entry) => entry.id === result.id ? { ...entry, ...result } : entry);
      });
      if (isCreate) {
        selectChannel(result.id);
        onCreated?.();
      }
      closeModal();
    },
  });

  const handleSubmit = (values) => {
    if (mutation.isPending) return;
    const name = values.name.trim();
    if (isCreate) mutation.mutate({ name });
    else mutation.mutate({ id: channel.id, name });
  };

  return (
    <Modal
      opened
      centered
      title={isCreate ? 'Добавить канал' : 'Переименовать канал'}
      onClose={closeModal}
      closeOnEscape={!mutation.isPending}
      closeOnClickOutside={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Название канала"
            aria-label="Название канала"
            required
            data-autofocus
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          {mutation.isError && (
            <Alert color="red" role="alert">
              {mutation.error?.status === 409
                ? 'Канал с таким названием уже существует'
                : 'Не удалось сохранить канал. Проверьте соединение и повторите попытку.'}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal} disabled={mutation.isPending}>Отмена</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isCreate ? 'Создать' : 'Переименовать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

function RemoveChannelModal({ channel }) {
  const queryClient = useQueryClient();
  const closeModal = useUiStore((state) => state.closeModal);
  const mutation = useMutation({
    mutationFn: api.removeChannel,
    onSuccess: () => {
      handleChannelRemoval(queryClient, channel.id);
      closeModal();
    },
  });
  return (
    <Modal
      opened
      centered
      title="Удалить канал"
      onClose={closeModal}
      closeOnEscape={!mutation.isPending}
      closeOnClickOutside={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!mutation.isPending) mutation.mutate(channel.id);
      }}>
        <Stack>
          <Text>Удалить канал «# {channel.name}»? Все его сообщения также будут удалены.</Text>
          {mutation.isError && <Alert color="red" role="alert">Не удалось удалить канал. Повторите попытку.</Alert>}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal} disabled={mutation.isPending}>Отмена</Button>
            <Button color="red" type="submit" loading={mutation.isPending}>Удалить</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default function ChannelModals({ channels, onCreated }) {
  const modal = useUiStore((state) => state.modal);
  const modalChannelId = useUiStore((state) => state.modalChannelId);
  const channel = channels.find(({ id }) => id === modalChannelId);
  if (modal === 'create') {
    return <ChannelNameModal key="create" type="create" channels={channels} onCreated={onCreated} />;
  }
  if (modal === 'rename' && channel?.removable) {
    return <ChannelNameModal key={`rename-${channel.id}`} type="rename" channels={channels} channel={channel} />;
  }
  if (modal === 'remove' && channel?.removable) {
    return <RemoveChannelModal key={`remove-${channel.id}`} channel={channel} />;
  }
  return null;
}
