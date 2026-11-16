import { hasLength } from '@mantine/form';
import { translateRu } from './translate.js';

export const normalizedChannelName = (name) => name.trim().toLocaleLowerCase();

export function validateChannelName(value, channels, exceptId = null, t = translateRu) {
  const name = value.trim();
  const lengthError = hasLength({ min: 3, max: 20 }, t('validation.channelLength'))(name);
  if (lengthError) return lengthError;

  const duplicate = channels.some((channel) =>
    channel.id !== exceptId && normalizedChannelName(channel.name) === normalizedChannelName(name)
  );
  return duplicate ? t('validation.channelDuplicate') : null;
}

export function getDefaultChannelId(channels = [], removedId = null) {
  const available = channels.filter(({ id }) => id !== removedId);
  const general = available.find(({ name }) => normalizedChannelName(name) === 'general');
  return (general ?? available.find(({ removable }) => !removable) ?? available[0])?.id ?? null;
}
