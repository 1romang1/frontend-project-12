
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import App from './App.jsx';
import { subscribeToChatEvents } from './services/socketEvents.js';

// Hexlet's automated tests may supply their own socket to this function.
const init = async (socket) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 15_000,
      },
    },
  });

  subscribeToChatEvents(socket, queryClient);

  // Use MemoryRouter for server-side tests
  // and BrowserRouter for the browser.
  const Router = typeof window === 'undefined'
    ? MemoryRouter
    : BrowserRouter;

  return (
    <MantineProvider>
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
  );
};

export default init;
