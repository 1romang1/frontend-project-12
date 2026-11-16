import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as Sentry from '@sentry/react';
import { initializeMonitoring, reactErrorOptions, shouldEnableMonitoring } from '../src/services/monitoring.js';

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  reactErrorHandler: vi.fn(() => () => {}),
}));

beforeEach(() => vi.clearAllMocks());

const options = {
  dsn: 'https://public-key@bugsink.example/123',
  isProduction: true,
  isServer: false,
};

describe('Bugsink error monitoring', () => {
  test('enables reporting when the production browser has a DSN', () => {
    expect(shouldEnableMonitoring(options)).toBe(true);
  });

  test('disables reporting without a valid DSN', () => {
    expect(shouldEnableMonitoring({ ...options, dsn: undefined })).toBe(false);
    expect(shouldEnableMonitoring({ ...options, dsn: '   ' })).toBe(false);
  });

  test('disables reporting during local development and server rendering', () => {
    expect(shouldEnableMonitoring({ ...options, isProduction: false })).toBe(false);
    expect(shouldEnableMonitoring({ ...options, isServer: true })).toBe(false);
  });

  test('does not initialize the SDK when monitoring is disabled', () => {
    expect(initializeMonitoring({ ...options, dsn: '' })).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  test('initializes the SDK without tracing or default PII', () => {
    expect(initializeMonitoring({ ...options, dsn: ` ${options.dsn} ` })).toBe(true);
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: options.dsn,
      environment: 'production',
      tracesSampleRate: 0,
      sendDefaultPii: false,
    });
  });

  test('wires React 19 rendering error hooks', () => {
    const handlers = reactErrorOptions();
    expect(Sentry.reactErrorHandler).toHaveBeenCalledTimes(3);
    expect(handlers).toEqual({
      onUncaughtError: expect.any(Function),
      onCaughtError: expect.any(Function),
      onRecoverableError: expect.any(Function),
    });
  });
});
