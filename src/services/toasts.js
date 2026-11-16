import { notifications } from '@mantine/notifications';

const dedupeDuration = 4500;

export function createToasts(i18n) {
  const recentToasts = new Map();

  function showToast({ id, color, titleKey, messageKey, options }) {
    const now = Date.now();
    const previous = recentToasts.get(id);
    if (previous !== undefined && now - previous < dedupeDuration) return;
    recentToasts.set(id, now);
    notifications.show({
      id,
      color,
      title: i18n.t(titleKey),
      message: i18n.t(messageKey, options),
      autoClose: dedupeDuration,
    });
  }

  function notifyOffline() {
    showToast({
      id: 'network-offline', color: 'red',
      titleKey: 'notifications.errorTitle', messageKey: 'notifications.offline',
    });
  }

  function dismissOffline() {
    notifications.hide('network-offline');
    recentToasts.delete('network-offline');
  }

  function notifyRequestError(error, messageKey = 'notifications.loadFailed') {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      notifyOffline();
      return;
    }
    if (!error?.status) {
      showToast({
        id: 'network-request-error', color: 'red',
        titleKey: 'notifications.errorTitle', messageKey: 'notifications.connectionFailed',
      });
      return;
    }
    showToast({
      id: 'server-request-error', color: 'red',
      titleKey: 'notifications.errorTitle', messageKey,
    });
  }

  const successKeys = {
    created: 'notifications.channelCreated',
    renamed: 'notifications.channelRenamed',
    removed: 'notifications.channelRemoved',
  };
  function notifyChannelSuccess(action, name) {
    const messageKey = successKeys[action];
    if (!messageKey) throw new Error(`Unknown channel action: ${action}`);
    showToast({
      id: `channel-${action}-${name}`,
      color: 'green',
      titleKey: 'notifications.successTitle',
      messageKey,
      options: { name },
    });
  }

  return { notifyOffline, dismissOffline, notifyRequestError, notifyChannelSuccess };
}
