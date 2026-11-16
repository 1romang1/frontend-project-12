import { describe, expect, test, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import init from '../src/init.jsx';

describe('Hexlet Chat entry point', () => {
  test('init takes an injected socket and returns React markup', async () => {
    const socket = { on: vi.fn() };
    const markup = renderToString(await init(socket));
    expect(markup).toContain('Hexlet Chat');
    // Socket listeners are registered after mounting, and removed on unmount.
  });
});
