import { hasLength } from '@mantine/form';
import i18n from '../i18n.js';

export const normalizedChannelName = (name) => name.trim().toLocaleLowerCase();

export function validateChannelName(value, channels, exceptId = null) {
  const name = value.trim();
  const lengthError = hasLength({ min: 3, max: 20 }, i18n.t('validation.channelLength'))(name);
  if (lengthError) return lengthError;

  const duplicate = channels.some((channel) =>
    channel.id !== exceptId && normalizedChannelName(channel.name) === normalizedChannelName(name)
  );
  return duplicate ? i18n.t('validation.channelDuplicate') : null;
}

export function getDefaultChannelId(channels = [], removedId = null) {
  const available = channels.filter(({ id }) => id !== removedId);
  const general = available.find(({ name }) => normalizedChannelName(name) === 'general');
  return (general ?? available.find(({ removable }) => !removable) ?? available[0])?.id ?? null;
}
