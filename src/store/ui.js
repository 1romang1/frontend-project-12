import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

export const UiStoreContext = createContext(null);

export function createUiStore() {
  return createStore((set) => ({
    currentChannelId: null,
    modal: null,
    modalChannelId: null,
    selectChannel: (currentChannelId) => set({ currentChannelId }),
    openModal: (modal, modalChannelId = null) => set({ modal, modalChannelId }),
    closeModal: () => set({ modal: null, modalChannelId: null }),
  }));
}

export function useUiStoreApi() {
  const store = useContext(UiStoreContext);
  if (!store) throw new Error('UiStoreContext.Provider is missing');
  return store;
}

export function useUiStore(selector) {
  return useStore(useUiStoreApi(), selector);
}
