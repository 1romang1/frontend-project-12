import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';

import App from './App.jsx';
import NetworkStatusListener from './components/NetworkStatusListener.jsx';
import { notifyRequestError } from './services/toasts.js';
import i18n from './i18n.js';
import { subscribeToChatEvents } from './services/socketEvents.js';

// Hexlet's automated tests may supply their own socket to this function.
const init = async (socket) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => notifyRequestError(error),
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 15_000,
      },
    },
  });

  subscribeToChatEvents(socket, queryClient);

  // Use MemoryRouter for server-side tests and BrowserRouter in the browser.
  const Router = typeof window === 'undefined' ? MemoryRouter : BrowserRouter;

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <Notifications position="top-right" limit={3} />
        <NetworkStatusListener />
        <QueryClientProvider client={queryClient}>
          <Router
            {...(typeof window === 'undefined'
              ? { initialEntries: ['/login'] }
              : {})}
          >
            <App />
          </Router>
        </QueryClientProvider>
      </MantineProvider>
    </I18nextProvider>
  );
};

export default init;
