import { describe, expect, test } from 'vitest';
import { createI18n } from '../src/i18n.js';
import ru from '../src/locales/ru.json';
import { validateSignup } from '../src/utils/signup.js';
import { validateChannelName } from '../src/utils/channels.js';

const i18n = createI18n();

function collectPaths(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : collectPaths(value, path);
  });
}

describe('Russian interface locale', () => {
  test('has a fixed default Russian locale without browser language detection', () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBe('ru');
    expect(i18n.t('common.appName')).toBe('Hexlet Chat');
  });

  test('every defined translation is resolvable', () => {
    for (const key of collectPaths(ru)) {
      expect(i18n.exists(key), key).toBe(true);
      expect(i18n.t(key), key).not.toBe(key);
    }
  });

  test('interpolates dynamic labels and errors', () => {
    expect(i18n.t('channels.manage', { name: 'general' })).toBe('Управление каналом');
    expect(i18n.t('channels.removeConfirm', { name: 'test' })).toContain('«# test»');
    expect(i18n.t('chat.messagesCount', { number: 3 })).toBe('Сообщений: 3');
    expect(i18n.t('errors.server', { status: 503 })).toBe('Ошибка сервера (503)');
  });

  test('signup validation uses translated messages', () => {
    const errors = validateSignup({ username: '', password: '', confirmPassword: '' });
    expect(errors.username).toBe(i18n.t('validation.usernameRequired'));
    expect(errors.password).toBe(i18n.t('validation.passwordRequired'));
    expect(errors.confirmPassword).toBe(i18n.t('validation.confirmPasswordRequired'));
  });

  test('channel validation uses translated messages', () => {
    const channels = [{ id: '1', name: 'general' }];
    expect(validateChannelName('ab', channels)).toBe(i18n.t('validation.channelLength'));
    expect(validateChannelName('general', channels)).toBe(i18n.t('validation.channelDuplicate'));
  });
});
