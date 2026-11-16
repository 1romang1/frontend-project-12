import { beforeEach, describe, expect, test, vi } from 'vitest';
import { validateChannelName, getDefaultChannelId } from '../src/utils/channels.js';
import { subscribeToChatEvents } from '../src/services/socketEvents.js';
import { createUiStore } from '../src/store/ui.js';

const channels = [
  { id: '1', name: 'general', removable: false },
  { id: '2', name: 'random', removable: false },
  { id: '3', name: 'test channel', removable: true },
];

describe('channel validation', () => {
  test('requires 3 to 20 trimmed characters', () => {
    expect(validateChannelName(' ab ', channels)).toBeTruthy();
    expect(validateChannelName(' x'.repeat(11), channels)).toBeTruthy();
    expect(validateChannelName(' new channel ', channels)).toBe(null);
  });

  test('rejects duplicate names, ignoring case and outer spaces', () => {
    expect(validateChannelName(' GENERAL ', channels)).toBeTruthy();
    expect(validateChannelName(' test CHANNEL ', channels)).toBeTruthy();
    expect(validateChannelName(' test CHANNEL ', channels, '3')).toBe(null);
  });

  test('uses general as the fallback channel', () => {
    expect(getDefaultChannelId(channels, '3')).toBe('1');
    expect(getDefaultChannelId(channels, '1')).toBe('2');
  });
});

describe('WebSocket channel operations', () => {
  let uiStore;
  beforeEach(() => {
    uiStore = createUiStore();
  });

  function fakeClient() {
    const events = {};
    const data = new Map([
      ['channels', [...channels]],
      ['messages', [
        { id: 'm1', channelId: '1', body: 'general' },
        { id: 'm3', channelId: '3', body: 'private' },
      ]],
    ]);
    const queryClient = {
      getQueryData: ([key]) => data.get(key),
      setQueryData: ([key], updater) => {
        data.set(key, typeof updater === 'function' ? updater(data.get(key)) : updater);
      },
      invalidateQueries: vi.fn().mockResolvedValue(undefined),
    };
    subscribeToChatEvents({ on: (name, handler) => { events[name] = handler; } }, queryClient, uiStore);
    return { events, data, queryClient };
  }

  test('removal moves users to general and clears the removed channel messages', () => {
    const { events, data, queryClient } = fakeClient();
    uiStore.getState().selectChannel('3');
    events.removeChannel({ id: '3' });
    expect(uiStore.getState().currentChannelId).toBe('1');
    expect(data.get('channels').map(({ id }) => id)).toEqual(['1', '2']);
    expect(data.get('messages').map(({ id }) => id)).toEqual(['m1']);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['messages'] });
  });

  test('renaming a channel updates cached names in place', () => {
    const { events, data } = fakeClient();
    events.renameChannel({ id: '3', name: 'renamed' });
    expect(data.get('channels').find(({ id }) => id === '3').name).toBe('renamed');
    expect(data.get('channels')).toHaveLength(3);
  });

  test('new channel WebSocket events are deduplicated', () => {
    const { events, data } = fakeClient();
    events.newChannel({ id: '4', name: 'news', removable: true });
    events.newChannel({ id: '4', name: 'news', removable: true });
    expect(data.get('channels')).toHaveLength(4);
  });
});
