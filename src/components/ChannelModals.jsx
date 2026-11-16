import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client.js';
import { handleChannelRemoval } from '../services/channelCache.js';
import { notifyChannelSuccess, notifyRequestError } from '../services/toasts.js';
import { useUiStore } from '../store/ui.js';
import { validateChannelName } from '../utils/channels.js';

function ChannelNameModal({ type, channels, channel, onCreated }) {
  const { t } = useTranslation();
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
      notifyChannelSuccess(isCreate ? 'created' : 'renamed', result.name);
      closeModal();
    },
    onError: (error) => {
      // HTTP 409 is a validation error already displayed in the modal.
      if (error?.status !== 409) notifyRequestError(error, 'channels.saveFailed');
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
      title={isCreate ? t('channels.createTitle') : t('channels.renameTitle')}
      onClose={closeModal}
      closeOnEscape={!mutation.isPending}
      closeOnClickOutside={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label={t('channels.name')}
            aria-label={t('channels.name')}
            required
            data-autofocus
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          {mutation.isError && (
            <Alert color="red" role="alert">
              {mutation.error?.status === 409 ? t('channels.alreadyExists') : t('channels.saveFailed')}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal} disabled={mutation.isPending}>{t('common.cancel')}</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isCreate ? t('channels.create') : t('channels.rename')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

function RemoveChannelModal({ channel }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const closeModal = useUiStore((state) => state.closeModal);
  const mutation = useMutation({
    mutationFn: api.removeChannel,
    onSuccess: () => {
      handleChannelRemoval(queryClient, channel.id);
      notifyChannelSuccess('removed', channel.name);
      closeModal();
    },
    onError: (error) => notifyRequestError(error, 'channels.removeFailed'),
  });
  return (
    <Modal
      opened
      centered
      title={t('channels.removeTitle')}
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
          <Text>{t('channels.removeConfirm', { name: channel.name })}</Text>
          {mutation.isError && <Alert color="red" role="alert">{t('channels.removeFailed')}</Alert>}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal} disabled={mutation.isPending}>{t('common.cancel')}</Button>
            <Button color="red" type="submit" loading={mutation.isPending}>{t('channels.remove')}</Button>
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
