import { create } from 'zustand';

export const useUiStore = create((set) => ({
  currentChannelId: null,
  modal: null,
  modalChannelId: null,
  selectChannel: (currentChannelId) => set({ currentChannelId }),
  openModal: (modal, modalChannelId = null) => set({ modal, modalChannelId }),
  closeModal: () => set({ modal: null, modalChannelId: null }),
}));
