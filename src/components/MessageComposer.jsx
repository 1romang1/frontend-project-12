import { Alert, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function MessageComposer({ channelId }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const username = useAuthStore((state) => state.username);
  const form = useForm({
    initialValues: { body: '' },
    validate: { body: (value) => value.trim() ? null : t('chat.messageRequired') },
  });
  const mutation = useMutation({
    mutationFn: api.sendMessage,
    onSuccess: (message) => {
      queryClient.setQueryData(['messages'], (old = []) =>
        old.some(({ id }) => id === message.id) ? old : [...old, message],
      );
      form.reset();
    },
  });

  return (
    <form onSubmit={form.onSubmit(({ body }) => {
      if (channelId) mutation.mutate({ body: body.trim(), channelId, username });
    })}>
      <Stack gap="xs">
        {mutation.isError && (
          <Alert color="red" role="alert">{t('chat.sendFailed')}</Alert>
        )}
        <Group align="flex-start" wrap="nowrap">
          <TextInput
            aria-label={t('chat.newMessage')}
            placeholder={t('chat.messagePlaceholder')}
            disabled={!channelId || mutation.isPending}
            w="100%"
            {...form.getInputProps('body')}
          />
          <Button type="submit" disabled={!channelId || !form.values.body.trim()} loading={mutation.isPending}>
            {t('chat.send')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
