import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAuthStore } from '../src/store/auth.js';
import { createUiStore } from '../src/store/ui.js';
import { createApiClient } from '../src/api/client.js';
import { subscribeToChatEvents } from '../src/services/socketEvents.js';

const okResponse = () => ({ ok: true, status: 200, text: async () => '[]' });

afterEach(() => vi.unstubAllGlobals());

describe('independent application instances', () => {
  test('auth credentials do not leak between store instances', () => {
    const first = createAuthStore();
    const second = createAuthStore();
    first.getState().login({ token: 'secret-1', username: 'alice' });
    expect(first.getState().token).toBe('secret-1');
    expect(second.getState().token).toBe(null);
    first.getState().logout();
    expect(first.getState().username).toBe(null);
  });

  test('selected channel and modal do not leak to a second instance', () => {
    const first = createUiStore();
    const second = createUiStore();
    first.getState().selectChannel('custom-channel');
    first.getState().openModal('rename', 'custom-channel');
    expect(second.getState().currentChannelId).toBe(null);
    expect(second.getState().modal).toBe(null);
  });

  test('each API client reads only its instance token', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => okResponse()));
    const first = createAuthStore();
    const second = createAuthStore();
    first.getState().login({ token: 'token-first', username: 'first' });
    const api1 = createApiClient(() => first.getState().token);
    const api2 = createApiClient(() => second.getState().token);
    await api1.channels();
    await api2.channels();
    const calls = fetch.mock.calls;
    expect(calls[0][1].headers.Authorization).toBe('Bearer token-first');
    expect(calls[1][1].headers.Authorization).toBeUndefined();
  });

  test('socket subscriptions can be removed after unmount', () => {
    const handlers = new Map();
    const socket = {
      on: vi.fn((name, fn) => handlers.set(name, fn)),
      off: vi.fn((name) => handlers.delete(name)),
    };
    const queryClient = { setQueryData: vi.fn() };
    const unsubscribe = subscribeToChatEvents(socket, queryClient, createUiStore());
    expect(socket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
    unsubscribe();
    expect(socket.off).toHaveBeenCalledTimes(6);
    expect(handlers.size).toBe(0);
  });
});
