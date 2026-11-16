import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';

import App from './App.jsx';
import SocketSubscriptions from './components/SocketSubscriptions.jsx';
import NetworkStatusListener from './components/NetworkStatusListener.jsx';
import { ApiContext, createApiClient } from './api/client.js';
import { AuthStoreContext, createAuthStore } from './store/auth.js';
import { UiStoreContext, createUiStore } from './store/ui.js';
import { ToastsContext } from './services/toastsContext.js';
import { createToasts } from './services/toasts.js';
import { createI18n } from './i18n.js';

// Every invocation creates its own auth, UI, query, translation, and notification state.
const init = async (socket) => {
  const authStore = createAuthStore();
  const uiStore = createUiStore();
  const i18n = createI18n();
  const api = createApiClient(() => authStore.getState().token, i18n.t.bind(i18n));
  const toasts = createToasts(i18n);
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => toasts.notifyRequestError(error),
    }),
    defaultOptions: {
      queries: { retry: 1, staleTime: 15_000 },
    },
  });

  // Hexlet renders this in a browser, but the smoke test also SSR-renders it.
  const Router = typeof window === 'undefined' ? MemoryRouter : BrowserRouter;

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <Notifications position="top-right" limit={3} />
        <AuthStoreContext.Provider value={authStore}>
          <UiStoreContext.Provider value={uiStore}>
            <ApiContext.Provider value={api}>
              <ToastsContext.Provider value={toasts}>
                <NetworkStatusListener />
                <QueryClientProvider client={queryClient}>
                  <Router
                    {...(typeof window === 'undefined'
                      ? { initialEntries: ['/login'] }
                      : {})}
                  >
                    <SocketSubscriptions socket={socket} queryClient={queryClient} uiStore={uiStore} />
                    <App />
                  </Router>
                </QueryClientProvider>
              </ToastsContext.Provider>
            </ApiContext.Provider>
          </UiStoreContext.Provider>
        </AuthStoreContext.Provider>
      </MantineProvider>
    </I18nextProvider>
  );
};

export default init;
