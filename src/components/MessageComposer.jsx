import { Alert, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function MessageComposer({ channelId }) {
  const queryClient = useQueryClient();
  const username = useAuthStore((state) => state.username);
  const form = useForm({
    initialValues: { body: '' },
    validate: { body: (value) => value.trim() ? null : 'Введите сообщение' },
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
          <Alert color="red" role="alert">Не удалось отправить сообщение. Проверьте соединение и повторите попытку.</Alert>
        )}
        <Group align="flex-start" wrap="nowrap">
          <TextInput
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            disabled={!channelId || mutation.isPending}
            w="100%"
            {...form.getInputProps('body')}
          />
          <Button type="submit" disabled={!channelId || !form.values.body.trim()} loading={mutation.isPending}>
            Отправить
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
