import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { notifications } from '@mantine/notifications';
import { createI18n } from '../src/i18n.js';
import { createToasts } from '../src/services/toasts.js';

vi.mock('@mantine/notifications', () => ({
  notifications: { show: vi.fn(), hide: vi.fn() },
}));

let dismissOffline;
let notifyChannelSuccess;
let notifyOffline;
let notifyRequestError;
const i18n = createI18n();
beforeEach(() => {
  ({ dismissOffline, notifyChannelSuccess, notifyOffline, notifyRequestError } = createToasts(i18n));
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('toast notifications', () => {
  test('shows a translated success toast after creating a channel', () => {
    notifyChannelSuccess('created', 'demo-created');
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      color: 'green', message: i18n.t('notifications.channelCreated', { name: 'demo-created' }),
    }));
  });

  test('shows a translated success toast after renaming a channel', () => {
    notifyChannelSuccess('renamed', 'demo-renamed');
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      color: 'green', message: i18n.t('notifications.channelRenamed', { name: 'demo-renamed' }),
    }));
  });

  test('shows a translated success toast after deleting a channel', () => {
    notifyChannelSuccess('removed', 'demo-removed');
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      color: 'green', message: i18n.t('notifications.channelRemoved', { name: 'demo-removed' }),
    }));
  });

  test('shows a translated loading error for HTTP failures', () => {
    vi.stubGlobal('navigator', { onLine: true });
    notifyRequestError({ status: 500 });
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      color: 'red', message: i18n.t('notifications.loadFailed'),
    }));
  });

  test('notifies about lost network and dismisses it on reconnect', () => {
    vi.stubGlobal('navigator', { onLine: false });
    notifyOffline();
    notifyRequestError(new TypeError('Failed to fetch'));
    expect(notifications.show).toHaveBeenCalledTimes(1);
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      message: i18n.t('notifications.offline'),
    }));
    dismissOffline();
    expect(notifications.hide).toHaveBeenCalledWith('network-offline');
  });

  test('reports a connection error when fetch fails without an HTTP status', () => {
    vi.stubGlobal('navigator', { onLine: true });
    notifyRequestError(new TypeError('Failed to fetch'));
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({
      message: i18n.t('notifications.connectionFailed'),
    }));
  });
});
