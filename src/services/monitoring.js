import * as Sentry from '@sentry/react';

// Only report production browser errors after a DSN has been configured.
export function shouldEnableMonitoring({ dsn, isProduction, isServer } = {}) {
  return isProduction === true
    && isServer !== true
    && typeof dsn === 'string'
    && dsn.trim().length > 0;
}

export function initializeMonitoring({
  dsn = import.meta.env.VITE_BUGSINK_DSN,
  isProduction = import.meta.env.PROD,
  isServer = import.meta.env.SSR,
} = {}) {
  if (!shouldEnableMonitoring({ dsn, isProduction, isServer })) return false;

  Sentry.init({
    dsn: dsn.trim(),
    environment: 'production',
    tracesSampleRate: 0, // Bugsink collects errors, not performance traces.
    sendDefaultPii: false, // Do not automatically report personally identifiable information.
  });
  return true;
}

// React 19 forwards caught, uncaught, and recoverable rendering errors here.
export function reactErrorOptions() {
  return {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  };
}
