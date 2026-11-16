import { hasLength } from '@mantine/form';

const lengthValidator = hasLength(
  { min: 3, max: 20 },
  'Название должно содержать от 3 до 20 символов',
);

export const normalizedChannelName = (name) => name.trim().toLocaleLowerCase();

export function validateChannelName(value, channels, exceptId = null) {
  const name = value.trim();
  const lengthError = lengthValidator(name);
  if (lengthError) return lengthError;

  const duplicate = channels.some((channel) =>
    channel.id !== exceptId && normalizedChannelName(channel.name) === normalizedChannelName(name)
  );
  return duplicate ? 'Такое название канала уже существует' : null;
}

export function getDefaultChannelId(channels = [], removedId = null) {
  const available = channels.filter(({ id }) => id !== removedId);
  const general = available.find(({ name }) => normalizedChannelName(name) === 'general');
  return (general ?? available.find(({ removable }) => !removable) ?? available[0])?.id ?? null;
}
