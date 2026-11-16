import { getDefaultChannelId } from '../utils/channels.js';
import { useUiStore } from '../store/ui.js';

// Reconcile a removed channel for both the actor and other connected users.
export function handleChannelRemoval(queryClient, removedId) {
  const channels = queryClient.getQueryData(['channels']) ?? [];
  const fallbackId = getDefaultChannelId(channels, removedId);

  queryClient.setQueryData(['channels'], (old) =>
    old?.filter(({ id }) => id !== removedId) ?? old
  );
  queryClient.setQueryData(['messages'], (old) =>
    old?.filter(({ channelId }) => channelId !== removedId) ?? old
  );

  const ui = useUiStore.getState();
  if (ui.currentChannelId === removedId) ui.selectChannel(fallbackId);
  if (ui.modalChannelId === removedId) ui.closeModal();

  // The backend owns message deletion; re-fetch to reconcile with its state.
  void queryClient.invalidateQueries({ queryKey: ['messages'] });
}
