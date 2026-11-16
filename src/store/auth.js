import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

// Context is a definition, not a shared store. Every init() creates a new store.
export const AuthStoreContext = createContext(null);

export function createAuthStore() {
  return createStore((set) => ({
    token: null,
    username: null,
    login: ({ token, username }) => set({ token, username }),
    logout: () => set({ token: null, username: null }),
  }));
}

export function useAuthStore(selector) {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error('AuthStoreContext.Provider is missing');
  return useStore(store, selector);
}
