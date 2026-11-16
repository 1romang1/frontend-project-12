import { handleChannelRemoval } from './channelCache.js';

export function subscribeToChatEvents(socket, queryClient, uiStore) {
  const updateList = (key, item, operation) => {
    queryClient.setQueryData([key], (old) => {
      if (!old) return old;
      if (operation === 'remove') return old.filter(({ id }) => id !== item.id);
      if (operation === 'rename') {
        return old.map((entry) => (entry.id === item.id ? { ...entry, ...item } : entry));
      }
      return old.some(({ id }) => id === item.id) ? old : [...old, item];
    });
  };

  const handlers = [
    ['newMessage', (message) => updateList('messages', message, 'add')],
    ['renameMessage', (message) => updateList('messages', message, 'rename')],
    ['removeMessage', (message) => updateList('messages', message, 'remove')],
    ['newChannel', (channel) => updateList('channels', channel, 'add')],
    ['renameChannel', (channel) => updateList('channels', channel, 'rename')],
    ['removeChannel', ({ id }) => handleChannelRemoval(queryClient, id, uiStore)],
  ];
  for (const [event, handler] of handlers) socket.on(event, handler);
  return () => {
    for (const [event, handler] of handlers) socket.off?.(event, handler);
  };
}
