import { create } from 'zustand';

export const useUiStore = create((set) => ({
  currentChannelId: null,
  modal: null,
  selectChannel: (currentChannelId) => set({ currentChannelId }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
